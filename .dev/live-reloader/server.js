import { WebSocket, WebSocketServer } from 'ws';

let reloadRequired = true;
const liveReloader = (port) => {
    const wss = new WebSocketServer({ port });

    let wsClient;
    let wsClients = [];
    wss.on('connection', (ws) => {
        wsClient = ws;

        if (reloadRequired) broadcastWSMessage({ message: 'reload' });
        reloadRequired = false;
    });

    wss.on('upgrade', function upgrade(request, socket, head) {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request, wsClient);
        });
    });

    const broadcastWSMessage = (message) => {
        let jsonMessage = JSON.stringify(message);

        wss.clients?.forEach((client, i) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(jsonMessage);
            }
        });
    };

    const closeWS = (message) => {
        wss.clients?.forEach((client, i) => {
            if (client.readyState === WebSocket.OPEN) {
                client.terminate();
            }
        });
    };

    return { broadcastWSMessage, closeWS };
};

export default liveReloader;
