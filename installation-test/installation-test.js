// The content of this file will be copied to run installation test during Jenkins Build

import { NetworkAsCodeClient } from "network-as-code";

const main = async () => {
  const NAC_TOKEN = process.env["NAC_TOKEN"];
  const client = new NetworkAsCodeClient(NAC_TOKEN, true);

  let device = client.devices.get({
    networkAccessIdentifier: "test-device@testcsp.net",
    ipv4Address: {
      publicAddress: "1.1.1.2",
      privateAddress: "1.1.1.2",
      publicPort: 80,
    },
  });

  let location = await device.getLocation();

  console.log("Location Latitude", location.latitude);
  console.log("Location longitude", location.longitude);
};

main();
