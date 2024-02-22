import { Float } from "./float.js";
export class Vector {
  static zero() {
    return [0, 0];
  }
  static clone(vector) {
    return [...vector];
  }
  static normalize(vector) {
    const len = Vector.length(vector);
    if (len) {
      return Vector.scale(vector, 1 / len);
    }
    return vector;
  }
  static rotate(vector, angle) {
    const cos0 = Math.cos(angle);
    const sin0 = Math.sin(angle);
    return [vector[0] * cos0 - vector[1] * sin0, vector[1] * cos0 + vector[0] * sin0];
  }
  static dot(vector0, vector1) {
    return vector0[0] * vector1[0] + vector0[1] * vector1[1];
  }
  static cross(vector0, vector1) {
    return vector0[0] * vector1[1] - vector0[1] * vector1[0];
  }
  static add(vector0, vector1) {
    return [vector0[0] + vector1[0], vector0[1] + vector1[1]];
  }
  static sub(vector0, vector1) {
    return [vector0[0] - vector1[0], vector0[1] - vector1[1]];
  }
  static projection(vector0, vector1) {
    var rate = Vector.dot(vector0, vector1) / Vector.dot(vector1, vector1);
    return [vector1[0] * rate, vector1[1] * rate];
  }
  static length(vector) {
    return Math.sqrt(Vector.dot(vector, vector));
  }
  static mul(vector0, vector1) {
    return [vector0[0] * vector1[0], vector0[1] * vector1[1]];
  }
  static div(vector0, vector1) {
    return [vector0[0] / vector1[0], vector0[1] / vector1[1]];
  }
  static scale(vector, scale) {
    return [vector[0] * scale, vector[1] * scale];
  }
  static collisionCalc(vector0, vector1, mass0, mass1) {
    return Vector.scale(
      Vector.add(Vector.scale(vector0, mass0 - mass1), Vector.scale(vector1, 2 * mass1)),
      1 / (mass0 + mass1)
    );
  }
  static getAngle(vector) {
    return Math.atan2(vector[1], vector[0]);
  }

  static floor(vector) {
    return [Math.floor(vector[0]), Math.floor(vector[1])];
  }
  static fract(vector) {
    return [Float.fract(vector[0]), Float.fract(vector[1])];
  }
  static sin(vector) {
    return [Math.sin(vector[0]), Math.sin(vector[1])];
  }
  static cos(vector) {
    return [Math.cos(vector[0]), Math.cos(vector[1])];
  }
  static distance(vector0, vector1) {
    return Vector.length(Vector.sub(vector1, vector0));
  }
  static mix(vector0, vector1, rate) {
    return [Float.mix(vector0[0], vector1[0], rate), Float.mix(vector0[1], vector1[1], rate)];
  }
  static abs(vector) {
    return [Math.abs(vector[0]), Math.abs(vector[1])];
  }

  /*static refraction(vector, f, n) {
    //var fn = f.normalize();
    let fn = Vector.normalize(f);
    //var fnv = fn.swap();
    let fnv = [-fn[1], fn[0]];
    let n0 = n;
    //var temp = this.sub(this.projection(fn)).cross(fn);
    let temp = Vector.cross(Vector.sub(vector, Vector.projection(vector, fn)), fn);
    if (temp > 0) {
      //fn = fn.scale(-1);
      fn = Vector.scale(fn, -1);
      //fnv = fn.swap();
      fnv = [-fn[1], fn[0]];
    }
    //var v0_u = this.projection(fn);
    let v0_u = Vector.projection(vector, fn);
    //var v0_v = this.sub(v0_u);
    let v0_v = Vector.sub(vector, v0_u);

    //var v0_temp = new createjs.vector(v0_u.length(), v0_v.length());
    let v0_temp = [Vector.length(v0_u), Vector.length(v0_v)];
    //var s = (n0 * (v0_u.cross(fnv) > 0 ? 1 : -1) * v0_temp.x) / v0_temp.length();
    let s = (n0 * (Vector.cross(v0_u, fnv) > 0 ? 1 : -1) * v0_temp.x) / Vector.length(v0_temp);
    if (Math.abs(s) >= 1) {
      return null;
    }
    //var v1_temp = new createjs.vector(s, Math.sqrt(1 - s * s));
    let v1_temp = [s, Math.sqrt(1 - s * s)];
    //var v1 = new createjs.vector(v1_temp.x * fn.x + v1_temp.y * fnv.x, v1_temp.x * fn.y + v1_temp.y * fnv.y);
    let v1 = [v1_temp.x * fn.x + v1_temp.y * fnv.x, v1_temp.x * fn.y + v1_temp.y * fnv.y];
    return v1;
  }*/
}
export class VectorE {
  static set(vector, x, y) {
    vector[0] = x;
    vector[1] = y;
    return vector;
  }
  static normalize(vector) {
    const len = Vector.length(vector);
    if (len) {
      VectorE.scale(vector, 1 / len);
    }
    return vector;
  }
  static add(vector0, vector1) {
    vector0[0] += vector1[0];
    vector0[1] += vector1[1];
    return vector0;
  }
  static sub(vector0, vector1) {
    vector0[0] -= vector1[0];
    vector0[1] -= vector1[1];
    return vector0;
  }
  static scale(vector, scale) {
    vector[0] *= scale;
    vector[1] *= scale;
    return vector;
  }
  static rotate(vector, angle) {
    const cos0 = Math.cos(angle);
    const sin0 = Math.sin(angle);
    [vector[0], vector[1]] = [vector[0] * cos0 - vector[1] * sin0, vector[1] * cos0 + vector[0] * sin0];
    return vector;
  }
}
export class Line {
  static doLineSegmentsIntersect(p0, p1, p2, p3) {
    function orientation(p, q, r) {
      var val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
      if (val === 0) return 0; // 共線
      return val > 0 ? 1 : 2; // 順時針或逆時針
    }

    function onSegment(p, q, r) {
      return (
        q[0] <= Math.max(p[0], r[0]) &&
        q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) &&
        q[1] >= Math.min(p[1], r[1])
      );
    }

