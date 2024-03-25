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
    // that lasts for 3,600 seconds (1 hour).
    // For TypeScript, values can be expressed directly,
    // but the QoS profile comes before the IP address(es) and duration:
    const mySession = await myDevice.createQodSession(
        "QOS_L",
        "233.252.0.2",
        "2001:db8:1234:5678:9abc:def0:fedc:ba98",
        3600,
        // Use HTTPS to send or subscribe to notifications
        "https://notify.me/here",
        "replace-with-your-auth-token"
    );

    // Let's confirm that the device has the newly created session
    console.log(myDevice.sessions());

    // This is how you get all sessions for a device
    const allSessions = await myDevice.sessions();

    // And you can also get a specific session.
    // Notice how we can use the number '0'
    // to retrieve our first session in this case:
    const firstSession = await allSessions[0];

    // Show a list of all the QoD sessions associated with a device
    console.log(myDevice.sessions());

    // You can also show the duration of a given session
    console.log(mySession.duration());

    // Or use these to check when your session started/expires:
    console.log(mySession.startedAt);
    console.log(mySession.expiresAt);

    // Additionally, you can delete a specific session like so:
    mySession.deleteSession();

    // Finally, clear out all sessions for a device when you're done:
    myDevice.clearSessions()
};
