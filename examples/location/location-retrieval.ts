import { NetworkAsCodeClient } from "network-as-code";
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

    // Specify the maximum amount of time accepted
    // to get location information, it's a mandatory parameter.
    // The value (integer in seconds) can be passed directly.
    const location = await myDevice.getLocation(3600);

    console.log(location.latitude);
    console.log(location.longitude);
    console.log(location.civicAddress);
}
