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
        
        // Fix para desarrollo: Si estamos en Vite (5173), usar puerto 3000
        if (host.includes(':5173')) host = window.location.hostname + ':3000';
        
        this.ws = new WebSocket(`${proto}://${host}`);
        this.ws.onmessage = (e) => this.handle(JSON.parse(e.data));
        this.ws.onclose = () => setTimeout(() => this.connect(), 5000);
    }
    handle(data) {
        if (data.type === 'init') { 
            this.id = data.id; 
            data.players.forEach(([id, p]) => { if(id!==this.id) this.spawn(id, p); }); 
        }
        if (data.type === 'player-joined' && data.id !== this.id) this.spawn(data.id, data);
        if (data.type === 'player-moved') this.move(data.id, data);
        if (data.type === 'player-left') this.remove(data.id);
    }
    spawn(id, data) {
        const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.4,1), new THREE.MeshStandardMaterial({color: data.color}));
        m.position.set(data.x, data.y, data.z);
        // Halo simple
        const h = new THREE.Mesh(new THREE.TorusGeometry(0.3,0.02,8,16), new THREE.MeshBasicMaterial({color:0xffffff}));
        h.rotation.x = -Math.PI/2; h.position.y = 1.2; m.add(h);
        this.scene.add(m); this.otherPlayers.set(id, m);
    }
    move(id, data) { const p = this.otherPlayers.get(id); if(p) p.position.set(data.x, data.y, data.z); }
    remove(id) { const p = this.otherPlayers.get(id); if(p) { this.scene.remove(p); this.otherPlayers.delete(id); } }
    sendPosition(pos) { if(this.ws && this.ws.readyState===1) this.ws.send(JSON.stringify({type:'move', x:pos.x, y:pos.y, z:pos.z})); }
}
