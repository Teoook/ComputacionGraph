import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// el mejor texto con canvas
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

canvas.width = 512;
canvas.height = 256;

context.fillStyle = "white";
context.font = "bold 60px Arial";
context.textAlign = "center";
context.fillText("Mera casota", canvas.width / 2, 150);

// Convertir eso a textura
const texture = new THREE.CanvasTexture(canvas);
const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
const sprite = new THREE.Sprite(spriteMaterial);

// Tamaño del mero texto
sprite.scale.set(4, 2, 1);

// ubicacion debajo de la casota
sprite.position.set(0, -0.5, 0);

scene.add(sprite);

// Cuadrícula
const grid = new THREE.GridHelper(
    20,   // tamaño total
    20,   // divisiones
    0x000000, // color líneas centro
    0x888888  // color líneas las otras
);

scene.add(grid);

// Camara (corregir parte camara)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 3, 6);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles mouse
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Grupo casa
const house = new THREE.Group();

// Casa en orden

const base = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial({ color: 0x8B4513 })
);
base.position.y = 1;
house.add(base);


const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.5, 1, 4),
    new THREE.MeshBasicMaterial({ color: 0xAA0000 })
);
roof.position.y = 2.5;
roof.rotation.y = Math.PI / 4;
house.add(roof);


const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 1, 0.1),
    new THREE.MeshBasicMaterial({ color: 0x3E2723 })
);
door.position.set(0, 0.5, 1.05);
house.add(door);

scene.add(house);

// Animado
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();