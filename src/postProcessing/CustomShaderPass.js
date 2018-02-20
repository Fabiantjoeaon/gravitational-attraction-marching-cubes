import { Pass } from 'postprocessing';

export default class CustomShaderPass extends Pass {
    constructor(material) {
        super();
        this.needsSwap = true;
        this.material = material;
        this.name = 'blurPass';
        this.quad.material = this.material;
    }

    render(renderer, readBuffer, writeBuffer) {
        this.material.uniforms.uResolution.value.x = readBuffer.width;
        this.material.uniforms.uResolution.value.y = readBuffer.height;
        this.material.uniforms.uPassTexture.value = readBuffer.texture;
        renderer.render(
            this.scene,
            this.camera,
            this.renderToScreen ? null : writeBuffer
        );
    }
}
