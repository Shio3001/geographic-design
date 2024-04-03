import { TypePosition } from "../gis_scipt/route_type";

// https://youta-blog.com/angle-and-rotation-direction/#nbsp
// 三点から角度(ラジアン)を計算
export const caclcAngleByPosition = (A: TypePosition, B: TypePosition, C: TypePosition) => {
  const calc_top = (B.x - A.x) * (C.x - A.x) + (B.y - A.y) * (C.y - A.y);
  const calc_button1 = calcPythagorean(A, B);
  const calc_button2 = calcPythagorean(A, C);
  const fraction = calc_top / (calc_button1 * calc_button2);
  const acos = Math.acos(fraction);
  return acos;
};

//三平方の定理（ルートしない）
export const calcPythagoreanSquare = (ap: TypePosition, bp: TypePosition) => {
  const x = bp.x - ap.x;
  const y = bp.y - ap.y;
  const t = x ** 2 + y ** 2;
  return t;
};

//三平方の定理
export const calcPythagorean = (ap: TypePosition, bp: TypePosition) => {
  const x = bp.x - ap.x;
  const y = bp.y - ap.y;
  const t = x ** 2 + y ** 2;
  const r = Math.sqrt(t);
  return r;
};

//三角形の重心計算
export const calcCenterGravity = (A: TypePosition, B: TypePosition, C: TypePosition) => {
  const cg_x = (A.x + B.x + C.x) / 3;
  const cg_Y = (A.y + B.y + C.y) / 3;

  return { x: cg_x, y: cg_Y };
};

console.log("test calc abp", caclcAngleByPosition({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }));
