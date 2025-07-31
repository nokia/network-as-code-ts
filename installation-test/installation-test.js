// The content of this file will be copied to run installation test during Jenkins Build

import { NetworkAsCodeClient } from "network-as-code";

const main = async () => {
  const NAC_TOKEN = process.env["NAC_TOKEN"];
  const client = new NetworkAsCodeClient(NAC_TOKEN, true);

  let device = client.devices.get({
            phoneNumber: "+36719991000"
        });

  let location = await device.getLocation();

  console.log("Location Latitude", location.latitude);
  console.log("Location longitude", location.longitude);
};

main();