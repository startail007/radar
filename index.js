import { noise_perlin } from "./noise.js";

const setImageDataPixel = (imageData, x, y, r, g, b, a) => {
  const k = (y * imageData.width + x) * 4;
  imageData.data[k + 0] = r;
  imageData.data[k + 1] = g;
  imageData.data[k + 2] = b;
  imageData.data[k + 3] = a;
};
const loopRect = (x, y, w, h, fun) => {
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      fun(i, j);
    }
  }
};
const noiseAPI = (x, y, xN = 0, yN = 0) => {
  return 0.5 * noise_perlin([xN * x, yN * y], [xN, yN]) + 0.5;
};

const app = new PIXI.Application({
  resizeTo: window,
});
document.body.appendChild(app.view);
const aVertexPosition = [-100, -100, 100, -100, 100, 100, -100, 100];
const aUvs = [0, 0, 1, 0, 1, 1, 0, 1];
const aIndexs = [0, 1, 2, 0, 2, 3];
const geometry = new PIXI.Geometry().addAttribute("aVertexPosition", aVertexPosition, 2).addAttribute("aUvs", aUvs, 2).addIndex(aIndexs);

const vertexSrc = `
  
      precision mediump float;
  
      attribute vec2 aVertexPosition;
      attribute vec2 aUvs;
  
      uniform mat3 translationMatrix;
      uniform mat3 projectionMatrix;
  
      varying vec2 vUvs;
      varying vec3 vColor;
  
      void main() {
  
          vUvs = aUvs;
          gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
  
      }`;

const fragmentSrc = `
  
      precision mediump float;
      varying vec2 vUvs;
  
      uniform sampler2D uSampler;
          float len(vec2 v){
          return sqrt(v.x*v.x + v.y*v.y);
      }
      const float pi = 3.14159;
      void main() {
          vec2 uv = vec2(1.0)-2.0*vUvs;
          float r = len(uv);    
          if(r <= 1.0){
              float a = 0.5*atan(uv.y,uv.x)/pi+0.5;  
            gl_FragColor = texture2D(uSampler, vec2(a,r));
          }else{
              gl_FragColor = vec4(0.0,0.0,0.0,1.0);
          }
      }`;

const r = 100;
const circumference = Math.ceil(r * 2 * Math.PI);
let rand = [Math.random(), Math.random()];
let index = 0;

const canvas = document.createElement("canvas");
canvas.width = circumference;
canvas.height = r;
const ctx = canvas.getContext("2d");

/*canvas.style.zIndex = 999;
canvas.style.position = "absolute";
canvas.style.left = "0px";
canvas.style.top = "0px";
document.body.appendChild(canvas);*/

const renderTexture = PIXI.Texture.from(canvas);
const uniforms = {
  uSampler: renderTexture,
};
const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);

const rader = new PIXI.Mesh(geometry, shader);
rader.position.set(100, 100);
rader.scale.set(1);
app.stage.addChild(rader);

const box = new PIXI.Sprite(renderTexture);
box.position.set(0, 200);
app.stage.addChild(box);

const data = new Array(circumference).fill(0).map(() => new Array(r));

const updateTexture = (x, y, w, h, offsetX = 0, offsetY = 0) => {
  //取得資料並設定到data
  const xN = 20 * 2 * Math.PI;
  const yN = 20;
  loopRect(x, y, w, h, (x, y) => (data[x][y] = noiseAPI(x / circumference + offsetX, y / r + offsetY, xN, yN)));
  //取得data並轉成ImageData及繪製到canvas
  const _data = data.slice(x, x + w).map((el) => el.slice(y, y + h));
  const imageData = ctx.createImageData(w, h);
  loopRect(0, 0, w, h, (x, y) => setImageDataPixel(imageData, x, y, 0, 255 * _data[x][y], 0, 255));
  ctx.putImageData(imageData, x, y);
};

updateTexture(0, 0, circumference, r);
app.ticker.add((delta) => {
  const n = Math.floor(0.01 * circumference * delta);
  const _rand = rand;
  if (index + n >= circumference) {
    rand = [Math.random(), Math.random()];
  }
  if (circumference - index >= n) {
    updateTexture(index, 0, n, r, ..._rand);
  } else {
    const ww = circumference - index;
    updateTexture(index, 0, ww, r, ..._rand);
    updateTexture(0, 0, n - ww, r, ...rand);
  }
  index += n;
  index %= circumference;
  renderTexture.update();
});
