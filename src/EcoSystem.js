import * as THREE from 'three';

export class EcoSystem {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.points = [];
        this.modal = document.getElementById('eco-modal');
        // Verificar que el elemento exista antes de asignar el evento
        if (document.getElementById('close-eco')) {
            document.getElementById('close-eco').onclick = () => this.modal.classList.add('hidden');
        }
    }

    attachSounds(sm) { this.sm = sm; }

    addPoint(pos, title, text) {
        // --- CORRECCIÓN AQUÍ ---
        // Usamos MeshStandardMaterial en lugar de Basic, y quitamos wireframe.
        // Añadimos emissive para que brille.
        const geo = new THREE.SphereGeometry(0.5, 32, 32); // Más segmentos para que sea una esfera suave
        const mat = new THREE.MeshStandardMaterial({
            color: 0xffeb3b,         // Color base amarillo
            emissive: 0xffeb3b,      // Color de emisión (brillo propio)
            emissiveIntensity: 0.6,  // Intensidad del brillo
            roughness: 0.3,          // Un poco brillante
            metalness: 0.2           // Ligeramente metálico
        });
        
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(pos);
        mesh.position.y = 1;
        mesh.castShadow = true; // Que proyecte sombra
        // -----------------------

        mesh.userData = { title, text, oy: 1, off: Math.random() * 100 };
        this.scene.add(mesh);
        this.points.push(mesh);
        
        if (this.sm) this.sm.createPositionalSound(mesh, '/sounds/eco_hum.mp3', 3);
    }

    update(time, input) {
        let close = null;
        this.points.forEach(p => {
            // Animación de flotación suave
            p.position.y = p.userData.oy + Math.sin(time * 2 + p.userData.off) * 0.2;
            p.rotation.y += 0.02;
            
            if (this.player.position.distanceTo(p.position) < 3) close = p;
        });

        if (close && input.keys.action) {
            const titleEl = document.getElementById('eco-title');
            const textEl = document.getElementById('eco-text');
            if (titleEl && textEl) {
                 titleEl.innerText = close.userData.title;
                 textEl.innerText = close.userData.text;
                 this.modal.classList.remove('hidden');
            }
        }
    }
}