    var o1 = orientation(p0, p1, p2);
    var o2 = orientation(p0, p1, p3);
    var o3 = orientation(p2, p3, p0);
    var o4 = orientation(p2, p3, p1);
    if (o1 !== o2 && o3 !== o4) {
      return true;
    }
    if (o1 === 0 && onSegment(p0, p2, p1)) return true;
    if (o2 === 0 && onSegment(p0, p3, p1)) return true;
    if (o3 === 0 && onSegment(p2, p0, p3)) return true;
    if (o4 === 0 && onSegment(p2, p1, p3)) return true;

    return false;
  }
  static getLine(point0, point1) {
    return { pos: point0, dir: Vector.sub(point1, point0) };
  }
  static toLineDistance(point, point0, point1, pn = false) {
    const v = Vector.sub(point1, point0);
    const a = v[1];
    const b = -v[0];
    const c = -point0[0] * v[1] + v[0] * point0[1];
    const ans = (point[0] * a + point[1] * b + c) / Vector.length(v);
    return pn ? ans : Math.abs(ans);
  }
}
export const getQuadraticCurveTo = (vector0, vector1, vector2, t) => {
  const t2 = t * t;
  const x = vector0[0] * (t2 - 2 * t + 1) + 2 * vector1[0] * (-t + 1) * t + vector2[0] * t2;
  const y = vector0[1] * (t2 - 2 * t + 1) + 2 * vector1[1] * (-t + 1) * t + vector2[1] * t2;
  return [x, y];
};
export const getQuadraticCurveToTangent = (vector0, vector1, vector2, t) => {
  const x = 2 * t * (vector0[0] - vector1[0] * 2 + vector2[0]) + 2 * (-vector0[0] + vector1[0]);
  const y = 2 * t * (vector0[1] - vector1[1] * 2 + vector2[1]) + 2 * (-vector0[1] + vector1[1]);
  return [x, y];
};
export const getCubicCurveTo = (vector0, vector1, vector2, vector3, t) => {
  const t2 = t * t;
  const t3 = t * t * t;
  const x =
    vector0[0] * (-t3 + 3 * t2 - 3 * t + 1) +
    vector1[0] * (3 * t3 - 6 * t2 + 3 * t) +
    vector2[0] * (-3 * t3 + 3 * t2) +
    vector3[0] * t3;
  const y =
    vector0[1] * (-t3 + 3 * t2 - 3 * t + 1) +
    vector1[1] * (3 * t3 - 6 * t2 + 3 * t) +
    vector2[1] * (-3 * t3 + 3 * t2) +
    vector3[1] * t3;
  return [x, y];
};

export const getCubicCurveToTangent = (vector0, vector1, vector2, vector3, t) => {
  const t2 = t * t;
  const x =
    -3 * vector0[0] +
    3 * vector1[0] +
    2 * t * (3 * vector0[0] - 6 * vector1[0] + 3 * vector2[0]) +
    3 * t2 * (-vector0[0] + 3 * vector1[0] - 3 * vector2[0] + vector3[0]);
  const y =
    -3 * vector0[1] +
    3 * vector1[1] +
    2 * t * (3 * vector0[1] - 6 * vector1[1] + 3 * vector2[1]) +
    3 * t2 * (-vector0[1] + 3 * vector1[1] - 3 * vector2[1] + vector3[1]);
  return [x, y];
};

export const getQuadraticCurveInfo = (p0, p1, p2, n) => {
  const points = [];
  const section = [];
  let _p = null;
  for (let j = 0; j < n; j++) {
    const rate = j / (n - 1);
    const p = getQuadraticCurveTo(p0, p1, p2, rate);
    const t = Vector.normalize(getQuadraticCurveToTangent(p0, p1, p2, rate));
    points.push({ p, t, n: [-t[1], t[0]] });
    if (_p) {
      section.push(Vector.distance(p, _p));
    }
    _p = p;
  }
  const length = section.reduce((pv, cv) => pv + cv);
  return { points, section, length };
};

export const getCubicCurveInfo = (p0, p1, p2, p3, n) => {
  const points = [];
  const section = [];
  let _p = null;
  for (let j = 0; j < n; j++) {
    const rate = j / (n - 1);
    const p = getCubicCurveTo(p0, p1, p2, p3, rate);
    const t = Vector.normalize(getCubicCurveToTangent(p0, p1, p2, p3, rate));
    points.push({ p, t, n: [-t[1], t[0]] });
    if (_p) {
      section.push(Vector.distance(p, _p));
    }
    _p = p;
  }
  const length = section.reduce((pv, cv) => pv + cv);
  return { points, section, length };
};
