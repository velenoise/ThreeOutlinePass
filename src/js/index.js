var THREE = require('three');
var EffectComposer = require('three-effectcomposer')(THREE);

//var OutlineShader = require('./shaders/outline-shader');
var OutlinePass = require('./passes/outline-pass');

var scene, renderer, camera, light, model, material, composer;

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.clearColor = 0xffffff;
renderer.clearAlpha = 1;    
renderer.autoClear = true;
document.body.appendChild(renderer.domElement);

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;
camera.position.y = 1;
camera.lookAt(new THREE.Vector3());
scene.add(camera);

light = new THREE.HemisphereLight(0xc1eeff, 0x000000, 0.75);
light.position.y = 5;
scene.add(light);

material = new THREE.MeshLambertMaterial({ color: 0xffffff });

var l = new THREE.JSONLoader();
l.load('./model/monkey.json', function (geo) {
    model = new THREE.Mesh(geo, material);
    model.position.set(0, 0, 0);
    scene.add(model);
});

composer = new EffectComposer(renderer);

var renderPass = new EffectComposer.RenderPass(scene, camera);
/*
var copyPass = new EffectComposer.ShaderPass(EffectComposer.CopyShader);
copyPass.renderToScreen = true;
*/

var outlinePass = new OutlinePass(scene, camera, { outlineColor: 0xffffff });
outlinePass.renderToScreen = true;

composer.addPass(renderPass);
composer.addPass(outlinePass);

/*var outlineUniforms = {
        'outlineColor': { type: 'c', value: new THREE.Color(0x000000) },
        'amount': { type: 'f', value: 1 }
    };

outlineUniforms['outlineColor'].value = new THREE.Color(0xffffff);
outlineUniforms['amount'].value = 1;

var outlineMaterial = new THREE.ShaderMaterial({
    uniforms: outlineUniforms,
    fragmentShader: OutlineShader.fragmentShader,
    vertexShader: OutlineShader.vertexShader
});
outlineMaterial.side = THREE.BackSide;*/

function render()
{
    if (model) model.rotation.y += 0.01;
    
    renderer.clear();
    
    composer.render();
    /*scene.overrideMaterial = outlineMaterial;
    renderer.render(scene, camera);
    
    scene.overrideMaterial = null;
    renderer.render(scene, camera);*/
    
    requestAnimationFrame(render);
}

render();

window.addEventListener('resize', onResize);

function onResize()
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}