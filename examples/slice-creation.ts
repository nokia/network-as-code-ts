// Specialized Network functionalities

// Slice examples:

import { NetworkAsCodeClient } from "network-as-code";

const client = new NetworkAsCodeClient("<your-application-key-here>");

// This is the device object we'll later attach to the slice
const myDevice = client.devices.get({
    networkAccessIdentifier: "device@testcsp.net",
    ipv4Address: {
        publicAddress: "233.252.0.2",
        privateAddress: "192.0.2.25",
        publicPort: 80,
    },
});

// Creation of a slice:
// We use the country code (MCC) and network code (MNC) to identify the network
// Different types of slices can be requested using service type and differentiator
// Area of the slice must also be described in geo-coordinates
const mySlice = await client.slices.create(
    { mcc: "236", mnc: "30" },
    { serviceType: "eMBB", differentiator: "123456" },
    "https://notify.me/here",
    {
        name: "slice-name",
        notificationAuthToken: "replace-with-your-auth-token",
        areaOfService: {
            polygon: [
                {
                    latitude: 23.0,
                    longitude: 23.0
                },
                {
                    latitude: 23.0,
                    longitude: 23.0
                },
            ],
        },
        maxDataConnections: 1000,
        maxDevices: 5,
        sliceDownlinkThroughput: {
            guaranteed: 3415,
            maximum: 1234324
        },
        sliceUplinkThroughput: {
            guaranteed: 3415,
            maximum: 1234324
        },
        deviceDownlinkThroughput: {
            guaranteed: 3415,
            maximum: 1234324
        },
        deviceUplinkThroughput: {
            guaranteed: 3415,
            maximum: 1234324
        }
    }
);

// Get a slice by using an index
// or remove the index '[0]' to get all slices
const sliceByIndex = await client.slices.getAll()[0];

// Get a slice using the ID parameter
const sliceByName = await client.slices.get(mySlice.name as string);

// Modify a slice:
// Remember to reconfigure all the parameters you wish to modify,
// The modify() method does not preserve previously configure ones.
mySlice.modify(
    {
        sliceDownlinkThroughput: { guaranteed: 10, maximum: 10 },
        sliceUplinkThroughput: { guaranteed: 10, maximum: 10 },
        deviceDownlinkThroughput: { guaranteed: 10, maximum: 10 },
        deviceUplinkThroughput: { guaranteed: 10, maximum: 10 },
        maxDataConnections: 12,
        maxDevices: 3
    }
);

// We can take advantage of Slice.waitFor() in async functions
// This allows us to, e.g., wait for a slice to become available
await mySlice.waitFor("AVAILABLE");

// Slices must be activated before devices can be added
await mySlice.activate();
await mySlice.waitFor("OPERATING");

// Afterwards we can attach or detach devices
const device = client.devices.get(myDevice)
await mySlice.attach(
    myDevice,
    "https://notify.me/here",
    "replace-with-your-auth-token"
);

await mySlice.detach(myDevice);

// For deallocating a slice, we first deactivate the slice
await mySlice.deactivate();
await mySlice.waitFor("AVAILABLE");

// A deactivated slice can be freely removed
mySlice.delete()
