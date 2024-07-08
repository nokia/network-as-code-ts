import * as fs from "fs";

function getVersion() {
  const data = fs.readFileSync("package.json", "utf-8");
  const packageJson = JSON.parse(data);
  return packageJson.version;
}

console.log(getVersion());
