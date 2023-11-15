const { comfyAPI } = require('./config');

async function execute() {
  return comfyAPI.post('/interrupt')
    .then(res => {
      console.log(res.statusText);
      return res;
    })
    .catch(err => {
      console.log(err);
    });
}

execute();