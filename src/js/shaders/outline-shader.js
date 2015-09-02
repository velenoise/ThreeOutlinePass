var THREE = require('three');
var glslify = require('glslify');

module.exports = {
    uniforms: {
        'outlineColor': { type: 'c', value: new THREE.Color(0x000000) },
        'amount': { type: 'f', value: 1 }
    },
    vertexShader: glslify('../../shaders/outline-vert.glsl'),
    fragmentShader: glslify('../../shaders/outline-frag.glsl')
};