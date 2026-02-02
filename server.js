import express from 'express';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Servir frontend compilado
app.use(express.static(path.join(__dirname, 'dist')));

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});

// Servidor WebSocket
const wss = new WebSocketServer({ server });
const players = new Map();

wss.on('connection', (ws) => {
    const id = Math.random().toString(36).substring(7);
    const color = Math.random() * 0xffffff;
    
    players.set(id, { x: 0, y: 0, z: 0, color: color });
    
    // Enviar estado inicial
    ws.send(JSON.stringify({ type: 'init', id, selfColor: color, players: Array.from(players.entries()) }));
    broadcast({ type: 'player-joined', id, color });

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'move') {
                const p = players.get(id);
                if (p) {
                    p.x = data.x; p.y = data.y; p.z = data.z;
                    broadcast({ type: 'player-moved', id, x: data.x, y: data.y, z: data.z }, id);
                }
            }
        } catch(e) {}
    });

    ws.on('close', () => {
        players.delete(id);
        broadcast({ type: 'player-left', id });
    });
});

function broadcast(data, excludeId = null) {
    wss.clients.forEach((client) => {
        if (client.readyState === 1 && client !== excludeId) client.send(JSON.stringify(data));
    });
}
