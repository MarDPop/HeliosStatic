function dateToJulianNumber(d) {
    // convert a Gregorian Date to a Julian number. 
    //    S.Boisseau / BubblingApp.com / 2014
    var x = Math.floor((14 - d.getMonth())/12);
    var y = d.getFullYear() + 4800 - x;
    var z = d.getMonth() - 3 + 12 * x;
	var s = (d.getUTCHours()*3600 + d.getUTCMinutes()*60 + d.getUTCSeconds())/86400;

    var n = d.getDate() + Math.floor(((153 * z) + 2)/5) + (365 * y) + Math.floor(y/4) + Math.floor(y/400) - Math.floor(y/100) - 32045 + s;

    return n;
}   

function julianIntToDate(n) {
    // convert a Julian number to a Gregorian Date.
    //    S.Boisseau / BubblingApp.com / 2014
    var a = n + 32044;
    var b = Math.floor(((4*a) + 3)/146097);
    var c = a - Math.floor((146097*b)/4);
    var d = Math.floor(((4*c) + 3)/1461);
    var e = c - Math.floor((1461 * d)/4);
    var f = Math.floor(((5*e) + 2)/153);

    var D = e + 1 - Math.floor(((153*f) + 2)/5);
    var M = f + 3 - 12 - Math.round(f/10);
    var Y = (100*b) + d - 4800 + Math.floor(f/10);

    return new Date(Y,M,D);
}

function oe2state( oe , mu ) {
	tmp = 1 - oe[1]*oe[1];
	ct = cos(oe[5]);
	st = sin(oe[5]);
	tmp2 = 1+oe[1]*ct;
	radius = oe[0]*tmp/tmp2;
	x = radius*ct;
	y = radius*st;
	tmp = sqrt( mu*oe[0]*tmp )/radius;
	v = new THREE.Vector2(tmp*st/tmp2,tmp*(oe[1]+ct)/tmp2);
	cw = cos(oe[4]);
	sw = sin(oe[4]);
	co = cos(oe[3]);
	so = sin(oe[3]);
	ct = cos(oe[2]);
	st = sin(oe[2]);
	Rxx = cw*co-sw*ct*so;
	Rxy = sw*co+cw*ct*so;
	Ryx = cw*so+sw*ct*co;
	Ryy = cw*ct*co-sw*so;
	Rzx = sw*st;
	Rzy = cw*st;
	
	state.r = new Vector3(Rxx*x+Rxy*y,Ryx*x+Ryy*y,Rzx*x+Rzy*y);
	state.v = new Vector3(Rxx*x_dot+Rxy*y_dot,Ryx*x_dot+Ryy*y_dot,Rzx*x_dot+Rzy*y_dot);
	return state;
}

function oe2pos( oe , mu ) {
	ct = cos(oe[5]);
	radius = oe[0]*(1 - oe[1]*oe[1])/(1+oe[1]*ct);
	x = radius*ct;
	y = radius*sin(oe[5]);
	cw = cos(oe[4]);
	sw = sin(oe[4]);
	co = cos(oe[3]);
	so = sin(oe[3]);
	ct = cos(oe[2]);
	st = sin(oe[2]);
	Rxx = cw*co-sw*ct*so;
	Rxy = sw*co+cw*ct*so;
	Ryx = cw*so+sw*ct*co;
	Ryy = cw*ct*co-sw*so;
	Rzx = sw*st;
	Rzy = cw*st;
	
	return new Vector3(Rxx*x+Rxy*y,Ryx*x+Ryy*y,Rzx*x+Rzy*y);
}

function state2oe( r , v , mu) {
	h = r.cross(v);
	n = (new Vector3(0,0,1)).cross(h);
	v2 = v.dot(v);
	radius = r.lengthSq();
	rv = r.dot(v);
	e = r.clone().multiplyScalar(v2/mu - 1/radius)+ v.clone().multiplyScalar(rv/mu);
	egy = v2/2-mu/radius;
	oe[0] = -mu/(2*egy);
	oe[1] = e.lengthSq();
	oe[2] = acos(h.z/h.lengthSq());
	nmag = n.lengthSq();
	oe[3] = acos(n.x/nmag);
	if(n[1] < 0) {
		oe[3] = 6.28318530717958647692528676 - oe[3];
	}	
	oe[4] = acos(n.dot(e)/(nmag*oe[1]));
	if(e[2] < 0) {
		oe[4] = 6.28318530717958647692528676 - oe[4];
	}
	oe[5] = acos(e.dot(r)/(oe[1]*radius));
	if( rv < 0 ) {
		oe[5] = 6.28318530717958647692528676
	}
}

var db;

var planetList = {};

