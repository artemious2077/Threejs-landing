import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
let mixer;
let cannon;

// camera set up
const camera = new THREE.PerspectiveCamera(
    24,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 13;

// uploading 3D model and set positions
const viewport = new THREE.Scene();

const modelLoader = new GLTFLoader();
modelLoader.load(
    "../3D-models/flak37.glb",
    function(pos) {
        // set up cords
        cannon = pos.scene,
        cannon.position.y = -2.55
        cannon.position.x = -3.7;
        cannon.rotation.y = 1.2;
        viewport.add(cannon);

        console.log(pos.animations);
        // uploading animations for activate & diplay
        if (pos.animations.length > 0) {
            mixer = new THREE.AnimationMixer(cannon);
            
            const selectedClips = [
                pos.animations[1],
                pos.animations[0],
                pos.animations[2],
                // 3 animation crushed all, because I used currently anumations array
            ]

            selectedClips.forEach((clip) => {
                const action = mixer.clipAction(clip);
                action.enabled = true;
                action.reset().play();
            })
        }
    }
)

// model render
const render = new THREE.WebGLRenderer({alpha: true});
render.setSize(window.innerWidth, window.innerHeight);
document.getElementById("cannon3D").appendChild(render.domElement);

// 3D render
const render3D = () => {
    requestAnimationFrame(render3D);
    render.render(viewport, camera);
    // set up animation speed
    if (mixer) mixer.update(0.014);
};
render3D();

// scene light
const ambientLight = new THREE.AmbientLight(0x007f85ff, 0.3);
viewport.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xfffffff, 2.5);
topLight.position.set(0, 500, 500);
viewport.add(topLight);

// ---

// window & 3D model resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // update rendering on the resized user window
    render.setSize(window.innerWidth, window.innerHeight);
})