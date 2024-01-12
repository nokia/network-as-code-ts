
import { NetworkAsCodeClient } from "../src/network_as_code/client";
import { Device, DeviceIpv4Addr } from "../src/network_as_code/models/device";
import 'dotenv/config';

let client: NetworkAsCodeClient;
let device: Device;

beforeAll(() => {
	const NAC_TOKEN = process.env['NAC_TOKEN'];
    client = new NetworkAsCodeClient(NAC_TOKEN, true);
    device = client.devices.get("test-device@testcsp.net", { publicAddress: "1.1.1.2", privateAddress: "1.1.1.2", publicPort: 80 });
})

describe('Device Status', () => {
    it('can create a connectivity subscription and delete it', async () => {
        const subscription = await client.deviceStatus.subscribe(device, "CONNECTIVITY", "https://example.com/notify");

        expect(subscription.eventSubscriptionId).toBeDefined();

        subscription.delete();
    })

    
    it('can get a subscription by id', async () => {
        const subscription = await client.deviceStatus.subscribe(device, "CONNECTIVITY", "https://example.com/notify");

        const subscription2 = await client.deviceStatus.get(subscription.eventSubscriptionId);

        expect(subscription2).toEqual(subscription);

        subscription.delete();
    })
})
