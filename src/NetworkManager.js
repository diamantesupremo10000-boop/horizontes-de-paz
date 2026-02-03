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
        // Fix para desarrollo
        if (host.includes(':5173')) host = window.location.hostname + ':3000';
        
        this.ws = new WebSocket(`${proto}://${host}`);
        this.ws.onmessage = (e) => this.handle(JSON.parse(e.data));
        this.ws.onclose = () => setTimeout(() => this.connect(), 5000);
    }

    handle(data) {
        if (data.type === 'init') { 
            this.id = data.id; 
            data.players.forEach(([id, p]) => { if(id !== this.id) this.spawn(id, p); }); 
        }
        if (data.type === 'player-joined' && data.id !== this.id) this.spawn(data.id, data);
        if (data.type === 'player-moved') this.updateTarget(data.id, data); // <--- CAMBIO: UpdateTarget
        if (data.type === 'player-left') this.remove(data.id);
    }

    spawn(id, data) {
        const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 1), new THREE.MeshStandardMaterial({color: data.color}));
        m.position.set(data.x, data.y, data.z);
        
        // Halo simple
        const h = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 8, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
        h.rotation.x = -Math.PI/2; h.position.y = 1.2; m.add(h);
        
        // Guardamos datos extra para interpolación
        m.userData = { 
            targetPos: new THREE.Vector3(data.x, data.y, data.z), 
            velocity: new THREE.Vector3() 
        };
        
        this.scene.add(m); 
        this.otherPlayers.set(id, m);
    }

    // En lugar de mover, solo actualizamos el destino
    updateTarget(id, data) { 
        const p = this.otherPlayers.get(id); 
        if(p) {
            p.userData.targetPos.set(data.x, data.y, data.z);
        }
    }

    remove(id) { 
        const p = this.otherPlayers.get(id); 
        if(p) { this.scene.remove(p); this.otherPlayers.delete(id); } 
    }

    sendPosition(pos) { 
        if(this.ws && this.ws.readyState === 1) {
            // Limitamos envíos para no saturar (throttling básico implicito por loop del juego, 
            // pero idealmente debería ser cada 100ms)
            this.ws.send(JSON.stringify({type: 'move', x: pos.x, y: pos.y, z: pos.z})); 
        }
    }

    // --- NUEVO MÉTODO: Update Loop ---
    update(dt) {
        this.otherPlayers.forEach(player => {
            // Lerp (Linear Interpolation): Mueve la posición actual hacia el objetivo un 10% cada frame ajustado por delta time
            // El factor 10 * dt da un movimiento suave pero rápido.
            player.position.lerp(player.userData.targetPos, 10 * dt);
            
            // Opcional: Calcular rotación para mirar hacia donde se mueve
            const dist = player.position.distanceTo(player.userData.targetPos);
            if (dist > 0.1) {
                const angle = Math.atan2(
                    player.userData.targetPos.x - player.position.x, 
                    player.userData.targetPos.z - player.position.z
                );
                // Rotación suave del cuerpo
                const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), angle);
                player.quaternion.slerp(targetQuat, 10 * dt);
            }
        });
    }
}
