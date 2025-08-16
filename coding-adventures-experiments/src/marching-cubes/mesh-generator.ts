const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2")!;
const surfaceSlider = document.getElementById("surface") as HTMLInputElement;
const scaleSlider = document.getElementById("scale") as HTMLInputElement;
const regenerateBtn = document.getElementById(
  "regenerate"
) as HTMLButtonElement;

// Marching cubes lookup tables
const CUBE_CORNERS = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0], // bottom face
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1], // top face
];

const CUBE_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0], // bottom face edges
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4], // top face edges
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7], // vertical edges
];

// Complete triangulation table for all 256 marching cube cases
const TRIANGLE_TABLE = [
  [-1],
  [0, 3, 8, -1],
  [0, 9, 1, -1],
  [3, 8, 1, 1, 8, 9, -1],
  [2, 11, 3, -1],
  [8, 0, 11, 11, 0, 2, -1],
  [3, 2, 11, 1, 0, 9, -1],
  [11, 1, 2, 11, 9, 1, 11, 8, 9, -1],
  [1, 10, 2, -1],
  [0, 3, 8, 2, 1, 10, -1],
  [10, 2, 9, 9, 2, 0, -1],
  [8, 2, 3, 8, 10, 2, 8, 9, 10, -1],
  [11, 3, 10, 10, 3, 1, -1],
  [10, 0, 1, 10, 8, 0, 10, 11, 8, -1],
  [9, 3, 0, 9, 11, 3, 9, 10, 11, -1],
  [8, 9, 11, 11, 9, 10, -1],
  [4, 8, 7, -1],
  [7, 4, 3, 3, 4, 0, -1],
  [4, 8, 7, 0, 9, 1, -1],
  [1, 4, 9, 1, 7, 4, 1, 3, 7, -1],
  [8, 7, 4, 11, 3, 2, -1],
  [4, 11, 7, 4, 2, 11, 4, 0, 2, -1],
  [0, 9, 1, 8, 7, 4, 11, 3, 2, -1],
  [7, 4, 11, 11, 4, 2, 2, 4, 9, 2, 9, 1, -1],
  [4, 8, 7, 2, 1, 10, -1],
  [7, 4, 3, 3, 4, 0, 10, 2, 1, -1],
  [10, 2, 9, 9, 2, 0, 7, 4, 8, -1],
  [10, 2, 3, 10, 3, 4, 3, 7, 4, 9, 10, 4, -1],
  [1, 10, 3, 3, 10, 11, 4, 8, 7, -1],
  [10, 11, 1, 11, 7, 4, 1, 11, 4, 1, 4, 0, -1],
  [7, 4, 8, 9, 3, 0, 9, 11, 3, 9, 10, 11, -1],
  [7, 4, 11, 4, 9, 11, 9, 10, 11, -1],
  [9, 4, 5, -1],
  [9, 4, 5, 8, 0, 3, -1],
  [4, 5, 0, 0, 5, 1, -1],
  [5, 8, 4, 5, 3, 8, 5, 1, 3, -1],
  [9, 4, 5, 11, 3, 2, -1],
  [2, 11, 0, 0, 11, 8, 5, 9, 4, -1],
  [4, 5, 0, 0, 5, 1, 11, 3, 2, -1],
  [5, 1, 4, 1, 2, 11, 4, 1, 11, 4, 11, 8, -1],
  [1, 10, 2, 5, 9, 4, -1],
  [9, 4, 5, 0, 3, 8, 2, 1, 10, -1],
  [2, 5, 10, 2, 4, 5, 2, 0, 4, -1],
  [10, 2, 5, 5, 2, 4, 4, 2, 3, 4, 3, 8, -1],
  [11, 3, 10, 10, 3, 1, 4, 5, 9, -1],
  [4, 5, 9, 10, 0, 1, 10, 8, 0, 10, 11, 8, -1],
  [11, 3, 0, 11, 0, 5, 0, 4, 5, 10, 11, 5, -1],
  [4, 5, 8, 5, 10, 8, 10, 11, 8, -1],
  [8, 7, 9, 9, 7, 5, -1],
  [3, 9, 0, 3, 5, 9, 3, 7, 5, -1],
  [7, 0, 8, 7, 1, 0, 7, 5, 1, -1],
  [7, 5, 3, 3, 5, 1, -1],
  [5, 9, 7, 7, 9, 8, 2, 11, 3, -1],
  [2, 11, 7, 2, 7, 9, 7, 5, 9, 0, 2, 9, -1],
  [2, 11, 3, 7, 0, 8, 7, 1, 0, 7, 5, 1, -1],
  [2, 11, 1, 11, 7, 1, 7, 5, 1, -1],
  [8, 7, 9, 9, 7, 5, 2, 1, 10, -1],
  [10, 2, 1, 3, 9, 0, 3, 5, 9, 3, 7, 5, -1],
  [7, 5, 8, 5, 10, 2, 8, 5, 2, 8, 2, 0, -1],
  [10, 2, 5, 2, 3, 5, 3, 7, 5, -1],
  [8, 7, 5, 8, 5, 9, 11, 3, 10, 3, 1, 10, -1],
  [5, 11, 7, 10, 11, 5, 1, 9, 0, -1],
  [11, 5, 10, 7, 5, 11, 8, 3, 0, -1],
  [5, 11, 7, 10, 11, 5, -1],
  [6, 7, 11, -1],
  [7, 11, 6, 3, 8, 0, -1],
  [6, 7, 11, 0, 9, 1, -1],
  [9, 1, 8, 8, 1, 3, 6, 7, 11, -1],
  [3, 2, 7, 7, 2, 6, -1],
  [0, 7, 8, 0, 6, 7, 0, 2, 6, -1],
  [6, 7, 2, 2, 7, 3, 9, 1, 0, -1],
  [6, 7, 8, 6, 8, 1, 8, 9, 1, 2, 6, 1, -1],
  [11, 6, 7, 10, 2, 1, -1],
  [3, 8, 0, 11, 6, 7, 10, 2, 1, -1],
  [0, 9, 2, 2, 9, 10, 7, 11, 6, -1],
  [6, 7, 11, 8, 2, 3, 8, 10, 2, 8, 9, 10, -1],
  [7, 10, 6, 7, 1, 10, 7, 3, 1, -1],
  [8, 0, 7, 7, 0, 6, 6, 0, 1, 6, 1, 10, -1],
  [7, 3, 6, 3, 0, 9, 6, 3, 9, 6, 9, 10, -1],
  [6, 7, 10, 7, 8, 10, 8, 9, 10, -1],
  [11, 6, 8, 8, 6, 4, -1],
  [6, 3, 11, 6, 0, 3, 6, 4, 0, -1],
  [11, 6, 8, 8, 6, 4, 1, 0, 9, -1],
  [1, 3, 9, 3, 11, 6, 9, 3, 6, 9, 6, 4, -1],
  [2, 8, 3, 2, 4, 8, 2, 6, 4, -1],
  [4, 0, 6, 6, 0, 2, -1],
  [9, 1, 0, 2, 8, 3, 2, 4, 8, 2, 6, 4, -1],
  [9, 1, 4, 1, 2, 4, 2, 6, 4, -1],
  [4, 8, 6, 6, 8, 11, 1, 10, 2, -1],
  [1, 10, 2, 6, 3, 11, 6, 0, 3, 6, 4, 0, -1],
  [11, 6, 4, 11, 4, 8, 10, 2, 9, 2, 0, 9, -1],
  [10, 4, 9, 6, 4, 10, 11, 2, 3, -1],
  [4, 8, 3, 4, 3, 10, 3, 1, 10, 6, 4, 10, -1],
  [1, 10, 0, 10, 6, 0, 6, 4, 0, -1],
  [4, 10, 6, 9, 10, 4, 0, 8, 3, -1],
  [4, 10, 6, 9, 10, 4, -1],
  [6, 7, 11, 4, 5, 9, -1],
  [4, 5, 9, 7, 11, 6, 3, 8, 0, -1],
  [1, 0, 5, 5, 0, 4, 11, 6, 7, -1],
  [11, 6, 7, 5, 8, 4, 5, 3, 8, 5, 1, 3, -1],
  [3, 2, 7, 7, 2, 6, 9, 4, 5, -1],
  [5, 9, 4, 0, 7, 8, 0, 6, 7, 0, 2, 6, -1],
  [3, 2, 6, 3, 6, 7, 1, 0, 5, 0, 4, 5, -1],
  [6, 1, 2, 5, 1, 6, 4, 7, 8, -1],
  [10, 2, 1, 6, 7, 11, 4, 5, 9, -1],
  [0, 3, 8, 4, 5, 9, 11, 6, 7, 10, 2, 1, -1],
  [7, 11, 6, 2, 5, 10, 2, 4, 5, 2, 0, 4, -1],
  [8, 4, 7, 5, 10, 6, 3, 11, 2, -1],
  [9, 4, 5, 7, 10, 6, 7, 1, 10, 7, 3, 1, -1],
  [10, 6, 5, 7, 8, 4, 1, 9, 0, -1],
  [4, 3, 0, 7, 3, 4, 6, 5, 10, -1],
  [10, 6, 5, 8, 4, 7, -1],
  [9, 6, 5, 9, 11, 6, 9, 8, 11, -1],
  [11, 6, 3, 3, 6, 0, 0, 6, 5, 0, 5, 9, -1],
  [11, 6, 5, 11, 5, 0, 5, 1, 0, 8, 11, 0, -1],
  [11, 6, 3, 6, 5, 3, 5, 1, 3, -1],
  [9, 8, 5, 8, 3, 2, 5, 8, 2, 5, 2, 6, -1],
  [5, 9, 6, 9, 0, 6, 0, 2, 6, -1],
  [1, 6, 5, 2, 6, 1, 3, 0, 8, -1],
  [1, 6, 5, 2, 6, 1, -1],
  [2, 1, 10, 9, 6, 5, 9, 11, 6, 9, 8, 11, -1],
  [9, 0, 1, 3, 11, 2, 5, 10, 6, -1],
  [11, 0, 8, 2, 0, 11, 10, 6, 5, -1],
  [3, 11, 2, 5, 10, 6, -1],
  [1, 8, 3, 9, 8, 1, 5, 10, 6, -1],
  [6, 5, 10, 0, 1, 9, -1],
  [8, 3, 0, 5, 10, 6, -1],
  [6, 5, 10, -1],
  [10, 5, 6, -1],
  [0, 3, 8, 6, 10, 5, -1],
  [10, 5, 6, 9, 1, 0, -1],
  [3, 8, 1, 1, 8, 9, 6, 10, 5, -1],
  [2, 11, 3, 6, 10, 5, -1],
  [8, 0, 11, 11, 0, 2, 5, 6, 10, -1],
  [1, 0, 9, 2, 11, 3, 6, 10, 5, -1],
  [5, 6, 10, 11, 1, 2, 11, 9, 1, 11, 8, 9, -1],
  [5, 6, 1, 1, 6, 2, -1],
  [5, 6, 1, 1, 6, 2, 8, 0, 3, -1],
  [6, 9, 5, 6, 0, 9, 6, 2, 0, -1],
  [6, 2, 5, 2, 3, 8, 5, 2, 8, 5, 8, 9, -1],
  [3, 6, 11, 3, 5, 6, 3, 1, 5, -1],
  [8, 0, 1, 8, 1, 6, 1, 5, 6, 11, 8, 6, -1],
  [11, 3, 6, 6, 3, 5, 5, 3, 0, 5, 0, 9, -1],
  [5, 6, 9, 6, 11, 9, 11, 8, 9, -1],
  [5, 6, 10, 7, 4, 8, -1],
  [0, 3, 4, 4, 3, 7, 10, 5, 6, -1],
  [5, 6, 10, 4, 8, 7, 0, 9, 1, -1],
  [6, 10, 5, 1, 4, 9, 1, 7, 4, 1, 3, 7, -1],
  [7, 4, 8, 6, 10, 5, 2, 11, 3, -1],
  [10, 5, 6, 4, 11, 7, 4, 2, 11, 4, 0, 2, -1],
  [4, 8, 7, 6, 10, 5, 3, 2, 11, 1, 0, 9, -1],
  [1, 2, 10, 11, 7, 6, 9, 5, 4, -1],
  [2, 1, 6, 6, 1, 5, 8, 7, 4, -1],
  [0, 3, 7, 0, 7, 4, 2, 1, 6, 1, 5, 6, -1],
  [8, 7, 4, 6, 9, 5, 6, 0, 9, 6, 2, 0, -1],
  [7, 2, 3, 6, 2, 7, 5, 4, 9, -1],
  [4, 8, 7, 3, 6, 11, 3, 5, 6, 3, 1, 5, -1],
  [5, 0, 1, 4, 0, 5, 7, 6, 11, -1],
  [9, 5, 4, 6, 11, 7, 0, 8, 3, -1],
  [11, 7, 6, 9, 5, 4, -1],
  [6, 10, 4, 4, 10, 9, -1],
  [6, 10, 4, 4, 10, 9, 3, 8, 0, -1],
  [0, 10, 1, 0, 6, 10, 0, 4, 6, -1],
  [6, 10, 1, 6, 1, 8, 1, 3, 8, 4, 6, 8, -1],
  [9, 4, 10, 10, 4, 6, 3, 2, 11, -1],
  [2, 11, 8, 2, 8, 0, 6, 10, 4, 10, 9, 4, -1],
  [11, 3, 2, 0, 10, 1, 0, 6, 10, 0, 4, 6, -1],
  [6, 8, 4, 11, 8, 6, 2, 10, 1, -1],
  [4, 1, 9, 4, 2, 1, 4, 6, 2, -1],
  [3, 8, 0, 4, 1, 9, 4, 2, 1, 4, 6, 2, -1],
  [6, 2, 4, 4, 2, 0, -1],
  [3, 8, 2, 8, 4, 2, 4, 6, 2, -1],
  [4, 6, 9, 6, 11, 3, 9, 6, 3, 9, 3, 1, -1],
  [8, 6, 11, 4, 6, 8, 9, 0, 1, -1],
  [11, 3, 6, 3, 0, 6, 0, 4, 6, -1],
  [8, 6, 11, 4, 6, 8, -1],
  [10, 7, 6, 10, 8, 7, 10, 9, 8, -1],
  [3, 7, 0, 7, 6, 10, 0, 7, 10, 0, 10, 9, -1],
  [6, 10, 7, 7, 10, 8, 8, 10, 1, 8, 1, 0, -1],
  [6, 10, 7, 10, 1, 7, 1, 3, 7, -1],
  [3, 2, 11, 10, 7, 6, 10, 8, 7, 10, 9, 8, -1],
  [2, 9, 0, 10, 9, 2, 6, 11, 7, -1],
  [0, 8, 3, 7, 6, 11, 1, 2, 10, -1],
  [7, 6, 11, 1, 2, 10, -1],
  [2, 1, 9, 2, 9, 7, 9, 8, 7, 6, 2, 7, -1],
  [2, 7, 6, 3, 7, 2, 0, 1, 9, -1],
  [8, 7, 0, 7, 6, 0, 6, 2, 0, -1],
  [7, 2, 3, 6, 2, 7, -1],
  [8, 1, 9, 3, 1, 8, 11, 7, 6, -1],
  [11, 7, 6, 1, 9, 0, -1],
  [6, 11, 7, 0, 8, 3, -1],
  [11, 7, 6, -1],
  [7, 11, 5, 5, 11, 10, -1],
  [10, 5, 11, 11, 5, 7, 0, 3, 8, -1],
  [7, 11, 5, 5, 11, 10, 0, 9, 1, -1],
  [7, 11, 10, 7, 10, 5, 3, 8, 1, 8, 9, 1, -1],
  [5, 2, 10, 5, 3, 2, 5, 7, 3, -1],
  [5, 7, 10, 7, 8, 0, 10, 7, 0, 10, 0, 2, -1],
  [0, 9, 1, 5, 2, 10, 5, 3, 2, 5, 7, 3, -1],
  [9, 7, 8, 5, 7, 9, 10, 1, 2, -1],
  [1, 11, 2, 1, 7, 11, 1, 5, 7, -1],
  [8, 0, 3, 1, 11, 2, 1, 7, 11, 1, 5, 7, -1],
  [7, 11, 2, 7, 2, 9, 2, 0, 9, 5, 7, 9, -1],
  [7, 9, 5, 8, 9, 7, 3, 11, 2, -1],
  [3, 1, 7, 7, 1, 5, -1],
  [8, 0, 7, 0, 1, 7, 1, 5, 7, -1],
  [0, 9, 3, 9, 5, 3, 5, 7, 3, -1],
  [9, 7, 8, 5, 7, 9, -1],
  [8, 5, 4, 8, 10, 5, 8, 11, 10, -1],
  [0, 3, 11, 0, 11, 5, 11, 10, 5, 4, 0, 5, -1],
  [1, 0, 9, 8, 5, 4, 8, 10, 5, 8, 11, 10, -1],
  [10, 3, 11, 1, 3, 10, 9, 5, 4, -1],
  [3, 2, 8, 8, 2, 4, 4, 2, 10, 4, 10, 5, -1],
  [10, 5, 2, 5, 4, 2, 4, 0, 2, -1],
  [5, 4, 9, 8, 3, 0, 10, 1, 2, -1],
  [2, 10, 1, 4, 9, 5, -1],
  [8, 11, 4, 11, 2, 1, 4, 11, 1, 4, 1, 5, -1],
  [0, 5, 4, 1, 5, 0, 2, 3, 11, -1],
  [0, 11, 2, 8, 11, 0, 4, 9, 5, -1],
  [5, 4, 9, 2, 3, 11, -1],
  [4, 8, 5, 8, 3, 5, 3, 1, 5, -1],
  [0, 5, 4, 1, 5, 0, -1],
  [5, 4, 9, 3, 0, 8, -1],
  [5, 4, 9, -1],
  [11, 4, 7, 11, 9, 4, 11, 10, 9, -1],
  [0, 3, 8, 11, 4, 7, 11, 9, 4, 11, 10, 9, -1],
  [11, 10, 7, 10, 1, 0, 7, 10, 0, 7, 0, 4, -1],
  [3, 10, 1, 11, 10, 3, 7, 8, 4, -1],
  [3, 2, 10, 3, 10, 4, 10, 9, 4, 7, 3, 4, -1],
  [9, 2, 10, 0, 2, 9, 8, 4, 7, -1],
  [3, 4, 7, 0, 4, 3, 1, 2, 10, -1],
  [7, 8, 4, 10, 1, 2, -1],
  [7, 11, 4, 4, 11, 9, 9, 11, 2, 9, 2, 1, -1],
  [1, 9, 0, 4, 7, 8, 2, 3, 11, -1],
  [7, 11, 4, 11, 2, 4, 2, 0, 4, -1],
  [4, 7, 8, 2, 3, 11, -1],
  [9, 4, 1, 4, 7, 1, 7, 3, 1, -1],
  [7, 8, 4, 1, 9, 0, -1],
  [3, 4, 7, 0, 4, 3, -1],
  [7, 8, 4, -1],
  [11, 10, 8, 8, 10, 9, -1],
  [0, 3, 9, 3, 11, 9, 11, 10, 9, -1],
  [1, 0, 10, 0, 8, 10, 8, 11, 10, -1],
  [10, 3, 11, 1, 3, 10, -1],
  [3, 2, 8, 2, 10, 8, 10, 9, 8, -1],
  [9, 2, 10, 0, 2, 9, -1],
  [8, 3, 0, 10, 1, 2, -1],
  [2, 10, 1, -1],
  [2, 1, 11, 1, 9, 11, 9, 8, 11, -1],
  [11, 2, 3, 9, 0, 1, -1],
  [11, 0, 8, 2, 0, 11, -1],
  [3, 11, 2, -1],
  [1, 8, 3, 9, 8, 1, -1],
  [1, 9, 0, -1],
  [8, 3, 0, -1],
  [-1],
];

