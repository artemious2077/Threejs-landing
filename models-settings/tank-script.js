//  MODEL HAVE A PROBLEM WITH RESIZE & DISPLAY
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
let tank;

// camera set up
const camera = new THREE.PerspectiveCamera (
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 10;

// uploading 3D model and set positions
const viewport = new THREE.Scene();

const modelLoader = new GLTFLoader();
modelLoader.load(
    "../3D-models/tank_ww1_-_new_textures.glb",
    function(pos) {
        tank = pos.scene,
        tank.position.y = -1
        tank.position.x = 6;
        tank.rotation.y = -12.7;
        tank.scale.set(18, 18, 18);
        viewport.add(tank)
        // tank dont have animations
    }
)

// model render
const render = new THREE.WebGLRenderer({alpha: true});
render.setSize(window.innerWidth, window.innerHeight);
document.getElementById("tank3D").appendChild(render.domElement)

// 3D render
const render3D = () => {
    requestAnimationFrame(render3D);
    render.render(viewport, camera);
};
render3D();

// scene light
const ambientLight = new THREE.AmbientLight(0x007f85ff, 0.3);
viewport.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xfffffff, 2.5);
viewport.add(topLight);

// window & 3D model resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / Window.innerHeight,
    camera.updateProjectionMatrix();
    render.setSize(window.innerWidth, window.innerHeight);
})