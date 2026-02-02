import * as THREE from 'three';
export class EcoSystem {
    constructor(scene, player) {
        this.scene = scene; this.player = player; this.points = [];
        this.modal = document.getElementById('eco-modal');
        document.getElementById('close-eco').onclick = () => this.modal.classList.add('hidden');
    }
    attachSounds(sm) { this.sm = sm; }
    addPoint(pos, title, text) {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshBasicMaterial({color:0xffeb3b, wireframe:true}));
        mesh.position.copy(pos); mesh.position.y=1;
        mesh.userData = { title, text, oy:1, off:Math.random()*100 };
        this.scene.add(mesh); this.points.push(mesh);
        if(this.sm) this.sm.createPositionalSound(mesh, '/sounds/eco_hum.mp3', 3);
    }
    update(time, input) {
        let close = null;
        this.points.forEach(p => {
            p.position.y = p.userData.oy + Math.sin(time*2+p.userData.off)*0.2; p.rotation.y += 0.02;
            if(this.player.position.distanceTo(p.position) < 3) close = p;
        });
        if(close && input.keys.action) {
            document.getElementById('eco-title').innerText = close.userData.title;
            document.getElementById('eco-text').innerText = close.userData.text;
            this.modal.classList.remove('hidden');
        }
    }
}
