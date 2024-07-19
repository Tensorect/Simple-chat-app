// src/hooks.server.ts
import WebSocket from 'ws';
import type { Handle } from '@sveltejs/kit';

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

export const handle: Handle = async ({ event, resolve }) => {
  if (event.request.headers.get('upgrade') === 'websocket') {
    const { socket, response } = await event.request.upgrade();
    wss.handleUpgrade(event.request, socket, Buffer.alloc(0), (ws) => {
      wss.emit('connection', ws, event.request);
    });
    return response;
  }
  return resolve(event);
};
