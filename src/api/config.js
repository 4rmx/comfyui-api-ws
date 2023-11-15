const { default: baseAxios } = require('axios');
const { COMFYUI_API_ENDPOINT } = require('../config');

const comfyAPI = baseAxios.create({ baseURL: 'http://' + COMFYUI_API_ENDPOINT });

module.exports = { comfyAPI };