// Grid settings
const GRID_SIZE = 16;
const VOXEL_SIZE = 0.5;

class VoxelGrid {
  private data: Float32Array;
  private size: number;

  constructor(size: number) {
    this.size = size;
    this.data = new Float32Array(size * size * size);
  }

  getIndex(x: number, y: number, z: number): number {
    return x + y * this.size + z * this.size * this.size;
  }

  getValue(x: number, y: number, z: number): number {
    if (
      x < 0 ||
      y < 0 ||
      z < 0 ||
      x >= this.size ||
      y >= this.size ||
      z >= this.size
    ) {
      return 0; // Outside bounds = empty
    }
    return this.data[this.getIndex(x, y, z)];
  }

  setValue(x: number, y: number, z: number, value: number): void {
    if (
      x >= 0 &&
      y >= 0 &&
      z >= 0 &&
      x < this.size &&
      y < this.size &&
      z < this.size
    ) {
      this.data[this.getIndex(x, y, z)] = value;
    }
  }
}

// 3D noise function
function noise3D(x: number, y: number, z: number, scale: number): number {
  const nx = x * scale;
  const ny = y * scale;
  const nz = z * scale;

  // Simple 3D noise (you could use proper Perlin noise here)
  return (
    (Math.sin(nx) * Math.cos(ny) * Math.sin(nz) +
      Math.sin(nx * 2) * Math.cos(ny * 2) * Math.sin(nz * 2) * 0.5 +
      Math.sin(nx * 4) * Math.cos(ny * 4) * Math.sin(nz * 4) * 0.25) *
      0.5 +
    0.5
  );
}

