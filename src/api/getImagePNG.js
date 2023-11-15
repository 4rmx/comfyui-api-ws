const { comfyAPI } = require('./config');

/** @param {string} params */
module.exports = (params) => comfyAPI.get(`view?${params}`, { responseType: 'arraybuffer' });
