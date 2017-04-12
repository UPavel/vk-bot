import path from 'path';
import fs from 'fs';
import VK from 'vk-io';

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json')));

const vk = new VK();
vk.setToken(config.token);

export default vk;
