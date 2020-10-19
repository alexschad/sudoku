const sudokus = [
	[0,0,0,5,0,0,0,9,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,4,0,5,0,0,1,3,4,0,6,7,0,9,4,6,5,0,9,8,1,2,3,8,0,0,0,1,2,0,0,5,0,2,1,0,0,0,9,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,7,5,0,0,0],
	[0,4,0,7,0,0,0,0,0,0,0,5,0,6,0,0,0,0,6,7,0,3,4,0,0,0,0,0,1,3,4,0,0,0,9,0,0,5,6,0,0,7,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,6,0,0,0,5,0,0,0,4,0,7,0,0,8,2,0,9,7,5,3,0,6,1,4],
	[3,0,0,1,2,0,0,0,0,0,0,0,3,0,8,0,0,0,5,0,0,0,0,9,0,2,0,2,0,0,5,0,0,8,0,7,4,0,0,0,0,0,0,0,0,6,0,0,0,0,3,0,0,0,0,0,0,0,8,0,0,0,4,8,4,2,9,3,5,7,0,0,9,6,5,0,0,0,3,8,0],
	[0,0,0,0,1,2,0,3,4,1,2,0,0,0,0,0,7,0,0,0,8,0,0,0,0,2,0,0,0,0,0,3,0,0,9,8,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,3,0,0,6,4,9,8,0,6,0,0,9,8,0,5,0,7,0,8,7,1,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,7,0,0,6,9,1,0,0,0,3,0,2,0,3,4,0,0,0,6,9,0,0,6,0,0,0,3,0,2,7,9,8,0,2,3,4,0,0,0,0,1,5,0,0,8,0,7,0,4,0,9,3,0,1,2,0,0,7,2,8,0,0,0,0,0],
	[8,0,0,0,0,0,0,0,0,0,3,0,1,5,6,0,0,0,0,6,9,0,0,0,0,2,0,1,0,3,4,6,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,6,0,2,0,0,0,0,3,0,0,5,0,7,9,6,0,0,0,0,9,3,1,5,0,8,0,8,5,0,4,2,3,7,1],
	[0,1,2,0,0,4,6,0,0,3,4,0,6,0,0,0,0,0,0,7,0,0,0,0,0,4,5,0,0,0,0,0,6,8,9,7,0,5,0,8,9,7,0,0,0,7,8,0,0,1,0,4,5,0,2,0,1,0,0,5,9,0,4,5,0,0,0,8,0,7,0,0,8,0,0,0,0,0,0,0,0],
	[0,5,0,0,0,0,8,0,0,0,0,6,0,0,0,0,7,0,0,8,0,3,0,0,1,0,0,0,1,0,0,0,0,0,0,8,0,4,0,0,8,9,2,3,6,6,0,0,7,0,3,0,1,0,0,2,0,5,0,0,0,8,7,0,0,0,6,3,2,0,5,0,9,0,0,0,0,0,3,4,0],
	[5,0,9,0,0,0,0,0,0,0,0,4,0,0,6,7,0,0,0,7,8,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,0,0,0,0,0,0,3,0,0,0,3,1,2,0,0,0,3,0,2,5,7,0,0,0,0,0,6,0,9,0,3,5,0,4,0,8,5,0,2,0,3,0,1],
	[0,0,0,0,0,8,5,3,6,0,4,0,1,0,6,7,0,0,0,0,0,3,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,8,0,0,0,1,0,0,6,5,2,0,1,5,0,4,6,7,0,5,7,0,6,0,0,0,4,2,9,6,4,8,7,0,0,5,0],
	[6,0,2,0,9,0,0,4,0,0,0,4,0,0,0,0,0,9,0,7,9,0,0,0,0,6,0,2,0,3,0,5,6,0,0,7,4,5,0,0,0,0,0,0,0,0,0,0,0,1,0,4,0,6,3,2,0,6,0,5,9,0,0,8,4,0,0,0,0,6,3,0,0,0,0,8,4,0,0,0,2],
	[0,0,0,7,0,0,9,0,8,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,2,0,0,0,0,7,0,9,0,4,0,0,0,0,2,0,3,0,0,8,0,2,7,0,1,4,3,1,2,6,0,4,0,9,5,0,7,5,9,0,0,6,4,0,0,0,4,0,1,0,0,7,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,6,7,0,0,0,0,3,4,0,0,0,0,0,2,3,4,0,0,0,0,0,4,5,0,7,9,8,2,1,3,0,0,7,2,1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,6,0,0,7,1,0,0,2,9,0,0,8,0,2,5,6,1],
	[9,0,0,0,0,0,3,0,7,0,0,3,0,0,0,5,0,0,0,7,0,1,0,9,0,4,6,2,1,0,3,0,0,0,9,0,0,0,0,0,0,8,4,0,0,0,0,0,0,0,0,0,0,0,0,3,5,6,8,0,9,0,1,7,0,1,5,9,0,8,0,0,0,9,2,0,4,0,0,5,0],
	[0,0,4,0,0,0,2,9,0,0,0,0,0,0,9,0,0,8,0,0,0,0,6,0,0,0,0,0,0,0,0,0,6,0,8,0,3,0,0,8,0,0,0,2,0,0,0,0,0,7,2,0,0,0,4,0,1,7,8,5,9,6,2,0,5,6,9,0,0,4,1,0,9,7,0,0,1,4,0,5,3],
	[0,6,5,3,0,7,8,0,2,1,0,0,0,5,0,0,0,9,0,0,9,0,0,0,3,0,0,2,1,0,5,0,0,0,0,0,3,0,0,7,0,0,0,0,4,0,0,0,0,0,0,0,0,3,5,0,0,6,0,0,0,0,0,0,4,8,9,7,3,5,0,1,0,0,2,8,0,0,4,0,6],
	[8,7,0,0,0,0,6,0,0,1,0,0,0,0,0,0,0,8,4,6,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,9,0,0,0,0,0,7,0,0,4,0,9,8,0,0,4,0,0,0,0,0,1,4,0,0,9,0,7,0,8,7,9,0,0,0,0,0,9,4,2,0,5,0,8,3,1],
	[4,0,0,0,0,0,0,7,3,0,0,3,0,0,0,0,0,0,0,0,7,0,0,0,0,4,0,0,0,0,3,0,0,0,0,0,0,0,0,0,9,0,0,0,2,7,8,9,0,0,4,0,5,6,6,0,1,0,0,2,0,8,0,8,4,5,0,6,0,0,0,1,9,7,2,0,8,0,6,3,0],
	[0,0,4,0,7,0,3,0,0,1,0,0,2,0,0,6,7,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,5,7,8,0,0,0,0,0,9,0,0,0,0,0,9,0,0,0,3,0,0,6,0,0,1,0,3,4,8,6,0,8,0,7,0,0,6,0,3,0,9,0,0,0,0,2,5,4,0],
	[0,0,0,0,0,0,1,2,0,0,2,0,0,0,0,0,7,0,5,0,8,0,0,0,0,0,0,0,0,0,4,5,0,8,0,0,0,5,6,8,9,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,6,7,2,9,8,5,0,8,5,0,3,1,0,4,0,0,6,2,5,0,0,0,3,0],
	[0,0,9,0,0,8,2,0,0,0,0,0,0,0,0,6,0,0,6,0,8,0,5,0,0,0,0,0,0,3,4,0,5,0,9,0,0,0,7,0,0,0,0,2,0,0,0,0,0,7,0,0,0,5,3,0,0,7,8,4,0,0,2,7,8,2,0,0,6,0,0,3,9,0,0,5,2,0,0,0,0],
	[0,0,2,0,0,7,0,0,0,0,0,6,0,0,0,0,0,0,0,8,0,4,5,0,1,0,0,1,2,0,0,0,0,0,0,7,0,4,0,0,0,0,3,0,2,0,0,0,2,7,3,5,0,0,2,0,1,0,0,4,0,5,9,8,7,4,0,1,0,0,0,0,0,6,0,3,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,4,3,0,8,5,0,0,0,0,8,1,0,0,0,0,7,0,1,0,0,0,0,0,0,0,0,5,0,8,0,1,0,0,2,0,9,7,0,3,6,4,0,5,6,0,0,7,8,0,0,5,0,7,0,0,9,0,0,6,2,0,0,4,2,0,0,0,0,0,1],
	[0,0,0,0,0,0,2,0,0,0,0,4,0,0,8,0,0,9,5,0,0,0,4,7,1,3,6,0,0,3,0,0,6,0,0,0,0,0,0,8,0,9,3,6,2,0,0,0,0,0,3,4,0,0,0,4,0,0,0,2,9,0,0,0,0,0,9,3,0,7,5,4,0,7,1,5,0,0,0,0,3],
	[0,0,0,9,4,0,0,0,0,1,0,0,0,6,0,0,8,0,0,0,9,0,2,0,5,0,0,0,0,4,0,5,0,7,9,8,3,5,0,7,0,0,0,0,4,7,9,8,0,1,4,0,0,0,6,3,0,0,9,2,0,0,5,0,0,0,0,0,5,0,0,0,0,0,5,0,0,1,0,4,2],
	[0,0,0,0,0,0,9,0,0,0,2,0,0,0,9,0,0,0,6,0,0,0,0,0,0,0,5,2,0,0,3,0,0,8,0,0,3,0,6,8,0,1,4,0,7,0,0,0,0,4,0,1,5,3,4,0,0,6,8,0,5,0,0,0,0,2,0,0,3,0,8,4,0,8,7,5,2,0,0,0,0],
	[0,0,9,3,0,0,0,0,8,0,0,0,0,0,8,0,0,0,0,6,0,0,0,9,1,0,0,0,0,2,0,5,6,0,9,0,4,5,0,8,0,0,0,1,0,0,9,0,1,2,3,4,5,0,0,0,1,0,3,0,0,0,5,7,0,0,0,8,0,0,2,0,9,8,5,0,1,0,0,4,0],
	[0,4,0,0,0,3,0,0,0,0,0,5,0,0,0,0,0,0,6,0,0,0,5,9,0,0,0,0,0,3,0,0,6,7,9,0,0,5,0,0,0,0,0,3,0,7,8,9,3,0,0,0,0,6,3,0,1,0,8,0,0,0,0,5,0,7,9,2,1,0,8,0,0,0,4,0,3,0,0,0,2],
	[0,0,8,0,0,0,2,7,0,0,0,0,0,0,7,0,0,0,5,7,9,2,6,0,1,0,0,0,0,0,4,7,5,0,0,6,0,5,6,1,0,0,0,0,0,0,0,0,6,0,3,0,5,1,6,0,0,0,0,2,0,0,0,7,0,0,0,3,0,9,6,2,0,8,0,0,4,0,0,1,0],
	[0,8,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,5,6,0,4,0,0,0,0,0,0,1,4,0,0,0,0,0,8,0,5,0,0,9,0,2,0,0,7,0,0,0,0,0,0,5,6,6,0,1,8,0,5,0,4,0,8,4,2,0,0,0,5,6,7,9,7,0,0,0,2,8,3,0],
	[0,8,4,0,0,0,2,0,5,0,0,0,0,0,0,7,0,0,0,0,7,2,0,0,0,0,4,0,0,0,0,0,0,6,0,8,0,4,0,8,9,1,0,0,0,0,0,0,0,0,0,3,4,0,4,3,1,0,2,0,0,5,6,0,0,2,0,1,4,8,0,3,8,0,0,6,0,0,4,0,2],
	[0,1,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,8,9,2,3,0,1,0,0,0,0,0,0,5,0,0,0,0,4,0,0,7,8,1,2,9,3,8,9,0,3,0,0,4,0,0,0,4,1,0,2,0,0,0,0,0,0,2,9,0,0,0,0,4,0,0,0,6,1,4,0,0,2],
	[0,6,0,0,0,0,0,3,0,0,0,0,0,0,6,0,8,0,0,7,8,2,0,0,0,0,0,2,1,0,3,0,0,0,0,0,3,5,6,7,9,0,2,0,4,7,0,9,1,2,0,3,0,0,0,3,0,0,0,2,0,0,0,0,0,0,0,0,0,5,0,3,8,9,2,0,0,0,0,0,1],
	[0,0,9,0,3,0,5,2,6,1,0,0,0,0,7,0,0,0,0,0,0,2,0,9,0,0,7,0,0,0,0,5,0,7,0,8,0,0,0,0,9,0,0,1,0,0,9,0,4,0,0,3,0,5,5,8,0,6,4,0,0,0,0,0,3,0,0,0,0,0,4,1,0,0,7,0,0,1,0,0,3],
	[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,7,9,0,0,5,6,7,0,0,2,0,0,0,9,8,1,2,0,0,0,0,0,0,3,8,0,0,0,7,5,8,4,1,9,0,0,0,0,2,9,7,0,3,6,2,0,1,4],
	[0,0,0,0,2,0,0,0,0,0,0,0,0,5,0,0,0,9,0,0,8,0,0,0,0,2,0,2,1,5,6,0,4,0,0,0,0,0,7,0,9,1,2,6,0,0,0,0,0,0,0,4,0,3,0,3,1,5,0,2,9,0,0,7,0,0,0,0,0,0,0,1,0,8,0,7,0,0,5,4,2],
	[3,7,0,2,0,0,9,6,0,0,0,0,0,6,0,0,7,0,0,0,0,3,0,0,0,0,4,0,0,0,0,0,0,7,0,0,0,5,0,0,0,0,0,1,0,8,9,7,1,2,0,4,5,6,0,3,1,7,0,0,0,9,0,0,0,0,9,0,0,6,3,0,0,0,0,6,3,0,5,4,0],
	[0,0,0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,8,0,0,0,0,0,0,0,2,7,7,0,0,2,6,0,0,1,5,4,0,1,6,8,5,9,7,2,6,7,5,9,0,0,0,4,3,8,9,0,7,4,0,0,6,0],
	[0,0,4,0,0,0,2,0,7,1,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,0,7,6,8,0,0,0,0,8,0,0,0,0,8,0,0,0,6,5,1,0,4,0,3,1,0,0,0,8,0,6,6,0,2,8,0,4,0,0,0,9,5,8,6,7,3,4,0,0],
	[8,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,8,4,0,9,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,6,0,0,0,8,0,0,0,8,0,0,0,0,0,0,0,3,1,0,0,6,2,9,7,7,8,6,9,1,2,0,0,3,9,4,0,5,3,0,8,0,6],
	[0,9,0,0,0,7,0,5,0,0,0,0,0,5,0,0,7,0,0,0,0,0,3,0,1,0,0,0,0,0,0,0,6,8,0,0,3,0,0,0,0,0,5,2,6,6,0,9,5,8,2,0,1,0,4,3,0,6,7,0,0,0,0,0,0,0,0,1,0,4,6,5,9,0,6,0,0,4,0,3,0],
	[9,1,0,0,0,0,0,0,0,0,0,5,0,6,0,0,0,0,0,7,0,2,3,0,1,4,0,0,2,3,4,5,0,0,0,0,4,0,0,0,0,7,3,0,2,7,0,0,0,0,0,0,6,0,2,0,1,0,0,4,9,0,7,5,6,7,0,0,0,4,8,0,0,0,0,0,7,0,6,2,0],
	[9,0,0,6,0,0,0,0,3,0,0,3,0,0,0,0,0,8,0,0,0,1,0,0,0,0,9,0,1,0,0,0,0,0,0,0,3,5,0,7,0,0,0,0,0,0,8,0,0,0,0,0,0,6,0,0,1,0,0,0,0,8,2,6,0,2,0,3,1,0,4,5,8,0,5,9,0,0,6,3,1],
	[0,0,0,0,7,0,0,1,2,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,2,0,4,3,5,6,8,0,7,0,0,7,0,0,0,0,0,0,6,9,8,0,4,0,1,0,0,0,3,0,6,0,0,0,0,0,8,6,0,0,0,4,7,0,3,9,0,0,0,3,5,6,0,1],
	[0,9,0,1,0,0,4,0,0,0,0,4,0,0,0,0,7,0,0,0,7,0,0,0,1,0,0,3,1,2,0,0,0,8,9,0,0,0,0,0,0,0,3,0,0,0,0,0,9,1,0,2,0,5,6,2,1,0,0,7,0,0,0,8,0,3,0,0,1,0,0,0,0,7,5,8,0,0,0,3,1],
	[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,8,0,0,6,0,0,0,0,0,5,8,9,0,0,0,0,0,8,0,1,2,3,0,0,7,3,0,2,0,6,5,6,0,0,0,7,0,9,0,0,7,0,0,8,9,0,0,1,2,0,8,0,6,0,1,5,0,0],
	[4,0,0,0,0,0,5,0,6,2,5,6,0,0,4,7,0,0,7,8,0,0,5,0,0,0,0,1,0,0,0,0,0,8,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,4,1,0,0,0,4,6,0,2,0,0,8,8,6,0,0,0,0,3,7,2,9,0,0,5,8,3,6,0,1],
	[4,0,0,0,0,2,0,0,0,0,0,0,4,0,0,0,0,8,5,0,9,3,0,8,1,0,4,0,1,4,5,3,0,7,0,9,3,0,0,8,0,0,0,4,0,7,0,0,0,0,0,0,5,0,6,3,0,9,0,0,0,1,7,0,0,5,0,0,0,9,3,0,9,0,0,0,0,0,0,0,0],
	[3,0,0,0,2,0,9,0,0,0,0,0,0,0,0,6,0,0,5,0,0,0,0,0,0,0,0,0,0,3,5,0,6,7,8,9,4,0,0,8,9,0,2,0,6,6,0,8,2,0,0,0,1,0,0,0,1,0,8,0,5,9,0,8,0,0,0,1,5,0,0,0,0,0,5,7,0,2,0,0,1],
	[0,0,0,0,0,0,0,0,0,0,0,3,0,0,9,0,0,0,5,0,0,0,0,7,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,1,4,2,0,0,8,0,1,4,0,5,0,0,3,2,0,7,1,8,0,0,8,6,0,9,0,5,0,0,3,9,0,5,8,4,0,6,2,0],
];
export default sudokus;