import { NetworkAsCodeClient } from 'network-as-code';

import { Device, DeviceIpv4Addr } from "network-as-code/models/device";

const main = async () => {
    const client = new NetworkAsCodeClient(...);

    const myDevice = client.devices.get(...);

    const mySession = await myDevice.createQodSession(...);

    // Notice how we can use the number '0'
    // to retrieve our first session in this case:
    const firstSession = await myDevice.sessions()[0];

    // Alternatively, get a specific session with an ID or name parameter
    const sessionId = await client.sessions.get(mySession.id)

    const sessionName = await client.sessions.get("sessionName1")

    // Then, delete the session
    mySession.deleteSession();

    // Delete all QoD sessions associated with a particular device
    myDevice.clearSessions()
}