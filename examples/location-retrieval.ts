// Device Location functionalities

// Location verification examples:

import { NetworkAsCodeClient } from "network-as-code";

// We initialize the client object with your application key
const client = new NetworkAsCodeClient("<your-application-key-here>");

// Create a device object for the mobile device we want to use
const myDevice = client.devices.get({
    networkAccessIdentifier: "device@testcsp.net",
    ipv4Address: {
        publicAddress: "233.252.0.2",
        privateAddress: "192.0.2.25",
        publicPort: 80,
    },
    Ipv6Address: "2041:0000:140F::875B:131B",
    // The phone number does not accept spaces or parentheses
    phoneNumber: "+36721601234567"
});

// Specify the maximum amount of time accepted
// to get location information, it's a mandatory parameter.
// The value (integer in seconds) can be passed directly.
const location = await myDevice.getLocation(3600);

console.log(location.latitude);
console.log(location.longitude);
console.log(location.civicAddress);

// For estimations, use the `verifyLocation()` method
// with the geo-coordinates and maximum age in seconds.
// Integers can be passed directly in TypeScript.
if (await myDevice.verifyLocation(60.252, 25.227, 1_000, 3600)) {
    console.log("Our device is near Helsinki!");
}
