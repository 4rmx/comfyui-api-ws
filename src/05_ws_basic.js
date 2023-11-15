const { v4: uuidv4 } = require('uuid');
const { WebSocket } = require('ws');
const { COMFYUI_API_ENDPOINT } = require('./config');

const client_id = uuidv4();

// Create Websocket instant
const ws = new WebSocket(`ws://${COMFYUI_API_ENDPOINT}/ws?clientId=${client_id}`);

// log when error
ws.on('error', console.error);

// log when socket connected
ws.on('open', () => console.log('socket is connected!'));