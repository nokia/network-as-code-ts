import { NetworkAsCodeClient } from "../src";
import "dotenv/config";
import { Device } from "../src/models/device";
import { configureClient } from "./configClient";

let client: NetworkAsCodeClient;
let device: Device;

beforeAll(() => {
    client = configureClient();
    device = client.devices.get({
        networkAccessIdentifier: "test-device@testcsp.net",
        ipv4Address: {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        },
    });
});

describe("Geofencing", () => {
    it.failing("can subscribe for geofencing events", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: "https://example.com/notif",
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            latitude: 47.48627616952785,
            longitude: 19.07915612501993,
            radius: 2000
        })

        expect(subscription.eventSubscriptionId).toBeTruthy()

        subscription.delete()
    })
})
