import * as THREE from 'three';
import {
    EffectComposer,
    GlitchPass,
    RenderPass,
    ShaderPass
} from 'postprocessing';
import CustomShaderPass from './postProcessing/CustomShaderPass';
import { renderer, camera, scene, clock } from './setup';

import './helpers/range';
import getRandomArbitrary from './helpers/getRandomArbitrary';
import blurVert from './shaders/blur/vert.glsl';
import sphereVert from './shaders/sphere/vert.glsl';
import blurFrag from './shaders/blur/frag.glsl';
import sphereFrag from './shaders/sphere/frag.glsl';

import Mover from './sketch/mover';
import Attractor from './sketch/attractor';
import './sketch/marchingCubes';

const start = Date.now();

const moverCount = 4;
const movers = [];

let counter = 0;
let shouldIncrement = true;
const noiseIncrementalSpeed = 0.01;
const noiseIncrementalMax = 55;
const noiseIncrementalMin = 1;

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(0, 0, 100);
scene.add(directionalLight);
const pointLight1 = new THREE.PointLight(new THREE.Color('#fff'), 10, 10);
pointLight1.position.set(20, 50, 40);
scene.add(pointLight1);

const attractor = new Attractor({
    initialPos: {
        x: 0.5,
        y: 0.55,
        z: 0.5
    },
    mass: 0.0001,
    gravConst: 0.03
});
[...moverCount].forEach(i =>
    movers.push(
        new Mover({
            initialPos: {
                x: getRandomArbitrary(0.0, 0.7),
                y: getRandomArbitrary(0.0, 0.9),
                z: getRandomArbitrary(0.0, 0.9)
            },
            mass: 0.001,
            acc: new THREE.Vector3(
                getRandomArbitrary(0.0, 0.005),
                getRandomArbitrary(0.0, 0.005),
                getRandomArbitrary(0.0, 0.005)
            ),
            vel: new THREE.Vector3(
                getRandomArbitrary(0.0, 0.005),
                getRandomArbitrary(0.0, 0.005),
                getRandomArbitrary(0.0, 0.005)
            )
        })
    )
);

function updateCubes(object, time, floor, wallx, wallz) {}

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
const blurPass = new CustomShaderPass(
    new THREE.ShaderMaterial({
        vertexShader: blurVert,
        fragmentShader: blurFrag,
        uniforms: {
            uResolution: {
                value: new THREE.Vector2(0, 0)
            },
            uPassTexture: {
                value: 0
            }
        }
    })
);
// blurPass.renderToScreen = true;
renderPass.renderToScreen = true;
composer.addPass(renderPass);
// composer.addPass(blurPass);

const resolution = 80;
const field = new THREE.MarchingCubes(
    resolution,
    new THREE.ShaderMaterial({
        vertexShader: sphereVert,
        fragmentShader: sphereFrag,
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            {
                uIncremental: {
                    type: 'f',
                    value: 1.0
                },
                uResolution: {
                    value: new THREE.Vector2()
                },
                uDiffuse: {
                    type: 'c',
                    value: new THREE.Color('#00ffff')
                }
            }
        ]),
        lights: true
    }),
    // new THREE.MeshNormalMaterial(),
    true,
    true
);
field.position.set(10, -600, -3200);
field.scale.set(3000, 2000, 2200);
field.material.uniforms.uResolution.value.x = window.innerWidth;
field.material.uniforms.uResolution.value.y = window.innerHeight;
field.enableUvs = true;
field.enableColors = true;
scene.add(field);

let time = 0;

const render = () => {
    const delta = clock.getDelta();
    time += delta * 0.5 * 1.0;

    field.reset();

    const subtract = 12;
    const strength = 1.2 / ((Math.sqrt(moverCount + 1) - 1) / 4 + 1);

    const { x: atrX, y: atrY, z: atrZ } = attractor.getPosition();
    field.addBall(atrX, atrY, atrZ, strength, subtract);

    movers.forEach(mover => {
        const force = attractor.attract(mover);
        mover.applyForce(force);
        const { x, y, z } = mover.getPosition();
        field.addBall(x, y, z, strength, subtract);
    });

    field.addPlaneY(200, 1200);
    // field.addPlaneZ(2, 12);
    // field.addPlaneX(2, 12);
    // if (wallz)
    // if (wallx)

    field.material.uniforms.uIncremental.value = counter;

    // field.material.uniforms.uDiffuse.value = new THREE.Color(
    //     getRandomArbitrary(0, time),
    //     getRandomArbitrary(0, time),
    //     getRandomArbitrary(0, time)
    // );
    // console.log(field.material.uniforms.uDiffuse.value);

    counter = shouldIncrement
        ? (counter += noiseIncrementalSpeed)
        : (counter -= noiseIncrementalSpeed);

    if (counter > noiseIncrementalMax) shouldIncrement = false;
    if (counter < noiseIncrementalMin) shouldIncrement = true;

    field.material.needsUpdate = true;

    pointLight1.position.set(
        Math.sin(time * 9) * 30,
        Math.cos(time * 9) * 40,
        Math.cos(time * 9) * 30
    );

    // camera.lookAt(field);

    composer.render(time);
};

const animate = () => {
    requestAnimationFrame(animate);
    render();
};
animate();

window.scene = scene;
window.THREE = THREE;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
