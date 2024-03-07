import { NetworkAsCodeClient } from 'network-as-code';

import { Device, DeviceIpv4Addr } from "network-as-code/models/device";

// We are executing inside an async function to have access to await
const main = async () => {
    // Begin by creating a client for Network as Code:
    const client = new NetworkAsCodeClient("<your-application-key-here>");

    // The "device@testcsp.net" should be replaced
    // with a test device copied from your Developer Sandbox
    // Or you can identify a device with its ID,
    // IP address(es) and optionally, a phone number
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
    // For TypeScript, values can be expressed directly,
    // but the order is important
    // The network profile comes before the IP address(es)
    const mySession = await myDevice.createQodSession(
        "DOWNLINK_L_UPLINK_L",
        "233.252.0.2",
        "2001:db8:1234:5678:9abc:def0:fedc:ba98"
    );

    // Let's confirm that the device has the newly created session
    console.log(myDevice.sessions());

    mySession.deleteSession();

    // Finally, remember to clear out the sessions for the device
    myDevice.clearSessions()
}