// Generate voxel density data
function generateVoxelData(grid: VoxelGrid, scale: number): void {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        // Combine 3D noise with a ground plane
        const noiseValue = noise3D(x, y, z, scale);
        const groundHeight = (GRID_SIZE - y) / GRID_SIZE; // Higher at bottom
        const density = (noiseValue + groundHeight) * 0.5;

        grid.setValue(x, y, z, density);
      }
    }
  }
}

// Linear interpolation for vertex positioning
function lerp(a: number[], b: number[], t: number): number[] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

// Get interpolated vertex position on cube edge
function getVertexPosition(
  grid: VoxelGrid,
  x: number,
  y: number,
  z: number,
  edgeIndex: number,
  surfaceLevel: number
): number[] {
  const edge = CUBE_EDGES[edgeIndex];
  const corner1 = CUBE_CORNERS[edge[0]];
  const corner2 = CUBE_CORNERS[edge[1]];

  const pos1 = [x + corner1[0], y + corner1[1], z + corner1[2]];
  const pos2 = [x + corner2[0], y + corner2[1], z + corner2[2]];

  const value1 = grid.getValue(pos1[0], pos1[1], pos1[2]);
  const value2 = grid.getValue(pos2[0], pos2[1], pos2[2]);

  // Simple interpolation (could be more accurate)
  let t = 0.5;
  if (Math.abs(value1 - value2) > 0.001) {
    t = (surfaceLevel - value1) / (value2 - value1);
    t = Math.max(0, Math.min(1, t));
  }

  const worldPos1 = [
    pos1[0] * VOXEL_SIZE,
    pos1[1] * VOXEL_SIZE,
    pos1[2] * VOXEL_SIZE,
  ];
  const worldPos2 = [
    pos2[0] * VOXEL_SIZE,
    pos2[1] * VOXEL_SIZE,
    pos2[2] * VOXEL_SIZE,
  ];

  return lerp(worldPos1, worldPos2, t);
}

