import { NetworkAsCodeClient } from 'network-as-code';
import { Device, DeviceIpv4Addr } from "network-as-code/models/device";
import { CivicAddress, Location } from "network-as-code/models/location";

// We are executing inside an async function to have access to await
const main = async () => {
    // We initialize the client object with your application key
    const client = new NetworkAsCodeClient("<your-application-key-here>");

    // Create a device object for the mobile device we want to use
    const myDevice = client.devices.get(
        "device@testcsp.net",
        {
            publicAddress: "233.252.0.2",
            privateAddress: "192.0.2.25",
            publicPort: 80
        },
        // The phone number accepts the "+" sign, but not spaces or "()" marks
        "36721601234567"
    );

    // For estimations, use the `verifyLocation()` method
    // with the geo-coordinates and maximum age in seconds.
    // Integers can be passed directly in TypeScript.
    if (await myDevice.verifyLocation(60.252, 25.227, 1_000, 3600)) {
        console.log("Our device is near Helsinki!");
    }
}
