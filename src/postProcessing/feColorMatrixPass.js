import CustomShaderPass from './CustomShaderPass';
import feVert from '../shaders/feColorMatrix/vert.glsl';
import feFrag from '../shaders/feColorMatrix/frag.glsl';

//prettier-ignore
const feColorMatrixBlur = [
    1, 0, 0, 0, 0, 
    0, 1, 0, 0, 0,  
    0, 0, 1, 0, 0,  
    0, 0, 0, 19, -9
];

const feColorMatrixMaterial = new THREE.ShaderMaterial({
    vertexShader: feVert,
    fragmentShader: feFrag,
    uniforms: {
        uResolution: {
            type: 'v2',
            value: new THREE.Vector2()
        },
        uPassTexture: {
            type: 't',
            value: new THREE.Texture()
        },
        uMatrix: {
            type: 'm4',
            value: new THREE.Matrix4()
        },
        uMatrixMultiplier: {
            type: 'v4',
            value: new THREE.Vector4()
        }
    }
});

//prettier-ignore
feColorMatrixMaterial.uniforms.uMatrixMultiplier.value.x = blurFeMatrix.splice(3, 1)[0];
//prettier-ignore
feColorMatrixMaterial.uniforms.uMatrixMultiplier.value.y = blurFeMatrix.splice(8, 1)[0];
//prettier-ignore
feColorMatrixMaterial.uniforms.uMatrixMultiplier.value.z = blurFeMatrix.splice(12, 1)[0];
//prettier-ignore
feColorMatrixMaterial.uniforms.uMatrixMultiplier.value.w = blurFeMatrix.splice(16, 1)[0];
feColorMatrixMaterial.uniforms.uMatrix.value.set(...blurFeMatrix);

const feColorMatrixPass = new CustomShaderPass(blurPassMaterial);

export default feColorMatrixPass;
