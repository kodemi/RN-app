const packageJson = require('../package.json');
const axios = require('axios');


axios.post('https://api.vipport.ru/pos/version', {
    version: packageJson.version
}, {
    auth: {
        username: 'admin',
        password: 'gjhndbg'
    }
})
.catch(error => console.log('[ERROR] ' + error.message))

