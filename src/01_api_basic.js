const { default: axios } = require('axios');
const { COMFYUI_API_ENDPOINT } = require('./config');
const wf = require('./workflow/01_workflow_api_basic.json');

async function executePrompt() {
  try {
    // change positive prompt
    wf[3].inputs.text = '1girl';

    // change file name in save image node
    wf[7].inputs.filename_prefix = 'sample';

    // log workflow befor send
    console.log(wf);

    // send to api
    const response = await axios.post(`http://${COMFYUI_API_ENDPOINT}/prompt`, { prompt: wf });

    /** @type {import('./api/postQueue').ResponseSuccess} */
    const data = response.data;

    // response prompt_id
    console.log('prompt_id:', data.prompt_id);
  } catch (err) {
    console.log(err);
  }
}

executePrompt();