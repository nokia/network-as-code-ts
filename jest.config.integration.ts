import config from './jest.config';
config.testRegex = 'itest\\.ts$';
console.log('Running Integration Test');
module.exports = config;
