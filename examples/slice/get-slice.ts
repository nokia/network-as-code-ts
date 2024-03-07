import { NetworkAsCodeClient } from "network-as-code";

import { Device, DeviceIpv4Addr } from "network-as-code/models/device";

import {
    AreaOfService,
    NetworkIdentifier,
    Point,
    Slice,
    SliceInfo
} from "network-as-code/models/slice";

const main = async () => {
    const client = new NetworkAsCodeClient(...);

    const mySlice = await client.slices.create(
        { mcc: "236", mnc: "30" },
        { service_type: "eMBB", differentiator: "123456" },
        // Use HTTPS to send notifications
        "https://notify.me/here",
        {
            name: "sliceName",
            notificationAuthToken: "my-token",
        }
        // Include all the other slice parameters
    );

    // Get a slice by using an index
    // or remove the index '[0]' to get all slices
    const sliceByIndex = await client.slices.getAll()[0];

    // Get a slice using the ID parameter
    const sliceByName = await client.slices.get("sliceName");
}
