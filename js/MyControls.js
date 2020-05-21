/**
 * @author Eberhard Graether / http://egraether.com/
 */
 

THREE.MyControls = function ( object , domElement ) {
	
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	var _this = this;
	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 };
	var _state = STATE.NONE;

	this.object = object;

	// API

	this.enabled = true;
	
	this.raycaster = new THREE.Raycaster();

	this.screen = { width: 0, height: 0, offsetLeft: 0, offsetTop: 0 };
	
	this.radius = ( this.screen.width + this.screen.height ) / 2;


	// internals
	this.target;
	
	var target0 = new THREE.Vector3();

	this.direction = new THREE.Vector3();
	
	var direction0 = new THREE.Vector3();
	
	this.cameraX = new THREE.Vector3();
	
	this.cameraY = new THREE.Vector3();
	
	var _delta = new THREE.Vector2();
	
	this.mouseScreenStart;
	
	this.mouseScreen;
	
	this.aspectVertical;
	
	this.aspectHorizontal;
	
	this.panFactor = 0.5;
	
	this.zoom;
	
	this.zoomFactor = 0.1;
	
	this.rotationFactor = 2;
	
	this.shiftKeyPressed = false;
	
	var d;

	// methods

	this.handleResize = function () {

		this.screen.width = window.innerWidth;
		this.screen.height = window.innerHeight;

		this.screen.offsetLeft = 0;
		this.screen.offsetTop = 0;

		this.radius = ( this.screen.width + this.screen.height ) / 2;
		console.log("using radius : " + this.radius);
		
		this.aspectVertical = this.rotationFactor*_this.object.fov/(57.3*_this.screen.height);
		this.aspectHorizontal = this.rotationFactor*_this.object.fov*_this.object.aspect/(57.3*_this.screen.width);

	};
	
	this.setTarget = function( pos ) {
		
		_this.target = pos.clone();
		
		_this.direction.subVectors( _this.object.position, _this.target );
		
		_this.handleResize();
	
	}
	
	/*
	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};
	*/

	this.rotate = function () {

		var angleX = this.aspectVertical*_delta.y;
		
		var angleY = this.aspectHorizontal*_delta.x;
		
		let axis = _this.cameraX.clone().multiplyScalar( angleX ).add( _this.cameraY.clone().multiplyScalar( angleY ) ); // might need to use up0
		
		let angle = axis.length();
		
		axis.divideScalar(angle);
		
		_this.direction = _this.direction0.clone();

		_this.direction.applyAxisAngle( axis, -angle );
		
		//_this.object.up.applyAxisAngle( axis, -angle );
		
		
		// remember camera up is y, stares down negative z, right is x
	};
	
	this.update = function() {
		
		if ( _state === STATE.ROTATE ) {

			_this.rotate();

		}  else if ( _state === STATE.PAN ) {

			_this.pan();

		}  else if (_state === STATE.ZOOM ) {
			
			//_this.zoom();
			
		}
		
		this.object.position.addVectors( _this.target, _this.direction );
		
		this.object.lookAt( _this.target );
		
	}

	this.zoom = function ( delta ) {

		if ( _state === STATE.TOUCH_ZOOM ) {

			var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_this.direction0.multiplyScalar( factor );

		} else {
			delta *= _this.zoomFactor;

			if (delta < 0) {
				delta = 1.0/(1-delta);
			} else {
				delta+=1.0;
			}

			_this.direction.multiplyScalar( delta );

		}

	};

	this.pan = function () {

		console.log(d);

		var pan = _this.cameraX.clone().setLength( _delta.x/_this.screen.width );
		
		pan.add( _this.cameraY.clone().setLength( -_delta.y/_this.screen.height ) );
		
		_this.target.subVectors( _this.target0, pan.multiplyScalar( d ) );

	};

	// listeners

	function keydown( event ) {

		if ( _this.enabled === false ) return;

		window.removeEventListener( 'keydown', keydown );

		if ( _this._state !== STATE.NONE ) {

			return;

		} else if(event.shiftKey){
			
			_this.shiftKeyPressed = true;

		} 

	}

	function keyup( event ) {

		if ( _this.enabled === false ) return;

		_this.shiftKeyPressed = false;

	}

	function mousedown( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {
			
			_state = event.button;

		}

		_this.mouseScreen = _this.mouseScreenStart = new THREE.Vector2(event.clientX - _this.screen.offsetLeft, event.clientY - _this.screen.offsetTop);

		let el = _this.object.matrixWorldInverse.elements;
		_this.cameraX = new THREE.Vector3(el[0],el[4],el[8]);
		_this.cameraY = new THREE.Vector3(el[1],el[5],el[9]);
		
		_this.direction.subVectors( _this.object.position, _this.target );
		
		if ( _state == STATE.PAN ) {
			
			_this.target0 = _this.target.clone();
			d = _this.panFactor*_this.direction.length();
			
		} else if (_state == STATE.ROTATE ) {
			
			_this.direction0 = _this.direction.clone();
			
		}
		
		document.addEventListener( 'mousemove', mousemove, false );
		document.addEventListener( 'mouseup', mouseup, false );
	}

	function mousemove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();
		
		_this.mouseScreen = new THREE.Vector2(event.clientX - _this.screen.offsetLeft, event.clientY - _this.screen.offsetTop);

		_delta.subVectors(_this.mouseScreen, _this.mouseScreenStart );

	}

	function mouseup( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener( 'mousemove', mousemove );
		document.removeEventListener( 'mouseup', mouseup );

	}

	function mousewheel( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail / 3;

		}

		_this.zoom( delta );

	}

	function touchstart( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				break;

			case 2:
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				
				break;

			case 3:
				
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchmove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
				
				break;

			case 2:
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				
				break;

			case 3:
				_
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchend( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				
				break;

			case 2:
				
				break;

			case 3:
				
				break;

		}

		_state = STATE.NONE;

	}
	
	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousedown', mousedown, false );

	this.domElement.addEventListener( 'mousewheel', mousewheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

	window.addEventListener( 'keydown', keydown, false );
	window.addEventListener( 'keyup', keyup, false );

};

THREE.MyControls.prototype = Object.create( THREE.EventDispatcher.prototype );