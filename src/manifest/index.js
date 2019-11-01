const pkg = require('../../package.json');

const manifestInput = {
    manifest_version: 2,
    name: 'Kutt',
    version: pkg.version,
};

module.exports = manifestInput;
