import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// --- 1. SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); 
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// --- 2. BLOOM POST-PROCESSING SETUP ---
const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    1.5,  // Strength: How bright the glow is
    0.4,  // Radius: How far the glow spreads
    0.85  // Threshold: Only things brighter than this glow (perfect for stars/sun)
);

const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const outputPass = new OutputPass();
bloomComposer.addPass(outputPass);

// --- 3. CONTROLS ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
camera.position.set(0, 5, 50); 
controls.update();

// --- 4. THE STARS ---
function addStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff,
        size: 0.7 
    });

    const starVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 3000;
        const y = (Math.random() - 0.5) * 3000;
        const z = (Math.random() - 0.5) * 3000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}
addStars();

// --- 5. GALAXY BACKGROUND ---
// For the "Milky Way" look, we use a giant sphere with the texture inside
const galaxyTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular.jpg'); 
const galaxyGeometry = new THREE.SphereGeometry(2500, 64, 64);
const galaxyMaterial = new THREE.MeshBasicMaterial({
    map: galaxyTexture,
    side: THREE.BackSide, 
    transparent: true,
    opacity: 0.4
});
const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
scene.add(galaxy);

// --- 6. THE REALISTIC MOON ---
const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');
const moonNormalMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_normal.jpg');

const moonGeometry = new THREE.SphereGeometry(5, 64, 64);
const moonMaterial = new THREE.MeshStandardMaterial({ 
    map: moonTexture,
    normalMap: moonNormalMap,
    metalness: 0,
    roughness: 1 
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// --- 7. THE SHINY SUN & LIGHTING ---
const sunLight = new THREE.PointLight(0xffffff, 70000, 5000); 
sunLight.position.set(100, 50, -100); 
scene.add(sunLight);

const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.copy(sunLight.position);
scene.add(sunMesh);

const spriteMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0.png');
const spriteMaterial = new THREE.SpriteMaterial({ 
    map: spriteMap, 
    color: 0xffffff, 
    transparent: true, 
    blending: THREE.AdditiveBlending 
});
const sunSprite = new THREE.Sprite(spriteMaterial);
sunSprite.scale.set(120, 120, 1); 
sunSprite.position.copy(sunLight.position);
scene.add(sunSprite);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// --- 8. ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    if (moon) moon.rotation.y += 0.002;
    if (galaxy) galaxy.rotation.y += 0.0001;

    controls.update();
    
    // We now use bloomComposer instead of renderer
    bloomComposer.render();
}

// --- 9. UTILITIES ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
});

animate();

const starBtn = document.getElementById('add-stars');
if (starBtn) {
    starBtn.addEventListener('click', () => {
        addStars();
    });
}