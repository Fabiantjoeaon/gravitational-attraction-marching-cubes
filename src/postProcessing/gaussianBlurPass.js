import CustomShaderPass from './CustomShaderPass';
import blurVert from '../shaders/blur/vert.glsl';
import blurFrag from '../shaders/blur/frag.glsl';

const blurPassMaterial = new THREE.ShaderMaterial({
    vertexShader: blurVert,
    fragmentShader: blurFrag,
    uniforms: {
        uResolution: {
            type: 'v2',
            value: new THREE.Vector2()
        },
        uPassTexture: {
            type: 't',
            value: new THREE.Texture()
        },
        uBlurDir: {
            type: 'v2',
            value: new THREE.Vector2(1, 1)
        }
    }
});

const blurShaderPass = new CustomShaderPass(blurPassMaterial);

export default blurShaderPass;
