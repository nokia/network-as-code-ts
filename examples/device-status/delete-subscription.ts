import { NetworkAsCodeClient } from "network-as-code";

import { Device, DeviceIpv4Addr } from "network-as-code/models/device";

const main = async () => {
    const client = new NetworkAsCodeClient(...);

// Get a subscription by its ID
    const mySubscription = await client.deviceStatus.get(eventSubscriptionId);

    // Then, delete the subscription
    mySubscription.delete();
}
