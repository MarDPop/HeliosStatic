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
	let tmp = 1 - oe[1]*oe[1];
	let ct = Math.cos(oe[5]);
	let st = Math.sin(oe[5]);
	let tmp2 = 1+oe[1]*ct;
	let radius = oe[0]*tmp/tmp2;
	let x = radius*ct;
	let y = radius*st;
	tmp = Math.sqrt( mu*oe[0]*tmp )/radius;
	let v = new THREE.Vector2(tmp*st/tmp2,tmp*(oe[1]+ct)/tmp2);
	let cw = Math.cos(oe[4]);
	let sw = Math.sin(oe[4]);
	let co = Math.cos(oe[3]);
	let so = Math.sin(oe[3]);
	ct = Math.cos(oe[2]);
	st = Math.sin(oe[2]);
	let Rxx = cw*co-sw*ct*so;
	let Rxy = sw*co+cw*ct*so;
	let Ryx = cw*so+sw*ct*co;
	let Ryy = cw*ct*co-sw*so;
	let Rzx = sw*st;
	let Rzy = cw*st;
	var state = {};
	state["r"] = new THREE.Vector3(Rxx*x+Rxy*y,Ryx*x+Ryy*y,Rzx*x+Rzy*y);
	state["v"] = new THREE.Vector3(Rxx*x_dot+Rxy*y_dot,Ryx*x_dot+Ryy*y_dot,Rzx*x_dot+Rzy*y_dot);
	return state;
}

function oe2pos( oe , mu ) {
	let ct = Math.cos(oe[5]);
	let radius = oe[0]*(1 - oe[1]*oe[1])/(1+oe[1]*ct);
	let x = radius*ct;
	let y = radius*Math.sin(oe[5]);
	let cw = Math.cos(oe[4]);
	let sw = Math.sin(oe[4]);
	let co = Math.cos(oe[3]);
	let so = Math.sin(oe[3]);
	ct = Math.cos(oe[2]);
	let st = Math.sin(oe[2]);
	let Rxx = cw*co-sw*ct*so;
	let Rxy = sw*co+cw*ct*so;
	let Ryx = cw*so+sw*ct*co;
	let Ryy = cw*ct*co-sw*so;
	let Rzx = sw*st;
	let Rzy = cw*st;
	
	return new THREE.Vector3(Rxx*x+Rxy*y,Ryx*x+Ryy*y,Rzx*x+Rzy*y);
}

