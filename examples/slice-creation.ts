import { NetworkAsCodeClient } from "network-as-code";

const client = new NetworkAsCodeClient("<your-application-key-here>");

let mySlice = await client.slices.create(
    { mcc: "236", mnc: "30" },
    { serviceType: "eMBB", differentiator: "123456" },
    "https://notify.me/here",
    {
        name: "slice-1",
        notificationAuthToken: "replace-with-your-auth-token",
        areaOfService: {
            polygon: [
                {
                    latitude: 47.344,
                    longitude: 104.349,
                },
                {
                    latitude: 35.344,
                    longitude: 76.619,
                },
                {
                    latitude: 12.344,
                    longitude: 142.541,
                },
                {
                    latitude: 19.43,
                    longitude: 103.53,
                },
            ],
        },
        maxDataConnections: 10,
        maxDevices: 6,
        sliceDownlinkThroughput: {
            guaranteed: 3415,
            maximum: 1234324,
        },
        sliceUplinkThroughput: {
            guaranteed: 3415,
            maximum: 1234324,
        },
        deviceDownlinkThroughput: {
            guaranteed: 3415,
            maximum: 1234324,
        },
        deviceUplinkThroughput: {
            guaranteed: 3415,
            maximum: 1234324,
        },
    }
);

console.log("Slice created", await mySlice);

// We can take advantage of Slice.waitFor() in async functions
// This allows us to, e.g., wait for a slice to become available
await mySlice.waitFor("AVAILABLE");

console.log("Slice is now operational");

mySlice = await client.slices.get("slice-1");

// Slices must be activated before devices can be added
await mySlice.activate();

await mySlice.waitFor("OPERATING");

console.log("Slice is active and ready for devices");

const device = client.devices.get({
    ipv4Address: {
        publicAddress: "1.1.1.2",
        privateAddress: "1.1.1.2",
        publicPort: 80,
    },
    phoneNumber: "+33670123456",
});

await mySlice.attach(
    device,
    "c8974e592c2fa383d4a3960714",
    "https://example.com/notifications",
    {
        apps: {
            os: "97a498e3-fc92-5c94-8986-0333d06e4e47",
            apps: ["ENTERPRISE"],
        },
    }
);

console.log("Device attached");

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));
await sleep(10000);

await mySlice.detach(device);
console.log("Device detached");

// For unallocating a slice, we first deactivate the slice
await mySlice.deactivate();
await mySlice.waitFor("AVAILABLE");

console.log("Slice deactivated");

// A deactivated slice can be freely removed
await mySlice.delete();
console.log("Slice deleted");
