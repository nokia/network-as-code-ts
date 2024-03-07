import { NetworkAsCodeClient } from "network-as-code";

import { Device, DeviceIpv4Addr } from "network-as-code/models/device";

const main = async () => {
    const client = new NetworkAsCodeClient(...);

    const mySubscription = await client.deviceStatus.subscribe(...);

    // Get the subscription by its ID
    const mySubscription2 = await client.deviceStatus.get("subscriptionId");
}