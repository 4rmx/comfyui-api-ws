/** 
 * @typedef  Images
 * @property {string} filename
 * @property {string} subfolder
 * @property {string} type
 * 
 * @typedef {Object.<string, {images: Array<Images> }>} Outputs
 * 
 * @typedef {Object.<string, {prompt: Array, outputs: Outputs}>} ResponseSuccess 
 */

const { default: axios } = require('axios');
const { COMFYUI_API_ENDPOINT } = require('./config');

// replace prompt_id from 01_basic_api response
const prompt_id = 'c32003af-9d4a-44c6-97a0-89b20f0e4dac';

async function getHistory() {
  try {
    const response = await axios.get(`http://${COMFYUI_API_ENDPOINT}/history/${prompt_id}`);

    /** @type {ResponseSuccess} */
    const data = response.data;

    // console.log(data[prompt_id]);
    console.log(data[prompt_id].outputs['7'].images);
  } catch (err) {
    console.log(err);
  }
}

getHistory();