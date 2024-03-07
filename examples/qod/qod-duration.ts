import { NetworkAsCodeClient } from 'network-as-code';

import { Device, DeviceIpv4Addr } from "network-as-code/models/device";

// We are executing inside an async function to have access to await
const main = async () => {
    // Begin by creating a client for Network as Code:
    const client = new NetworkAsCodeClient("<your-application-key-here>");

    // Create a device object for the mobile device we want to use
    const myDevice = client.devices.get(
        "device@testcsp.net",
        {
            publicAddress: "233.252.0.2",
            privateAddress: "192.0.2.25",
            publicPort: 80
        },
        "36721601234567"
    );

    // Create a QoD session with QOS_L (large bandwidth)
    // that lasts for 3,600 seconds (1 hour).
    // For TypeScript, values can be expressed directly,
    // but the QoS profile comes before the IP address(es) and duration:
    const mySession = await myDevice.createQodSession(
        "QOS_L",
        "233.252.0.2",
        "2001:db8:1234:5678:9abc:def0:fedc:ba98",
        3600
    );
    // Show a list of all the QoD sessions associated with a device
    console.log(myDevice.sessions());

    // You can also show the duration of a given session
    console.log(mySession.duration());

    // Or use these to check when your session started/expires:
    console.log(mySession.startedAt);
    console.log(mySession.expiresAt);
}

