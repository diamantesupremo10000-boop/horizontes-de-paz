import * as THREE from 'three';

export class NetworkManager {
    constructor(scene) {
        this.scene = scene;
        this.otherPlayers = new Map();
        this.connect();
    }

    connect() {
        const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
        let host = window.location.host;
        
        // Fix para desarrollo: Si estamos en Vite (5173), forzar puerto 3000
        if (host.includes(':5173')) host = window.location.hostname + ':3000';
        
        this.ws = new WebSocket(`${proto}://${host}`);
        
        this.ws.onopen = () => {
            console.log("Conectado al servidor multijugador");
        };

        this.ws.onmessage = (e) => this.handle(JSON.parse(e.data));
        
        this.ws.onclose = () => {
            console.log("Desconectado. Reintentando en 5s...");
            setTimeout(() => this.connect(), 5000);
        };
    }

    handle(data) {
        if (data.type === 'init') { 
            this.id = data.id; 
            data.players.forEach(([id, p]) => { 
                if(id !== this.id) this.spawn(id, p); 
            }); 
        }
        
        if (data.type === 'player-joined' && data.id !== this.id) {
            this.spawn(data.id, data);
        }
        
        if (data.type === 'player-moved') {
            this.updateTarget(data.id, data);
        }
        
        if (data.type === 'player-left') {
            this.remove(data.id);
        }
    }

    spawn(id, data) {
        // Modelo del otro jugador
        const geometry = new THREE.CapsuleGeometry(0.4, 1, 4, 8);
        const material = new THREE.MeshStandardMaterial({ color: data.color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(data.x, data.y, data.z);
        mesh.castShadow = true;
        
        // Halo simple visual
        const haloGeo = new THREE.TorusGeometry(0.3, 0.02, 8, 16);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = -Math.PI / 2; 
        halo.position.y = 1.2; 
        mesh.add(halo);
        
        // --- DATOS PARA INTERPOLACIÓN ---
        mesh.userData = { 
            targetPos: new THREE.Vector3(data.x, data.y, data.z),
            velocity: new THREE.Vector3() 
        };
        
        this.scene.add(mesh); 
        this.otherPlayers.set(id, mesh);
    }

    // Actualizamos el destino, no la posición directa
    updateTarget(id, data) { 
        const p = this.otherPlayers.get(id); 
        if(p) {
            p.userData.targetPos.set(data.x, data.y, data.z);
        }
    }

    remove(id) { 
        const p = this.otherPlayers.get(id); 
        if(p) { 
            this.scene.remove(p); 
            this.otherPlayers.delete(id); 
        } 
    }

    sendPosition(pos) { 
        if(this.ws && this.ws.readyState === 1) {
            this.ws.send(JSON.stringify({
                type: 'move', 
                x: pos.x, 
                y: pos.y, 
                z: pos.z
            })); 
        }
    }

    // --- BUCLE DE ACTUALIZACIÓN (Suavizado) ---
    update(dt) {
        this.otherPlayers.forEach(player => {
            // Mover suavemente hacia el objetivo (Lerp)
            // Factor 10 * dt proporciona una respuesta rápida pero fluida
            player.position.lerp(player.userData.targetPos, 10 * dt);
            
            // Rotar suavemente hacia la dirección de movimiento
            const dist = player.position.distanceTo(player.userData.targetPos);
            if (dist > 0.1) {
                const angle = Math.atan2(
                    player.userData.targetPos.x - player.position.x, 
                    player.userData.targetPos.z - player.position.z
                );
                const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), angle);
                player.quaternion.slerp(targetQuat, 10 * dt);
            }
        });
    }
}
