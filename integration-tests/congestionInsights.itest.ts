import { NetworkAsCodeClient } from "../src";
import "dotenv/config";
import { Device } from "../src/models/device";

let client: NetworkAsCodeClient;
let device: Device;

beforeAll(() => {
    const NAC_TOKEN = process.env["NAC_TOKEN"];
    client = new NetworkAsCodeClient(
        NAC_TOKEN ? NAC_TOKEN : "TEST_TOKEN",
        true
    );
    device = client.devices.get("test-device@testcsp.net", {
        publicAddress: "1.1.1.2",
        privateAddress: "1.1.1.2",
        publicPort: 80,
    });
});

describe("Congestion Insights", () => {
    const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrowDate.setMilliseconds(0);
    it("can create subscription for congestion insights", async () => {
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            tomorrowDate,
            "https://example.com/notify",
            "c8974e592c2fa383d4a3960714"
        );

        expect(subscription.expiresAt).toBe(
            tomorrowDate.toISOString().replace(".000", "")
        );

        subscription.delete();
    });

    it("can get a subscription by id", async () => {
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            tomorrowDate,
            "https://example.com/notify",
            "c8974e592c2fa383d4a3960714"
        );

        const subscription2 = await client.insights.get(
            subscription.subscriptionId
        );

        expect(subscription2).toEqual(subscription);

        subscription.delete();
    });

    it("can get a list of subscriptions", async () => {
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            tomorrowDate,
            "https://example.com/notify",
            "c8974e592c2fa383d4a3960714"
        );

        const subscriptions = await client.insights.getSubscriptions();

        expect(subscriptions.length).toBeGreaterThan(0);

        expect(
            subscriptions.filter(
                (entry) => entry.subscriptionId == subscription.subscriptionId
            ).length
        ).toBe(1);

        subscription.delete();
    });

    it("should fetch current congestion level relevant to a given device", async () => {
        const congestion = await device.getCongestion();
        expect(
            ["none", "low", "medium", "high"].includes(congestion.level)
        ).toBe(true);
    });

    it("should fetch prediction/historical data between two time stamps:", async () => {
        const congestion = await device.getCongestion(
            "2024-04-15T05:11:30.961136Z",
            "2024-04-16T05:11:30Z"
        );
        expect(
            ["none", "low", "medium", "high"].includes(congestion.level)
        ).toBe(true);
    });
});
