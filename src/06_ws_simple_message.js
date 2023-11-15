/**
 * @typedef MessageStatus
 * @property {'status'} type
 * @property {object} data
 * @property {object} data.status
 * @property {object} data.status.exec_info
 * @property {number} data.status.exec_info.queue_remaining
 */
const { v4: uuidv4 } = require('uuid');
const { WebSocket } = require('ws');
const { COMFYUI_API_ENDPOINT } = require('./config');

// Create ClientId
const client_id = uuidv4();

// Create Websocket instant
const ws = new WebSocket(`ws://${COMFYUI_API_ENDPOINT}/ws?clientId=${client_id}`);

// log when error
ws.on('error', console.error);

// handle incomming message from websocket
ws.on('message', handleComfyUIMessage);

// log when socket connected
ws.on('open', () => console.log('socket is connected!'));

/** @param {string} msg */
async function handleComfyUIMessage(msg) {
  try {
    msg = JSON.parse(msg);
    if (msg?.type === 'status') {
      /** @type {MessageStatus} */
      const { data } = msg;
      console.log(data.status.exec_info);
    } else {
      console.log(msg);
    }
  } catch (err) {
    console.log(err);
  }
}