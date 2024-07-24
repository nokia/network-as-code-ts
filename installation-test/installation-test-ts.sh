#!/bin/bash

set -e

npm pack
mkdir test-ts-project
version=$(node extract_version.js)
cd test-ts-project
npm init es6 -y
jq '.scripts.test = "jest --coverage=false"' package.json > temp.json && mv temp.json package.json
cp ../babel.config.cjs .
cp ../jest.config.ts .
cp ../installation-test/installation-test.ts ./installation.test.ts
npm i typescript @types/jest jest ts-jest ts-node @babel/preset-env @babel/preset-typescript --save-dev
npm i ../network-as-code-${version}.tgz
npm run test installation.test.ts
cd ..
rm -r test-ts-project
rm network-as-code-${version}.tgz