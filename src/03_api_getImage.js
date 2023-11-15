const { default: axios } = require('axios');
const fs = require('fs');
const { COMFYUI_API_ENDPOINT } = require('./config');

// file name and subfolder from 
const output = { filename: 'sample_00001_.png', subfolder: '', type: 'output' };

async function getImage() {
  try {
    // parse output object to url params
    const params = new URLSearchParams(output).toString();
    
    // send request with specific resposponseType specific for save .png with fs
    const response = await axios.get(`http://${COMFYUI_API_ENDPOINT}/view?${params}`, { responseType: 'arraybuffer' });

    // save png image
    fs.writeFileSync(`out/${output.filename}`, response.data);
  } catch (err) {
    console.log(err);
  }
}

getImage();