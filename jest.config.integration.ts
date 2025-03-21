import config from './jest.config';
config.testRegex = 'itest\\.ts$';
testPathIgnorePatterns: [
    "integration-tests/geofencing.test.ts"
],
console.log('Running Integration Test');
module.exports = config;
