// QoD functionalities

// QoS session examples:

import { NetworkAsCodeClient } from "network-as-code";

// Begin by creating a client for Network as Code:
const client = new NetworkAsCodeClient("<your-application-key-here>");

// The "device@testcsp.net" should be replaced
// with a test device copied from your Developer Sandbox
// Or you can identify a device with its ID,
// IP address(es) and optionally, a phone number
const myDevice = client.devices.get({
    networkAccessIdentifier: "device@testcsp.net",
    ipv4Address: {
        publicAddress: "233.252.0.2",
        privateAddress: "192.0.2.25",
        publicPort: 80,
    },
    Ipv6Address: "2041:0000:140F::875B:131B",
    phoneNumber: "+36721601234567",
});

// Create a QoD session with QOS_L (large bandwidth)
// that lasts for 3,600 seconds (1 hour).
// For TypeScript, values can be expressed directly,
// but the QoS profile comes before the IP address(es) and duration:
const mySession = await myDevice.createQodSession("QOS_L", {
    serviceIpv4: "233.252.0.2",
    serviceIpv6: "2001:db8:1234:5678:9abc:def0:fedc:ba98",
    duration: 3600,
    // Use HTTPS to send or subscribe to notifications
    notificationUrl: "https://notify.me/here",
    notificationAuthToken: "replace-with-your-auth-token",
});

// Let's confirm that the device has the newly created session
console.log(await myDevice.sessions());

// This is how you get all sessions for a device
const allSessions = await myDevice.sessions();

// And you can also get a specific session.
// Notice how we can use the number '0'
// to retrieve our first session in this case:
const firstSession = await allSessions[0];

// Show a list of all the QoD sessions associated with a device
console.log(await myDevice.sessions());

// Or use these to check when your session duration and started/expires:
if (mySession !== undefined) {
    console.log(mySession.duration);
    console.log(mySession.startedAt);
    console.log(mySession.expiresAt);
}

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));
// Additionally, you can delete a specific session like so:
mySession.deleteSession();

// wait until the delete operation is completed
await sleep(500);
// Finally, clear out all sessions for a device when you're done:
myDevice.clearSessions();
