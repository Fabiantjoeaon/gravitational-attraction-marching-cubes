import '../scss/index.scss';
import { Color, Scene, PerspectiveCamera, WebGLRenderer, Clock } from 'three';

const scene = new Scene();
const camera = new PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
);
camera.position.set(0, 0, 20);
camera.rotation.order = 'YXZ';
camera.updateProjectionMatrix();

const renderer = new WebGLRenderer();
const clock = new Clock();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new Color('#000'));

document.querySelector('#root').appendChild(renderer.domElement);

export { scene, renderer, clock, camera };
