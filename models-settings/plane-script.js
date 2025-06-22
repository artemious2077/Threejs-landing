// import library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";
let mixer;
let plane;

// set up camera
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 13;

// set up scene for 3D model
const scene = new THREE.Scene();

const loader = new GLTFLoader();
loader.load(
  "../3D-models/ww1_plane_stylized_-_felixstowe_f.2a.glb",
  function (gltf) {
    plane = gltf.scene;
    plane.position.y = -1;
    plane.position.x = -2;
    plane.rotation.y = 2.2;
    scene.add(plane);

    console.log(gltf.animations);
    mixer = new THREE.AnimationMixer(plane);
    mixer.clipAction(gltf.animations[0]).play();
  },
  function (xhr) {},
  function (err) {}
);

// our render
const render = new THREE.WebGLRenderer({ alpha: true });

render.setSize(window.innerWidth, window.innerHeight);
// appendChild - add child element
document.getElementById("container3D").appendChild(render.domElement);

// 3d render
const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  render.render(scene, camera);
  if (mixer) mixer.update(0.01);
};
reRender3D();

// add light
// our color setting only c++ HEX style
const ambientLight = new THREE.AmbientLight(0x007f85ff, 0.9);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xfffffff, 1);
topLight.position.set(0, 500, 500);
scene.add(topLight);

// cords array
let arrPosModel = [
  {
    id: "banner",
    position: { x: -11, y: -1, z: 4 },
    rotation: { x: 0, y: 1.5, z: 0 },
  },
  {
    id: "intro",
    position: { x: 1, y: -1, z: -5 },
    rotation: { x: 3, y: -3, z: 0.2 },
  },
  {
    id: "description",
    position: { x: 5, y: -1, z: -22 },
    rotation: { x: 5.6, y: 0.5, z: 0 },
  },
  {
    id: "contact",
    position: { x: -40, y: -30, z: -0.1 },
    rotation: { x: 20, y: -0.5, z: 0 },
  },
];

const modelMove = () => {
  const DOMsections = document.querySelectorAll(".section");

  let currentSection;
  DOMsections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });

  let activePos = arrPosModel.findIndex((value) => value.id == currentSection);
  if (activePos >= 0) {
    let newCord = arrPosModel[activePos];

    gsap.to(plane.position, {
      x: newCord.position.x,
      y: newCord.position.y,
      z: newCord.position.z,
      duration: 3,
      ease: "power1.out",
    });
    gsap.to(plane.rotation, {
      x: newCord.rotation.x,
      y: newCord.rotation.y,
      z: newCord.rotation.z,
      duration: 3,
      ease: "power1.out",
    });
  }
};

// activation cords animation on scrolling
window.addEventListener("scroll", () => {
  if (plane) modelMove();
});

// window & 3D model resize
window.addEventListener("resize", () => {
  // setSize apply next parameters - (width, height) not vice versa
  render.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
