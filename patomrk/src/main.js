// ----------------------------
// Variables globales
// ----------------------------
var scene = null;
var camera = null;
var renderer = null;
var clock = null;

var sound1 = null;
var light = null;
var island = null;

var MovingCube = null;
var collidableMeshList = [];

var Ducks = [];

var lives = 3;
var attackDuck = false;

// --- Escalado suave ---
var targetScale = 0.3;           // escala objetivo (normal/ataque)
var currentScale = 0.3;          // valor interpolado actual
var lerpSpeed = 0.08;            // qué tan rápido se hace la transición

var rotSpd = 0.05;
var spd = 0.05;

var input = {
  left: 0,
  right: 0,
  up: 0,
  down: 0
};

var posX = 3;
var posY = 0.5;
var posZ = 1;

var position1 = [-1,0,6];
var position2 = [11,0,6];
var position3 = [-1,0,-6];
var position4 = [11,0,-6];

var timerInterval = null;  // Para controlar el intervalo del timer

// ----------------------------
// Inicio
// ----------------------------
function start() {
  window.onresize = onWindowResize;
  initScene();
  animate();
}

function onWindowResize() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

function initScene() {
  initBasicElements();
  initSound();
  createLight();
  createIsland();
  initWorld();
  createPlayerMove();

  document.getElementById("lives").innerHTML = lives;
}

function initBasicElements() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#app") });
  clock = new THREE.Clock();

  scene.background = new THREE.Color(0x0099ff);
  renderer.setSize(window.innerWidth, window.innerHeight - 4);
  camera.position.set(posX, posY, posZ);
}

function initSound() {
  sound1 = new Sound(["./songs/rain.mp3"], 500, scene, {
    debug: true,
    position: { x: camera.position.x, y: camera.position.y + 10, z: camera.position.z }
  });
}

// ----------------------------
// Isla (OBJ + MTL)
// ----------------------------
function createIsland() {
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath("./modelos/island/");
  mtlLoader.setPath("./modelos/island/");

  mtlLoader.load("littleisle.mtl", function(materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath("./modelos/island/");

    objLoader.load("littleisle.obj", function(object) {
      island = object;
      island.position.set(5, -2, 0);
      island.scale.set(0.5, 0.5, 0.5);
      scene.add(island);
    });
  });
}

// ----------------------------
// Crear patos
// ----------------------------
function createDuck(position, indice, scale) {
  const loader = new THREE.GLTFLoader();
  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath("./modelos/other/");
  loader.setDRACOLoader(dracoLoader);

  loader.load("./modelos/other/Duck.gltf", function(gltf) {
    Ducks[indice] = gltf.scene;
    scene.add(gltf.scene);
    gltf.scene.scale.set(scale, scale, scale);
    gltf.scene.position.set(position[0], position[1], position[2]);
  });
}

function initWorld() {
  createDuck(position1, 0, 0.3);
  createDuck(position2, 1, 0.3);
  createDuck(position3, 2, 0.3);
  createDuck(position4, 3, 0.3);
}

// ----------------------------
function createLight() {
  var ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
  light = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(light);
}

// ----------------------------
function createPlayerMove() {
  var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  var wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0
  });
  MovingCube = new THREE.Mesh(cubeGeometry, wireMaterial);
  MovingCube.position.copy(camera.position);
  scene.add(MovingCube);
}

// ----------------------------
function movePlayer() {
  if (input.right == 1) {
    camera.rotation.y -= rotSpd;
    MovingCube.rotation.y -= rotSpd;
  }
  if (input.left == 1) {
    camera.rotation.y += rotSpd;
    MovingCube.rotation.y += rotSpd;
  }
  if (input.up == 1) {
    camera.position.z -= Math.cos(camera.rotation.y) * spd;
    camera.position.x -= Math.sin(camera.rotation.y) * spd;
    MovingCube.position.z -= Math.cos(camera.rotation.y) * spd;
    MovingCube.position.x -= Math.sin(camera.rotation.y) * spd;
  }
  if (input.down == 1) {
    camera.position.z += Math.cos(camera.rotation.y) * spd;
    camera.position.x += Math.sin(camera.rotation.y) * spd;
    MovingCube.position.z += Math.cos(camera.rotation.y) * spd;
    MovingCube.position.x += Math.sin(camera.rotation.y) * spd;
  }
}

// ----------------------------
// Validar límites → restar vidas
// ----------------------------
function verificarLimite() {
  if (
    MovingCube.position.x > 20 ||
    MovingCube.position.x < -10 ||
    MovingCube.position.z > 15 ||
    MovingCube.position.z < -15
  ) {
    lives--;
    document.getElementById("lives").innerHTML = lives;

    camera.position.set(posX, posY, posZ);
    MovingCube.position.set(posX, posY, posZ);

    if (lives <= 0) {
      document.getElementById("lost").style.display = "block";
      document.getElementById("cointainerOthers").style.display = "none";
      pauseAudio(x);
      playAudio(y);
      
      // Detener el timer cuando se acaban las vidas
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  }
}

// ----------------------------
function animate() {
  requestAnimationFrame(animate);

  movePlayer();
  verificarLimite();

  // --- Movimiento de patos + escalado suave ---
  if (Ducks.length > 0) {
    Ducks[0].position.x += 0.01;
    Ducks[1].position.z -= 0.01;
    Ducks[2].position.z += 0.01;
    Ducks[3].position.x -= 0.01;

    // Interpolación exponencial de la escala
    currentScale += (targetScale - currentScale) * lerpSpeed;

    var scaleVec = new THREE.Vector3(currentScale, currentScale, currentScale);
    for (var i = 0; i < Ducks.length; i++) {
      Ducks[i].scale.copy(scaleVec);
    }
  }

  renderer.render(scene, camera);
  sound1.update(camera);
}

// ----------------------------
// Eventos de teclado
// ----------------------------
window.addEventListener("keydown", function(e) {
  // Movimiento WASD
  switch (e.keyCode) {
    case 68: input.right = 1; break; // D
    case 65: input.left  = 1; break; // A
    case 87: input.up    = 1; break; // W
    case 83: input.down  = 1; break; // S
  }

  // Ataque con tecla E (toggle)
  if (e.key && e.key.toLowerCase() === 'e') {
    attackDuck = !attackDuck;
    targetScale = attackDuck ? 0.9 : 0.3;   // 0.9 = triple de 0.3
  }
});

window.addEventListener("keyup", function(e) {
  switch (e.keyCode) {
    case 68: input.right = 0; break;
    case 65: input.left  = 0; break;
    case 87: input.up    = 0; break;
    case 83: input.down  = 0; break;
  }
});

// ----------------------------
function go2Play() {
  document.getElementById("blocker").style.display = "none";
  document.getElementById("lost").style.display = "none";
  document.getElementById("cointainerOthers").style.display = "block";

  lives = 3;
  attackDuck = false;
  targetScale = 0.3;
  currentScale = 0.3;
  document.getElementById("lives").innerHTML = lives;

  if (camera) camera.position.set(posX, posY, posZ);
  if (MovingCube) MovingCube.position.set(posX, posY, posZ);

  // Reiniciar el timer correctamente
  initialiseTimer();

  playAudio(x);
}

function initialiseTimer() {
  // Limpiar cualquier intervalo anterior para que no se dupliquen
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  var sec = 0;
  function pad(val) { return val > 9 ? val : "0" + val; }
  
  timerInterval = setInterval(function() {
    document.getElementById("seconds").innerHTML = String(pad(++sec % 60));
    document.getElementById("minutes").innerHTML = String(pad(parseInt(sec / 60, 10)));
  }, 1000);
}