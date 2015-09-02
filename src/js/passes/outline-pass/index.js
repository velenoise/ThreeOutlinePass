var THREE = require('three');
var glslify = require('glslify');

var OutlineShader = {
    uniforms: {
        'outlineColor': { type: 'c', value: new THREE.Color(0x000000) },
        'amount': { type: 'f', value: 1 }
    },
    vertexShader: glslify('../../../shaders/outline-vert.glsl'),
    fragmentShader: glslify('../../../shaders/outline-frag.glsl')
};

var OutlinePass = function (scene, camera, params)
{
    this.scene = scene;
    this.camera = camera;
    
    this.outlineColor = params.outlineColor ? new THREE.Color(params.outlineColor) : new THREE.Color(0x000000);
    this.amount = params.amount || 1;
    
    var width = params.width || window.innerWidth || 1;
	var height = params.height || window.innerHeight || 1;
    
    this.renderTargetColor = new THREE.WebGLRenderTarget( width, height, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat
	} );
    
    var outlineShader = OutlineShader;
    var outlineUniforms = THREE.UniformsUtils.clone(outlineShader.uniforms);
    
    outlineUniforms['outlineColor'].value = this.outlineColor;
    outlineUniforms['amount'].value = this.amount;
    
    this.outlineMaterial = new THREE.ShaderMaterial({
        uniforms: outlineUniforms,
        vertexShader: outlineShader.vertexShader,
        fragmentShader: outlineShader.fragmentShader
    });
    this.outlineMaterial.side = THREE.BackSide;
    
    this.outputMaterial = new THREE.MeshBasicMaterial({
        map: this.renderTargetColor
    });
    
    this.uniforms = outlineUniforms;
    this.enabled = true;
    this.needsSwap = false;
    this.renderToScreen = false;
    this.clear = false;
    
    this.camera2 = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
	this.scene2  = new THREE.Scene();

	this.quad2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), this.outputMaterial );
    this.scene2.add( this.quad2 );
};

OutlinePass.prototype.render = function (renderer, writeBuffer, readBuffer, delta, maskActive)
{
    this.scene.overrideMaterial = this.outlineMaterial;
    
    var autoClear = renderer.autoClear;
    renderer.autoClear = false;
    
    renderer.clear();
    renderer.clearTarget(this.renderTargetColor, renderer.clearColor);
    
    this.scene.overrideMaterial = this.outlineMaterial;
    renderer.render(this.scene, this.camera, this.renderTargetColor);
    
    this.scene.overrideMaterial = null;
    renderer.render(this.scene, this.camera, this.renderTargetColor);
    
    if ( this.renderToScreen ) 
    {
        renderer.render( this.scene2, this.camera2 );
    } 
    else 
    {
        renderer.render( this.scene2, this.camera2, writeBuffer, this.clear );
    }
    
    //renderer.clear();
    renderer.autoClear = autoClear;
};

module.exports = OutlinePass;