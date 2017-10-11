import {safeLoad} from 'js-yaml';
import Promise from 'bluebird';
var fs = Promise.promisifyAll(require('fs'));

export function loadFileSync(fileName) {
  return safeLoad(fs.readFileSync('./content/' + fileName, 'utf8'));
}

export async function loadFile(fileName) {
  return safeLoad(await fs.readFileAsync('./content/' + fileName, 'utf8'));
}
