const { comfyAPI } = require('./config');

/** 
 * @typedef ResponseSuccess
 * @property {string} prompt_id
 * @property {number} number
 * @property {object} node_errors
*/

/**
 * @param {Object.<string, any>} prompt 
 * @param {string} client_id
 * @return {Promise<import('axios').AxiosResponse<ResponseSuccess>>}
*/
module.exports = (prompt, client_id) => comfyAPI.post('prompt', { prompt, client_id });
