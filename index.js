import { noise_perlin, noise_value } from "./noise.js";
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

const canvas = document.createElement("canvas");
const r = 100;
const circumference = Math.ceil(r * 2 * Math.PI);
canvas.width = circumference;
canvas.height = r;
canvas.style.zIndex = 999;
canvas.style.position = "absolute";
canvas.style.left = "0px";
canvas.style.top = "0px";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let rand = [Math.random(), Math.random()];
let index = 0;
const setImageDataPixel = (imageData, x, y, r, g, b, a) => {
  const k = (y * imageData.width + x) * 4;
  imageData.data[k + 0] = r;
  imageData.data[k + 1] = g;
  imageData.data[k + 2] = b;
  imageData.data[k + 3] = a;
};
const loopBox = (w, h, fun) => {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      fun(i, j);
    }
  }
};
const loopRect = (x, y, w, h, fun) => {
  loopBox(w, h, (rx, ry) => fun(x + rx, y + ry, rx, ry));
};

const renderTexture = PIXI.Texture.from(canvas);
const uniforms = {
  uSampler: renderTexture,
};

const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);

const triangle = new PIXI.Mesh(geometry, shader);

triangle.position.set(200, 200);
triangle.scale.set(1);

app.stage.addChild(triangle);
const data = new Array(circumference).fill(0).map(() => new Array(r));
loopRect(0, 0, circumference, r, (x, y, rx, ry) => (data[x][y] = 0));
const calc = (x, y, offsetX = 0, offsetY = 0) => {
  const xRate = x / circumference;
  const yRate = y / r;
  const xN = 20 * 2 * Math.PI;
  const yN = 20;
  const xx = xN * xRate + xN * offsetX;
  const yy = yN * yRate + yN * offsetY;
  return 0.5 * noise_perlin([xx, yy], [xN, yN]) + 0.5;
};
const getdata = (x, y, w, h) => {
  return data.slice(x, x + w).map((el) => el.slice(y, y + h));
};
const drawTexture = (x, y, w, h) => {
  const _data = getdata(x, y, w, h);
  const imageData = ctx.createImageData(w, h);
  loopBox(w, h, (x, y) => {
    setImageDataPixel(imageData, x, y, 0, 255 * _data[x][y], 0, 255);
  });
  ctx.putImageData(imageData, x, y);
};
loopRect(0, 0, circumference, r, (x, y, rx, ry) => {
  data[x][y] = calc(x,y);
});
drawTexture(0, 0, circumference, r);
app.ticker.add((delta) => {
  const n = Math.floor(0.01 * circumference * delta);
  const _rand = rand;
  if (index + n >= circumference) {
    rand = [Math.random(), Math.random()];
  }
  loopRect(index, 0, n, r, (x, y, rx, ry) => {
    const xx = x % circumference;
    const yy = y % r;
    data[xx][yy] = calc(xx, yy, ...rand);
  });
  if (circumference - index >= n) {
    drawTexture(index, 0, n, r, ..._rand);
  } else {
    const ww = circumference - index;
    drawTexture(index, 0, ww, r, ..._rand);
    drawTexture(0, 0, n - ww, r, ...rand);
  }
  index += n;
  index %= circumference;
  renderTexture.update();
});
