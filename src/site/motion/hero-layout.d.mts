export interface HeroStroke { points: Array<[number, number, number]>; primary: boolean; wave: number }
export interface HeroObject {
  kind: "letter" | "ring" | "core";
  index: number;
  strands: 1 | 3;
  spread: number;
  thick: number;
  copper?: boolean;
  strokes: HeroStroke[];
}
export interface Placement { x: number; y: number; z: number; rx: number; ry: number; rz: number; scale: number }
export function buildHero(spec: unknown, count: number): HeroObject[];
export function placeAt(obj: HeroObject, spec: unknown, t: number): Placement;
export function applyPlacement(p: [number, number, number], placement: Placement): [number, number, number];
export function offsetStroke(points: Array<[number, number, number]>, amount: number): Array<[number, number, number]>;
