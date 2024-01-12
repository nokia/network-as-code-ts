
import { NetworkAsCodeClient } from '../src/network_as_code/client'; // This would need to change into an import from 'network-as-code'


// You can ignore the main function here, it's here to signify we are running in async
const main = async () => {
    // Init the client object with token
    const client = new NetworkAsCodeClient("<APP-TOKEN-HERE>");

    // Create a device object for the mobile device we want to use
    const myDevice = client.devices.get("my_device@testcsp.net", { publicAddress: "1.1.1.2" });

    // Get location info
    const location = myDevice.getLocation(60)

    // Verify location
    if (await myDevice.verifyLocation(60.252, 25.227, 20_000, 120)) {
        console.log("Our device is near Helsinki!");
    }
}
