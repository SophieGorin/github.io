const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const clients = new Map();

server.on('connection', (socket) => {
    const clientId = generateClientId();
    clients.set(clientId, socket);
    console.log(`Client connected: ${clientId}`);

    socket.on('message', (data) => {
        const message = JSON.parse(data);
        console.log(`Received message from ${clientId}:`, message);

        if (message.type === 'message') {
            broadcast({ type: 'message', text: message.text, from: clientId });
        } else if (message.to && clients.has(message.to)) {
            clients.get(message.to).send(data);
        } else {
            console.error(`Message destination client ${message.to} not found`);
        }
    });

    socket.on('close', () => {
        clients.delete(clientId);
        console.log(`Client disconnected: ${clientId}`);
    });
});

function generateClientId() {
    return Math.random().toString(36).substr(2, 9);
}

function broadcast(data) {
    clients.forEach((client) => client.send(JSON.stringify(data)));
}

console.log('WebSocket server running on ws://localhost:8080');
