#pragma glslify: snoise = require('glsl-noise/simplex/3d')

varying float noise;
varying vec2 vUv;

uniform vec3 uDiffuse;
uniform float uIncremental;
uniform vec2 uResolution;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vDiffPos;

struct PointLight {
  vec3 position;
  vec3 color;
};
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    float x = vDiffPos.x;
    float y = vDiffPos.y;
    float z = vDiffPos.z;
    
    vec3 noiseColor = vec3(snoise(vec3(x * uIncremental, y * uIncremental, z * uIncremental)));
    vec4 final = vec4(noiseColor, 1.);

    vec4 addedLights = vec4(0.1, 0.1, 0.1, 1.0);
    for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
        vec3 adjustedLight = pointLights[l].position + cameraPosition;
        vec3 lightDirection = normalize(vViewPosition - adjustedLight);
        addedLights.rgb += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights[l].color;
    }
    final *= mix(vec4(uDiffuse.x, uDiffuse.y, uDiffuse.z, 1.0), addedLights, addedLights);

    gl_FragColor = final;
    
}