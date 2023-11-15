const { default: axios } = require('axios');
const { COMFYUI_API_ENDPOINT } = require('./config');

// send api when you need to interrupt comfyUI execution
async function interrupt() {
  try {
    const response = await axios.post(`http://${COMFYUI_API_ENDPOINT}/interrupt`);
    console.log(response.status);
  } catch (err) {
    console.log(err);
  }
}

interrupt();