function state2oe( r , v , mu) {
	var h = r.cross(v);
	var n = (new Vector3(0,0,1)).cross(h);
	var v2 = v.dot(v);
	var radius = r.length();
	var rv = r.dot(v);
	var e = r.clone().multiplyScalar(v2/mu - 1/radius)+ v.clone().multiplyScalar(rv/mu);
	var egy = v2/2-mu/radius;
	var oe = [];
	oe[0] = -mu/(2*egy);
	oe[1] = e.lengthSq();
	oe[2] = Math.acos(h.z/h.length());
	var nmag = n.length();
	oe[3] = Math.acos(n.x/nmag);
	if(n[1] < 0) {
		oe[3] = 6.28318530717958647692528676 - oe[3];
	}	
	oe[4] = Math.acos(n.dot(e)/(nmag*oe[1]));
	if(e[2] < 0) {
		oe[4] = 6.28318530717958647692528676 - oe[4];
	}
	oe[5] = Math.acos(e.dot(r)/(oe[1]*radius));
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
	camera.up.set(0,0,1);

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
	light.power = 3.82e20/60;
	//light.power = 3.82e26/60;
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
		
		var earth;
		
		for(var planet in db["Planets"]) {
			var p;
			if(planet == "Earth") {
				p = createEarth();
				
				earth = p;
				
			} else if (planet == "Sun") {
				p = createSun();
			} else {
				if (db["Planets"][planet]["Img"] == "") {
					p = createSphere(db["Planets"][planet]["Radius"],segments,"../media/images/2k_ceres_fictional.jpg");
				} else {
					p = createSphere(db["Planets"][planet]["Radius"],segments,db["Planets"][planet]["Img"]);
				}
			}
			p.rotateX(Math.PI/2);
			planetList[planet] = p;
			scene.add(p);
		}

		//clouds = createClouds(radius, segments);
		//clouds.rotateX(Math.PI/2);
		//scene.add(clouds);
		
		updatePositions();
		
		camera.position.set( earth.position.x , earth.position.y + 1e4, earth.position.z );
		camera.lookAt( earth.position );

		var stars = createStars(45*CONSTANTS["AU"], 32);
		stars.rotateX(Math.PI/2);
		scene.add(stars);

		var controls = new THREE.MyControls(camera,document.getElementById('webgl'));
		controls.setPlanet( earth );

		webglEl.appendChild(renderer.domElement);
		
		populateBodyList( db );

		render();

		function render() {
				
			setTimeout(function() {	
				controls.update();		
				requestAnimationFrame(render);
				renderer.render(scene, camera);
			},1000/25);
			
		}
		
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
		
		for(var planet in planetList){
			
			let DT = db["Planets"][planet]["DT"];
			if (DT == 0) {
				var idx = 0;
				while(days[i] < JDN) {
					idx++;
				}
				idx--;
				var delta_hi = (JDN-days[idx])/(days[idx+1]-days[idx]);
				
			} else {
				var delta_hi = (JDN- db["Planets"][planet]["JD (TDB)"][0])/DT;
				var idx = Math.floor(delta_hi);
				delta_hi -= idx;
				
			}
			var oe = db["Planets"][planet]["Orb Elements"][idx].slice();
			var delta_lo = 1-delta_hi;
			for(var i = 0; i < 6; i++) {
				oe[i] = delta_lo*oe[i] + delta_hi*db["Planets"][planet]["Orb Elements"][idx+1][i];
			}
			var posi = oe2pos(oe, db["Planets"][planet]["Ref. MU"]);
			
			var refCenter = db["Planets"][planet]["Ref. Center"];
			
			var posj = new THREE.Vector3(0,0,0);
			if(refCenter.localeCompare("Solar System Barycenter") != 0) {
				var oe = db["Planets"][refCenter]["Orb Elements"][idx].slice();
				var delta_lo = 1-delta_hi;
				for(var i = 0; i < 6; i++) {
					oe[i] = delta_lo*oe[i] + delta_hi*db["Planets"][refCenter]["Orb Elements"][idx+1][i];
				}
				posj = oe2pos(oe, db["Planets"][planet]["Ref. MU"]);
			}
			
			planetList[planet].position.set(CONSTANTS["AU"]*(posi.x+posj.x),CONSTANTS["AU"]*(posi.y+posj.y),CONSTANTS["AU"]*(posi.z+posj.z));
			
			if(planet == "Sun") {
				
				light.position.set(planetList[planet].position.x,planetList[planet].position.y,planetList[planet].position.z);
				
			}
			
		}
		
		setTimeout(function() {
			updatePositions();
		},500);
	}
	
	

	// Since most planets won't use bump mapping use this
	function createSphere(radius, segments, image, reflection = 0.7) {
		return new THREE.Mesh(
			new THREE.SphereBufferGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({ 
				map: new THREE.TextureLoader().load( image ),	
				reflectivity: reflection,	
				specular:    0x111111,
				shininess: 20,
			})
		);
	}
	
	function createEarth() {
		return new THREE.Mesh(
			new THREE.SphereGeometry(6378, 64, 64),
			new THREE.MeshPhongMaterial({
				map:         new THREE.TextureLoader().load('../media/images/8k_earth_daymap.jpg'),
				bumpMap:     new THREE.TextureLoader().load('../media/images/elev_bump_4k.jpg'),
				bumpScale:   8,
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
			new THREE.SphereGeometry(6390, 64, 64),			
			new THREE.MeshPhongMaterial({
				map:         new THREE.TextureLoader().load('../media/images/fair_clouds_4k.png'),
				transparent: true,
			})
		);		
	}
	
	function createSun(segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(696342, 32, 32),
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