// March a single cube
function marchCube(
  grid: VoxelGrid,
  x: number,
  y: number,
  z: number,
  surfaceLevel: number,
  vertices: number[]
): void {
  // Calculate cube configuration
  let cubeIndex = 0;
  const cornerValues: number[] = [];

  for (let i = 0; i < 8; i++) {
    const corner = CUBE_CORNERS[i];
    const value = grid.getValue(x + corner[0], y + corner[1], z + corner[2]);
    cornerValues[i] = value;

    if (value > surfaceLevel) {
      cubeIndex |= 1 << i;
    }
  }

  // Skip if cube is entirely inside or outside
  if (cubeIndex === 0 || cubeIndex === 255) {
    return;
  }

  // Use simplified triangulation (for demo purposes)
  const triangles = getTriangulationForIndex(cubeIndex);

  // Generate vertices for each triangle
  for (let i = 0; i < triangles.length; i += 3) {
    for (let j = 0; j < 3; j++) {
      const edgeIndex = triangles[i + j];
      if (edgeIndex >= 0 && edgeIndex < 12) {
        const vertex = getVertexPosition(
          grid,
          x,
          y,
          z,
          edgeIndex,
          surfaceLevel
        );
        vertices.push(...vertex);
      }
    }
  }
}

// Complete triangulation lookup using the full 256-entry table
function getTriangulationForIndex(index: number): number[] {
  if (index >= 0 && index < TRIANGLE_TABLE.length) {
    const triangles = TRIANGLE_TABLE[index];
    // Filter out the -1 terminators
    return triangles.filter((edgeIndex) => edgeIndex !== -1);
  }
  return [];
}

