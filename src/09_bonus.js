/**
 * @typedef {'status'|'progress'|'executing'|'executed'|'execution_start'|'execution_error'|'execution_cached'} MessageType
 * 
 * @typedef MsgStatus
 * @property {'status'} type
 * @property {object} data
 * @property {object} data.status
 * @property {object} data.status.exec_info
 * @property {number} data.status.exec_info.queue_remaining
 * 
 * @typedef MsgExeStart
 * @property {string} type
 * @property {object} data
 * @property {string} data.prompt_id
 * 
 * @typedef MsgExeCached
 * @property {string} type
 * @property {object} data
 * @property {} data.nodes
 * @property {string} data.prompt_id
 * 
 * @typedef MsgExe
 * @property {string} type
 * @property {object} data
 * @property {string|null} data.node
 * @property {string} data.prompt_id
 * 
 * @typedef MsgProgress
 * @property {string} type
 * @property {object} data
 * @property {number} data.value
 * @property {number} data.max
 * 
 * @typedef MsgExecuted
 * @property {string} type
 * @property {object} data
 * @property {string} data.node
 * @property {object} data.output
 * @property {object[]} data.output.images
 * @property {string} data.output.images.filename
 * @property {string} data.output.images.subfolder
 * @property {string} data.output.images.type
 * @property {string} data.prompt_id
 */

const { v4: uuidv4 } = require('uuid');
const { WebSocket } = require('ws');
const fs = require('fs');
const cliProgress = require('cli-progress');

const { COMFYUI_API_ENDPOINT } = require('./config');
const wf = require('./workflow/01_workflow_api_basic.json');
const postQueue = require('./api/postQueue');
const getImagePNG = require('./api/getImagePNG');
const { randomSeed } = require('./utils');

// Create ClientId
const client_id = uuidv4();

// Create Websocket instant
const ws = new WebSocket(`ws://${COMFYUI_API_ENDPOINT}/ws?clientId=${client_id}`);

// create simple progress bar
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// log when error
ws.on('error', console.error);

// handle incomming message from websocket
ws.on('message', handleComfyUIMessage);

// when socket connected
ws.on('open', () => {
  console.log('socket is connected!');
  // start queue prompt when socket is connected!
  queuePrompt();
});

/** @param {string} msg */
function handleComfyUIMessage(msg) {
  msg = JSON.parse(msg);
  /** @type {MessageType} */
  const type = msg?.type;
  if (type === 'status') {
    /** @type {MsgStatus} */
    const { data } = msg;
    // console.log(data.status.exec_info);
    const { queue_remaining } = data.status.exec_info;
    console.log({ queue_remaining });
  } else if (type === 'execution_start') {
    /** @type {MsgExeStart} */
    const { data } = msg;
    console.log('prompt_id:', data.prompt_id);
  } else if (type === 'executing') {
    /** @type {MsgExe} */
    const { data } = msg;
    // when all execution is done and queue is available
    if (data.node === null) {
      console.log('DONE!');
    } else {
      console.log(data);
    }
  } else if (type === 'executed') {
    // when execution is done
    /** @type {MsgExecuted} */
    const { data } = msg;
    console.log(data.output.images);
    handleDownloadImage(data.output.images[0]);
  } else if (type === 'progress') {
    // when sampler progress use progress bar to show status
    /** @type {MsgProgress} */
    const { data } = msg;
    if (bar1.getProgress() === 0) {
      bar1.start(data.max, data.value);
    } else if (data.max === data.value) {
      bar1.update(data.value);
      bar1.stop();
    } else {
      bar1.update(data.value);
    }
  } else {
    console.log(msg);
  }
};

async function queuePrompt() {
  try {
    // manual random seed by js code;
    wf[2].inputs.seed = randomSeed();
    const res = await postQueue(wf, client_id);
    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
}

/**
 * @typedef  Image 
 * @property {string} filename
 * @property {string} subfolder
 * @property {string} type 
 * 
 * @param {Image} image 
 */
async function handleDownloadImage(image) {
  try {
    const params = new URLSearchParams(image);
    const response = await getImagePNG(params);
    fs.writeFileSync(`out/${image.filename}`, response.data);
    console.log('Downloaded!');
  } catch (err) {
    console.log(err);
  }
}

