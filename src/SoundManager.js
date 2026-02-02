import * as THREE from 'three';
export class SoundManager {
    constructor(cam, scene) {
        this.cam = cam; this.scene = scene;
        this.lis = new THREE.AudioListener(); cam.add(this.lis);
        this.load = new THREE.AudioLoader();
        this.d = new THREE.Audio(this.lis); this.n = new THREE.Audio(this.lis);
        this.enabled = false;
        this.init();
    }
    init() {
        this.load.load('/sounds/day_ambience.mp3', b => { this.d.setBuffer(b); this.d.setLoop(true); this.d.setVolume(0); });
        this.load.load('/sounds/night_ambience.mp3', b => { this.n.setBuffer(b); this.n.setLoop(true); this.n.setVolume(0); });
    }
    enableAudio() {
        if(this.enabled) return;
        if(this.lis.context.state === 'suspended') this.lis.context.resume();
        this.enabled = true; this.d.play(); this.n.play();
    }
    update(time) {
        if(!this.enabled) return;
        const isDay = time > 6 && time < 18;
        this.d.setVolume(THREE.MathUtils.lerp(this.d.getVolume(), isDay?0.5:0, 0.05));
        this.n.setVolume(THREE.MathUtils.lerp(this.n.getVolume(), isDay?0:0.5, 0.05));
    }
    createPositionalSound(mesh, path, dist) {
        const s = new THREE.PositionalAudio(this.lis);
        this.load.load(path, b => { s.setBuffer(b); s.setRefDistance(dist); s.setLoop(true); s.setVolume(0.8); if(this.enabled) s.play(); });
        mesh.add(s);
    }
}