// Generate mesh using marching cubes
function generateMesh(grid: VoxelGrid, surfaceLevel: number): Float32Array {
  const vertices: number[] = [];

  // March through all cubes in the grid
  for (let x = 0; x < GRID_SIZE - 1; x++) {
    for (let y = 0; y < GRID_SIZE - 1; y++) {
      for (let z = 0; z < GRID_SIZE - 1; z++) {
        marchCube(grid, x, y, z, surfaceLevel, vertices);
      }
    }
  }

  return new Float32Array(vertices);
}

// WebGL setup and rendering code
const vertexShaderSource = `#version 300 es
in vec3 position;
uniform mat4 mvpMatrix;
out vec3 worldPos;

void main() {
    worldPos = position;
    gl_Position = mvpMatrix * vec4(position, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;
in vec3 worldPos;
out vec4 fragColor;

void main() {
    // Simple lighting based on world position
    vec3 normal = normalize(cross(dFdx(worldPos), dFdy(worldPos)));
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    
    float diffuse = max(0.0, dot(normal, lightDir));
    vec3 color = vec3(0.3, 0.7, 0.3) * (0.3 + 0.7 * diffuse);
    
    fragColor = vec4(color, 1.0);
}`;

let program: WebGLProgram;
let vao: WebGLVertexArrayObject;
let positionBuffer: WebGLBuffer;
let mvpLocation: WebGLUniformLocation;

