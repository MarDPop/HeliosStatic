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

/*
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
*/
/*
var mydrag = function(){
	return {
		move : function(divid,xpos,ypos){
			divid.style.left = xpos + 'px';
			divid.style.top = ypos + 'px';
		},
		startMoving : function(divid,container,evt){
			evt = evt || window.event;
			var posX = evt.clientX,
				posY = evt.clientY,
			divTop = divid.style.top,
			divLeft = divid.style.left,
			eWi = parseInt(divid.style.width),
			eHe = parseInt(divid.style.height),
			cWi = parseInt(document.getElementById(container).style.width),
			cHe = parseInt(document.getElementById(container).style.height);
			document.getElementById(container).style.cursor='move';
			divTop = divTop.replace('px','');
			divLeft = divLeft.replace('px','');
			var diffX = posX - divLeft,
				diffY = posY - divTop;
			document.onmousemove = function(evt){
				evt = evt || window.event;
				var posX = evt.clientX,
					posY = evt.clientY,
					aX = posX - diffX,
					aY = posY - diffY;
					if (aX < 0) aX = 0;
					if (aY < 0) aY = 0;
					if (aX + eWi > cWi) aX = cWi - eWi;
					if (aY + eHe > cHe) aY = cHe -eHe;
				mydragg.move(divid,aX,aY);
			}
		},
		stopMoving : function(container){
			var a = document.createElement('script');
			document.getElementById(container).style.cursor='default';
			document.onmousemove = function(){}
		},
	}
}();
*/