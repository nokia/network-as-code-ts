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

    const mySlice = await client.slices.create(...);

    await mySlice.activate();

    mySlice.deactivate();

    // Call the delete method with the slice object
    await mySlice.delete();
}
