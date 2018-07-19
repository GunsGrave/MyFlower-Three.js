function start() {
	document.getElementById("text").style.display = "block";
	document.getElementById("canvas-frame").style.display = "none";
}

function showCanvas() {
	document.getElementById("text").style.display = "none";
	document.getElementById("canvas-frame").style.display = "block";
}

function initName() {
	var text = document.getElementById("textin").value;
	document.getElementById("name").innerHTML = "Your flowers for " + text;
}

var clock;
var renderer;
var stats;

var Colors = {
   red:0xf25346,  
   white:0xd8d0d1,  
   brown:0x59332e,  
   pink:0xF5986E,
   brownDark:0x23190f,  
   blue:0x68c3c0
};

function initThree() {
	clock = new THREE.Clock();
	width = document.getElementById('canvas-frame').clientWidth;
	height = document.getElementById('canvas-frame').clientHeight;
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(width, height);
	document.getElementById('canvas-frame').appendChild(renderer.domElement);
	renderer.setClearColor(0xFFFFFF, 1.0);
	renderer.gammaOutput = true;
	renderer.shadowMap.enabled = true;

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.getElementById('canvas-frame').appendChild(stats.domElement);
}

var camera;

function initCamera() {
	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	camera.position.x = 0;
	camera.position.y = 20;
	camera.position.z = 10;
	/*camera.up.x = 0;
	camera.up.y = 1;
	camera.up.z = 0;
	camera.lookAt({
	    x : 0,
	    y : 0,
	    z : 0
	});*/
}

var scene;
var mixer;
var flowers;

function initScene() {
	scene = new THREE.Scene();
	var loader = new THREE.GLTFLoader();
	loader.load('object/final/test.gltf', function (gltf) {


		scene.add(gltf.scene);
		/*var animationClip = gltf.animations[0];
		mixer = new THREE.AnimationMixer(scene);
		mixer.clipAction(animationClip).play();*/

		// envmap
		var path = 'textures/cube/Park2/';
		var format = '.jpg';
		var envMap = new THREE.CubeTextureLoader().load([
			path + 'posx' + format, path + 'negx' + format,
			path + 'posy' + format, path + 'negy' + format,
			path + 'posz' + format, path + 'negz' + format
		]);
		/*var envMap = new THREE.CubeTextureLoader().load([
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		]);*/
		scene.background = envMap;
		
		gltf.scene.traverse(function (child) {
			if (child.isMesh) {
				child.material.envMap = envMap;
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		flowers = scene.children[0].children[0].children;
		for (var x in flowers) {
			flowers[x].visible = false;
			flowers[x].originalScale = new THREE.Vector3(flowers[x].scale.x, flowers[x].scale.y, flowers[x].scale.z);
		}
		showNextFlower();

		initLight();
		initControls();
		render();
	});
}

var count = 0;

function showNextFlower() {
	if (count < flowers.length) {
		flowers[count].visible = true;
		//var p = flowers[count].originalScale;
		flowers[count].scale.set(0, 0, 0);
		++count;
	}
}

var light;

function initLight() {
	light = new THREE.DirectionalLight(0xFDF9F8, 1.0, 0);
	light.position.set(0, 100, 200);
	light.castShadow = true;
	//light.shadowMapEnabled = true;
	light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
	scene.add(light);
	
	/*var lightHelper = new THREE.DirectionalLightHelper( light, 5, 
    Colors.red );
    scene.add(lightHelper);*/
}

var orbitControl

function initControls() {
	orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
	orbitControl.enableDamping = true;
	orbitControl.dampingFactor = 0.25;
	orbitControl.enableZoom = true;
	//orbitControl.autoRotate = true;
	orbitControl.minDistance = 1;
	orbitControl.maxDistance = 1000;
	orbitControl.target = new THREE.Vector3(0, 18, 3.5);
	orbitControl.minPolarAngle = Math.PI / 4;
	orbitControl.maxPolarAngle = Math.PI / 2;
	orbitControl.rotateSpeed = 0.5;
}

var incrementRate = 1 / 60;

function render() {
	renderer.clear();
	renderer.render(scene, camera);
	requestAnimationFrame(render);

	orbitControl.update();
	stats.update();
	//mixer.update(0.75 * clock.getDelta());
	if (count <= flowers.length) {
		for (var i in flowers)
			if (flowers[i].scale.x < flowers[i].originalScale.x) {
				var s = flowers[i].scale;
				var os = flowers[i].originalScale;
				flowers[i].scale.set(s.x + os.x * incrementRate, s.y + os.y * incrementRate, s.z + os.z * incrementRate);
			}
	}
}

function threeStart() {
	showCanvas();
	initName();
	initThree();
	initCamera();
	initScene();
	/*initLight();
	initObject();
	initControls();
	render();*/
}

function onMouseClick() {
	showNextFlower();
}
