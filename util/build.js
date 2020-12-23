const fs = require('fs-extra');
const childProcess = require('child_process');

try {
    fs.removeSync('./dist/');

    childProcess.exec('tsc --build tsconfig.prod.json');

    fs.copy('./src/openapi.yaml', './dist/openapi.yaml');
} catch (err) {
    console.log(err);
}
