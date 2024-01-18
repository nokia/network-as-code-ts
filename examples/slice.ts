import { NetworkAsCodeClient } from "../src/network_as_code/client"; // This would need to change into an import from 'network-as-code'

// You can ignore the main function here, it's here to signify we are running in async
const main = async () => {
    // Init the client object with token
    const client = new NetworkAsCodeClient("<APP-TOKEN-HERE>");

    // Create a device object for the mobile device we want to use
    const myDevice = client.devices.get("my_device@testcsp.net", {
        publicAddress: "1.1.1.2",
    });

    // Creation of a slice
    // We use the country code (MCC) and network code (MNC) to identify the network
    //  Different types of slices can be requested using service type and differentiator
    // Area of the slice must also be described in geo-coordinates

    const slice = await client.slices.create(
        { mcc: "236", mnc: "30" },
        { service_type: "eMBB", differentiator: "444444" },
        "https://notify.me/here",
        {
            name: "sdk-integration-slice-2",
            notificationAuthToken: "my-token",
        }
    );
};