function createShader(type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error("Shader compilation failed");
  }

  return shader;
}

function initWebGL() {
  // Create shaders and program
  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    throw new Error("Program linking failed");
  }

  // Get uniform location
  mvpLocation = gl.getUniformLocation(program, "mvpMatrix")!;

  // Create VAO and buffer
  vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  positionBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positionLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  // Enable depth testing
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.1, 0.1, 0.2, 1.0);
}

function createMVPMatrix(): Float32Array {
  const aspect = canvas.width / canvas.height;
  const fov = Math.PI / 4;
  const near = 0.1;
  const far = 100.0;

  // Proper perspective matrix
  const perspective = mat4Perspective(fov, aspect, near, far);

  // Camera setup
  const time = Date.now() * 0.0005; // Slower rotation
  const radius = 15;
  const camX = Math.cos(time) * radius;
  const camZ = Math.sin(time) * radius;
  const camY = 8;

  const view = mat4LookAt(
    [camX, camY, camZ], // camera position
    [4, 4, 4], // look at center of terrain
    [0, 1, 0] // up vector
  );

  // Multiply matrices properly
  return mat4Multiply(perspective, view);
}

// Add these matrix utility functions before createMVPMatrix():
function mat4Perspective(
  fov: number,
  aspect: number,
  near: number,
  far: number
): Float32Array {
  const f = 1.0 / Math.tan(fov / 2);
  const nf = 1 / (near - far);

  return new Float32Array([
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) * nf,
    -1,
    0,
    0,
    2 * far * near * nf,
    0,
  ]);
}

