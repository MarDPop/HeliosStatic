CONSTANTS = {
	"Gravity" : 6.67430e-11,
	"AU" : 149597870.700,
	"Day" : 84600.0,
	"Stefan-Boltzman" : 5.670374419e-8,
	"Plank" : 6.62607015e-34,
	"Light speed" : 299792458,
	"Cs Hyperfine" : 9192631770,
	"Electron Charge" : 1.602176634e-19,
	"Boltzman" : 1.380649e-23,
	"Avogadro" : 6.02214076e23,
	"Luminous Efficacy 540" : 683,
	"Solar MU" : 1.32712440018e11
	
}

//import * as THREE from './three.module.js';

function fix(n) {
	if(n > 0) {
		return Math.floor(n);
	}
	if(n < 0) {
		return Math.ceil(n);
	}
	return 0;
}

function matCartesian(matrix,vec) {
	return [
		matrix[0][0]*vec[0]+matrix[0][1]*vec[1]+matrix[0][2]*vec[2],
		matrix[1][0]*vec[0]+matrix[1][1]*vec[1]+matrix[1][2]*vec[2],
		matrix[2][0]*vec[0]+matrix[2][1]*vec[1]+matrix[2][2]*vec[2]
	];
}

function cross(u,v) {
	return [
		u[1]*v[2]-u[2]*v[1],
		u[2]*v[0]-u[0]*v[2],
		u[0]*v[1]-u[1]*v[0]
	];
}

function dot(u,v) {
	return u[0]*v[0]+u[1]*v[1]+u[2]*v[2];
}

function matrixMult(a, b) {
  var aNumRows = a.length, aNumCols = a[0].length,
      bNumRows = b.length, bNumCols = b[0].length,
      m = new Array(aNumRows);  // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;             // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

function norm(vec) {
		return Math.sqrt(vec[0]*vec[0]+vec[1]*vec[1]+vec[2]*vec[2]);
}

function multCartesian(vec,a) {
	return [vec[0]*a,vec[1]*a,vec[2]*a];
}