(function () {

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;

	// Earth params
	var radius   = 6378000,
		segments = 32,
		rotation = 5;  

	var scene = new THREE.Scene();
	
	THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);

	var camera = new THREE.PerspectiveCamera(45, width / height, 1000, 1e20);
	camera.position.set(149597870700,1e8,0);
	camera.up.set(0,0,1);
	camera.lookAt(149597870700,0,0);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	renderer.physicallyCorrectLights = true;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.VSMShadowMap;
	renderer.gammaFactor = 1;
	renderer.toneMapping = THREE.ACESFilmicToneMapping; //THREE.LinearToneMapping THREE.Uncharted2ToneMapping , THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = 0.5;
	renderer.toneMappingWhitePoint = 0.5;

	scene.add(new THREE.AmbientLight(0x333333));

	var light = new THREE.PointLight(0xffffff, 1,0,2); //3.75e28 lum 3.82e26 wa
	light.position.set(0,0,0);
	light.power = 3.82e26/60;
	/*
	light.castShadow = true; 
	light.shadow.mapSize.width = 2048;  // default
	light.shadow.mapSize.height = 2048; // default
	light.shadow.camera.near = 1000;    // default
	light.shadow.camera.far = 1e20;     // default
	*/
	scene.add(light);
	
	var clouds;
	var dt;
	
	$.getJSON("/data/db.json",function(data) {
		db = data;
		
		for(planet : db["Planets"]) {
			var p;
			if(planet == "Earth") {
				p = createEarth();
			} else if (planet == "Sun") {
				p = createSun();
			} else {
				p = createSphere(planet["Radius"],segments,planet["Image"]);
			}
			p.position.set(CONSTANTS["AU"]*1000,0,1e7);
			p.rotateX(Math.PI/2);
			planetGeometry[planet] = p;
			scene.add(p);
		}

		clouds = createClouds(radius, segments);
		clouds.rotateX(Math.PI/2);
		scene.add(clouds);

		var stars = createStars(40*149597870700, 32);
		scene.add(stars);

		var controls = new THREE.MyControls(camera);
		controls.setTarget( new THREE.Vector3( 149597870700, 0, 0 ) );

		webglEl.appendChild(renderer.domElement);

		render();

		function render() {
				
			setTimeout(function() {	
				controls.update();		
				requestAnimationFrame(render);
				renderer.render(scene, camera);
			},1000/25);
			
		}
		
		updatePositions();
		
		setTimeout(function(){
			$("#modal-container").fadeOut(1000, function() {
				$("#loader-screen").hide();
			});
		},1000);
		
	}).fail(function() {
		
		setTimeout(function(){
			$("#target").text("Database failed to load.");
		},1000);
		
	}).always(function() {
		
	});
	
	function updatePositions() {
		let t = $("#time input").val();
		
		let JDN = dateToJulianNumber(new Date());
		
		for( planet in planetList){
			
			let tab = db["Planets"][planet]["JD (TDB)"];
			var i = 0;
			while(tab[i] < JDN) {
				i++;
			}
			
			let deltaT = ;
			
			db["Planets"][planet]["Orb Elements"]
			state = oe2pos(){
				
			}
		}
		
		setTimeout(function() {
			
		},500);
	}
	
	

	// Since most planets won't use bump mapping use this
	function createSphere(radius, segments,image, reflection) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({ 
				map: new THREE.TextureLoader().load( image ),	
				reflectivity: reflection,			
			})
		);
	}
	
	function createEarth() {
		return new THREE.Mesh(
			new THREE.SphereGeometry(6378000, 64, 64),
			new THREE.MeshPhongMaterial({
				map:         new THREE.TextureLoader().load('../media/images/8k_earth_daymap.jpg'),
				bumpMap:     new THREE.TextureLoader().load('../media/images/elev_bump_4k.jpg'),
				bumpScale:   8000,
				// normalMap: new THREE.TextureLoader().load('../media/images/8k_earth_normal_map.tif'),
				specularMap: new THREE.TextureLoader().load('../media/images/8k_earth_specular_map.tif'),
				specular:    0x111111,
				reflectivity: 0.7,
				shininess: 10,
			})
		);
	}

	function createClouds() {
		return new THREE.Mesh(
			new THREE.SphereGeometry(6390000, 64, 64),			
			new THREE.MeshPhongMaterial({
				map:         new THREE.TextureLoader().load('../media/images/fair_clouds_4k.png'),
				transparent: true,
			})
		);		
	}
	
	function createSun(segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(696342000, 32, 32),
			new THREE.MeshPhongMaterial({
				map:  new THREE.TextureLoader().load('../media/images/2k_sun.jpg'),
				lightMap: new THREE.TextureLoader().load('../media/images/2k_sun.jpg'),
				lightMapIntensity: 50,
				//emissive: 0xffffff,
				//emissiveIntensity: 3.8e28,
			})
		);
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial ({
				map:  new THREE.TextureLoader().load('../media/images/8k_stars_milky_way.jpg'), 
				side: THREE.BackSide,
				//lightMap:  new THREE.TextureLoader().load('../media/images/8k_stars_milky_way.jpg'), 
				//lightMapIntensity: 1e6,
			})
		);
	}

}());