function mat4LookAt(
  eye: number[],
  target: number[],
  up: number[]
): Float32Array {
  const zAxis = normalize(subtract(eye, target));
  const xAxis = normalize(cross(up, zAxis));
  const yAxis = cross(zAxis, xAxis);

  return new Float32Array([
    xAxis[0],
    yAxis[0],
    zAxis[0],
    0,
    xAxis[1],
    yAxis[1],
    zAxis[1],
    0,
    xAxis[2],
    yAxis[2],
    zAxis[2],
    0,
    -dot(xAxis, eye),
    -dot(yAxis, eye),
    -dot(zAxis, eye),
    1,
  ]);
}

function mat4Multiply(a: Float32Array, b: Float32Array): Float32Array {
  const result = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result[i * 4 + j] =
        a[i * 4 + 0] * b[0 * 4 + j] +
        a[i * 4 + 1] * b[1 * 4 + j] +
        a[i * 4 + 2] * b[2 * 4 + j] +
        a[i * 4 + 3] * b[3 * 4 + j];
    }
  }
  return result;
}

// Vector utilities
function subtract(a: number[], b: number[]): number[] {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v: number[]): number[] {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
}

function cross(a: number[], b: number[]): number[] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

let currentVertices: Float32Array | null = null;

function updateTerrain() {
  const grid = new VoxelGrid(GRID_SIZE);
  const scale = parseFloat(scaleSlider.value);
  const surfaceLevel = parseFloat(surfaceSlider.value);

  // Generate voxel data
  generateVoxelData(grid, scale);

  // Generate mesh using marching cubes
  currentVertices = generateMesh(grid, surfaceLevel);

  console.log(`Generated ${currentVertices.length / 3} vertices`);
}

function render() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (currentVertices && currentVertices.length > 0) {
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    // Upload mesh data
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, currentVertices, gl.DYNAMIC_DRAW);

    // Set MVP matrix
    const mvp = createMVPMatrix();
    gl.uniformMatrix4fv(mvpLocation, false, mvp);

    // Draw triangles
    gl.drawArrays(gl.TRIANGLES, 0, currentVertices.length / 3);
  }

  requestAnimationFrame(render);
}

// Initialize everything
initWebGL();
updateTerrain();

// Event listeners
surfaceSlider.addEventListener("input", updateTerrain);
scaleSlider.addEventListener("input", updateTerrain);
regenerateBtn.addEventListener("click", updateTerrain);

render();
