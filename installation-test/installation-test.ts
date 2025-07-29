// The content of this file will be copied to run installation test during Jenkins Build

import { NetworkAsCodeClient } from "network-as-code";

test("nac", async () => {
    const NAC_TOKEN = process.env["NAC_TOKEN"];
    const client = new NetworkAsCodeClient(NAC_TOKEN as string, true);

    let device = client.devices.get({
        networkAccessIdentifier: "test-device@testcsp.net",
        ipv4Address: {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        },
    });

    let location = await device.getLocation();

    expect(location).toBeDefined();

    expect(location.latitude).toBe(47.48627616952785);
    expect(location.longitude).toBe(19.07915612501993);
});
