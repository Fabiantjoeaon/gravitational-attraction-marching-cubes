precision mediump float;

uniform vec2 uResolution;
uniform sampler2D uPassTexture;
uniform mat4 uMatrix;
uniform vec4 uMatrixMultiplier;

void main () {
  vec2 uv = vec2(gl_FragCoord.xy / uResolution.xy);
  vec4 texel = texture2D(uPassTexture, uv);
  vec4 color = texel;
  
  mat4 colMat = mat4(
    color.r, 0, 0, 0,
    0, color.g, 0, 0,
    0, 0, color.b, 0,
    0, 0, 0, color.a
  );
  mat4 product = colMat * uMatrix;
  color.r = product[0].x + product[0].y + product[0].z + product[0].w + uMatrixMultiplier[0];
  color.g = product[1].x + product[1].y + product[1].z + product[1].w + uMatrixMultiplier[1];
  color.b = product[2].x + product[2].y + product[2].z + product[2].w + uMatrixMultiplier[2];
  color.a = product[3].x + product[3].y + product[3].z + product[3].w  + uMatrixMultiplier[3];
  gl_FragColor = color;
}