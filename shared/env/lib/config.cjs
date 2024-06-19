const path = require('path');
const confme = require('./confme/index.cjs');

function getEnvPath() {
    return path.join(__dirname, '../.env.defaults');
}

const env_path = getEnvPath();

require('dotenv').config({ path: env_path });

const ROOT_SERVER_PATH = __dirname;

const config = confme(
    path.join(ROOT_SERVER_PATH, '../config/config.json'),
    path.join(ROOT_SERVER_PATH, '../config/config-schema.json')
);

module.exports = {
    ...config,
};
