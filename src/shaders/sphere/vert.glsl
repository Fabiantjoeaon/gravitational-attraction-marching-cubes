varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vDiffPos;

void main() {
  vDiffPos = position;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vViewPosition = -mvPosition.xyz;
  vNormal = normalize( normalMatrix * normal );
  gl_Position = projectionMatrix * mvPosition;
}