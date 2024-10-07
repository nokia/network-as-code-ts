import { NetworkAsCodeClient } from "../src";
import "dotenv/config";
import { Device } from "../src/models/device";
import { configureClient } from "./configClient";

let client: NetworkAsCodeClient;
let device: Device;

beforeAll(() => {
    client = configureClient()
    device = client.devices.get({
        networkAccessIdentifier: "test-device@testcsp.net",
        ipv4Address: {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        },
    });
});

describe("Device Status", () => {
    it("can create a connectivity subscription and delete it", async () => {
        const subscription = await client.deviceStatus.subscribe(
            device,
            "org.camaraproject.device-status.v0.connectivity-data",
            "https://example.com/notify"
        );

        expect(subscription.eventSubscriptionId).toBeDefined();

        subscription.delete();
    });

    it("can create a connectivity subscription with expiry", async () => {
        const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        tomorrowDate.setMilliseconds(0);

        const subscription = await client.deviceStatus.subscribe(
            device,
            "org.camaraproject.device-status.v0.connectivity-data",
            "https://example.com/notify",
            {
                subscriptionExpireTime: tomorrowDate,
            }
        );

        expect(subscription.expiresAt).toEqual(
            new Date(tomorrowDate.toISOString().replace(".000", ""))
        );

        subscription.delete();
    });

    it("can get a subscription by id", async () => {
        const subscription = await client.deviceStatus.subscribe(
            device,
            "org.camaraproject.device-status.v0.connectivity-data",
            "https://example.com/notify"
        );

        const subscription2 = await client.deviceStatus.get(
            subscription.eventSubscriptionId
        );

        expect(subscription2.eventSubscriptionId).toBe(
            subscription.eventSubscriptionId
        );
        expect(subscription2.startsAt).toEqual(subscription.startsAt);

        subscription.delete();
    });

    it("can get a list of subscriptions", async () => {
        const subscription = await client.deviceStatus.subscribe(
            device,
            "org.camaraproject.device-status.v0.connectivity-data",
            "https://example.com/notify"
        );

        const subscriptions = await client.deviceStatus.getSubscriptions();

        expect(subscriptions.length).toBeGreaterThan(0);

        expect(
            subscriptions.filter(
                (entry) =>
                    entry.eventSubscriptionId ==
                    subscription.eventSubscriptionId
            ).length
        ).toBe(1);

        subscription.delete();
    });

    it("can poll device connectivity", async () => {
        const status = await device.getConnectivity();

        expect(status).toBe("CONNECTED_DATA");
    });

    it("can poll device roaming status", async () => {
        const status = await device.getRoaming();

        expect(status.roaming).toBeTruthy();
    });
});
