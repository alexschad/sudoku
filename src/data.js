export const rows = [
  [0,1,2,3,4,5,6,7,8],
  [9,10,11,12,13,14,15,16,17],
  [18,19,20,21,22,23,24,25,26],
  [27,28,29,30,31,32,33,34,35],
  [36,37,38,39,40,41,42,43,44],
  [45,46,47,48,49,50,51,52,53],
  [54,55,56,57,58,59,60,61,62],
  [63,64,65,66,67,68,69,70,71],
  [72,73,74,75,76,77,78,79,80],
];
export const cols = [
  [0,9,18,27,36,45,54,63,72],
  [1,10,19,28,37,46,55,64,73],
  [2,11,20,29,38,47,56,65,74],
  [3,12,21,30,39,48,57,66,75],
  [4,13,22,31,40,49,58,67,76],
  [5,14,23,32,41,50,59,68,77],
  [6,15,24,33,42,51,60,69,78],
  [7,16,25,34,43,52,61,70,79],
  [8,17,26,35,44,53,62,71,80],
];
export const squares = [
  [0,1,2,9,10,11,18,19,20],
  [3,4,5,12,13,14,21,22,23],
  [6,7,8,15,16,17,24,25,26],
  [27,28,29,36,37,38,45,46,47],
  [30,31,32,39,40,41,48,49,50],
  [33,34,35,42,43,44,51,52,53],
  [54,55,56,63,64,65,72,73,74],
  [57,58,59,66,67,68,75,76,77],
  [60,61,62,69,70,71,78,79,80],
];

export const sudokus = [
  [null,null,2,null,null,4,8,9,null,null,5,null,8,null,null,3,null,7,7,null,null,null,5,null,null,4,6,null,6,null,null,null,null,null,null,4,null,null,1,null,9,null,5,null,null,9,null,null,null,null,null,null,8,null,6,3,null,null,1,null,null,null,8,1,null,4,null,null,8,null,2,null,null,9,8,4,null,null,1,null,null],
  [8,null,null,9,null,7,null,null,3,null,null,null,1,4,6,null,null,null,null,null,9,null,null,null,1,null,null,2,3,null,6,null,5,null,1,7,null,6,null,null,null,null,null,4,null,9,1,null,4,null,8,null,3,6,null,null,3,null,null,null,6,null,null,null,null,null,5,3,9,null,null,null,4,null,null,7,null,2,null,null,1],
  [3,7,null,null,null,null,8,1,null,6,null,null,3,null,null,null,4,5,null,null,null,1,null,null,7,null,2,null,5,3,4,null,null,null,2,null,null,null,null,null,null,null,null,null,null,null,2,null,null,null,7,4,8,null,5,null,7,null,null,3,null,null,null,9,1,null,null,null,6,null,null,3,null,3,4,null,null,null,null,6,8],
  [1,null,null,2,null,5,null,null,6,null,null,null,8,7,4,null,null,null,null,null,5,null,9,null,8,null,null,8,2,null,null,null,null,null,3,5,null,5,3,null,null,null,6,7,null,4,7,null,null,null,null,null,9,8,null,null,8,null,1,null,5,null,null,null,null,null,7,8,9,null,null,null,3,null,null,5,null,2,null,null,9],
  [null,3,6,null,null,1,null,null,null,null,null,null,3,null,2,4,null,null,null,8,null,null,7,null,5,null,null,null,null,9,null,null,4,null,null,2,1,null,null,null,null,null,null,null,6,2,null,null,7,null,null,3,null,null,null,null,1,null,8,null,null,3,null,null,null,4,5,null,3,null,null,null,null,null,null,1,null,null,7,2,null],
  [4,null,null,null,1,null,9,2,null,null,5,null,null,null,null,null,null,4,null,null,null,7,9,4,3,null,5,2,null,7,null,3,null,5,null,null,5,null,4,2,null,9,6,null,1,null,null,1,null,8,null,7,null,2,3,null,2,6,4,7,null,null,null,6,null,null,null,null,null,null,1,null,null,9,5,null,2,null,null,null,3],
  [null,null,4,1,2,5,8,null,null,null,null,null,null,4,null,null,null,null,8,null,null,7,null,9,null,null,5,4,null,5,null,null,null,1,null,3,9,6,null,null,null,null,null,4,7,2,null,1,null,null,null,5,null,8,6,null,null,9,null,4,null,null,1,null,null,null,null,7,null,null,null,null,null,null,2,3,1,6,7,null,null],
  [8,9,null,null,null,4,null,null,7,3,1,5,null,null,null,null,2,null,null,6,7,null,null,null,8,null,null,null,null,null,6,4,null,null,null,1,null,null,null,3,7,2,null,null,null,7,null,null,null,8,1,null,null,null,null,null,4,null,null,null,2,8,null,null,8,null,null,null,null,1,7,5,1,null,null,5,null,null,null,9,6],
  [null,null,8,null,null,null,6,null,null,null,7,null,null,1,null,null,5,null,5,null,null,3,null,6,null,null,4,null,null,2,6,null,3,4,null,null,null,3,null,null,null,null,null,6,null,null,null,6,5,null,7,9,null,null,9,null,null,7,null,2,null,null,8,null,6,null,null,9,null,null,3,null,null,null,7,null,null,null,2,null,null]
];
