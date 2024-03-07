import { NetworkAsCodeClient } from 'network-as-code';

import { Device, DeviceIpv4Addr } from "network-as-code/models/device";

const main = async () => {
    const client = new NetworkAsCodeClient(...);

    const myDevice = client.devices.get(...);

    // Get all sessions
    const allSessions = await myDevice.sessions();

    // Notice how we can use the number '0'
    // to retrieve our first session in this case:
    const firstSession = await allSessions[0];
}
