import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { Player } from './Player.js';
import { Companion } from './Companion.js';
import { World } from './World.js';
import { Input } from './Input.js';
import { CameraController } from './CameraController.js';
import { SoundManager } from './SoundManager.js';
import { NetworkManager } from './NetworkManager.js';
import { RestorationManager } from './RestorationManager.js';
import { DayNightSystem } from './DayNightSystem.js';
import { EcoSystem } from './EcoSystem.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.clock = new THREE.Clock();
        
        // Escena y Renderer
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x202025);
        this.scene.fog = new THREE.FogExp2(0x202025, 0.015);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // Sistemas Base
        this.cameraController = new CameraController(this.camera);
        this.input = new Input();
        this.soundManager = new SoundManager(this.camera, this.scene);
        this.networkManager = new NetworkManager(this.scene);

        // Entidades
        this.player = new Player(this.scene);
        this.companion = new Companion(this.scene, this.player.container);

        // Mundo y Lógica
        this.ecoSystem = new EcoSystem(this.scene, this.player.container);
        this.world = new World(this.scene, this.ecoSystem, this.soundManager);
        this.dayNight = new DayNightSystem(this.scene, this.world);
        this.restorationManager = new RestorationManager(this.player, this.world);
        
        // Inicialización extra
        this.ecoSystem.attachSounds(this.soundManager);
        this.restorationManager.updateUniforms();

        // Post-Processing (Bloom)
        const renderScene = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.strength = 0.5; 
        bloomPass.radius = 0.4;
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);

        this.setupAudioUnlock();
        window.addEventListener('resize', () => this.onWindowResize(), false);
        this.animate();
    }

    setupAudioUnlock() {
        const unlock = () => {
            this.soundManager.enableAudio();
            ['click','touchstart','keydown'].forEach(e => window.removeEventListener(e, unlock));
        };
        ['click','touchstart','keydown'].forEach(e => window.addEventListener(e, unlock));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const dt = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        if (this.input.keys.action) {
            this.restorationManager.triggerRestoration();
            this.player.triggerRestoration();
        }

        this.player.update(dt, this.input, this.cameraController);
        this.companion.update(time, dt);

        const lookDelta = this.input.getLookDelta();
        const target = this.player.getPosition().clone().add(new THREE.Vector3(0, 1.4, 0));
        this.cameraController.update(target, lookDelta);

        this.dayNight.update(dt, this.world.skyDome);
        this.world.update(dt, time, this.player.getPosition());
        this.soundManager.update(this.dayNight.time);
        this.ecoSystem.update(time, this.input);
        
        this.networkManager.sendPosition(this.player.getPosition());
        
        this.composer.render();
    }
}
