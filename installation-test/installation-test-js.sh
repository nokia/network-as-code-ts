#!/bin/bash

set -e

npm pack
mkdir test-js-project
version=$(node extract_version.js)
cd test-js-project
npm init es6 -y
jq '.scripts.test = "jest --coverage=false"' package.json > temp.json && mv temp.json package.json
cp ../installation-test/installation-test.js ./installation.test.js
npm i jest --save-dev
npm i ../network-as-code-${version}.tgz
node installation.test.js
cd ..
rm -r test-js-project
rm network-as-code-${version}.tgz