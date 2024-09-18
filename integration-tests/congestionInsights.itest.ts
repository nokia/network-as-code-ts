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
    device = client.devices.get({
        phoneNumber: "+3637123456",
    });
});

describe("Congestion Insights", () => {
    const expirationDate = new Date(Date.now() + 5 * 60 * 1000);
    expirationDate.setMilliseconds(0);

    it("can create subscription for congestion insights", async () => {
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            expirationDate,
            "https://example.com/notify",
            "c8974e592c2fa383d4a3960714"
        );

        expect(subscription.expiresAt).toEqual(
            new Date(expirationDate.toISOString().replace(".000", ""))
        );

        subscription.delete();
    });

    it("can create subscription for congestion insights without auth token", async () => {
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            expirationDate,
            "https://example.com/notify"
        );

        expect(subscription.expiresAt).toEqual(
            new Date(expirationDate.toISOString().replace(".000", ""))
        );

        subscription.delete();
    });

    it("can get a subscription by id", async () => {
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            expirationDate,
            "https://example.com/notify",
            "c8974e592c2fa383d4a3960714"
        );

        const subscription2 = await client.insights.get(
            subscription.subscriptionId
        );

        expect(subscription2.subscriptionId).toBe(subscription.subscriptionId);
        expect(subscription2.startsAt).toEqual(subscription.startsAt);

        subscription.delete();
    });

    it("can get a list of subscriptions", async () => {
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            expirationDate,
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
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            expirationDate,
            "https://example.com/notify",
            "c8974e592c2fa383d4a3960714"
        );

        const congestion = await device.getCongestion();

        expect(congestion).toBeDefined();

        expect(congestion instanceof Array).toBeTruthy();

        expect(congestion.length).toBeGreaterThan(0);

        congestion.forEach((x) => {
            expect(x.start).toBeDefined();
            expect(x.stop).toBeDefined();
            expect(["None", "Low", "Medium", "High"].includes(x.level)).toBe(
                true
            );
        });

        subscription.delete();
    });

    it("should fetch prediction/historical data between two time stamps:", async () => {
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            expirationDate,
            "https://example.com/notify",
            "c8974e592c2fa383d4a3960714"
        );

        const congestion = await device.getCongestion(
            "2024-04-15T05:11:30.961136Z",
            "2024-04-16T05:11:30Z"
        );

        expect(congestion).toBeDefined();

        expect(congestion instanceof Array).toBeTruthy();

        congestion.forEach((x) => {
            expect(x.start).toBeDefined();
            expect(x.stop).toBeDefined();
            expect(["None", "Low", "Medium", "High"].includes(x.level)).toBe(
                true
            );
        });

        subscription.delete();
    });
});
