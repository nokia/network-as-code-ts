import { NetworkAsCodeClient } from "../src";
import "dotenv/config";
import { Device } from "../src/models/device";
import { configureClient, configureNotificationServerUrl } from "./configClient";
import { ProxyAgent } from "proxy-agent";
import fetch from "node-fetch";
import { v4 as uuid } from 'uuid';

let client: NetworkAsCodeClient;
let device: Device;
let notificationUrl: string;
let agent : ProxyAgent

beforeAll(() => {
    client = configureClient()
    device = client.devices.get({
        phoneNumber: "+3670123456",
    });
    notificationUrl = configureNotificationServerUrl();
    agent = new ProxyAgent();
});

describe("Congestion Insights", () => {
    const expirationDate = new Date(Date.now() + 5 * 60 * 1000);
    expirationDate.setMilliseconds(0);

    it("can create subscription for congestion insights", async () => {
        const notificationId: string = uuid();
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            expirationDate,
            `${notificationUrl}/notify/${notificationId}`,
            "c8974e592c2fa383d4a3960714"
        );

        expect(subscription.expiresAt).toEqual(
            new Date(expirationDate.toISOString().replace(".000", ""))
        );        
        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/congestion-insights/${notificationId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/congestion-insights/${notificationId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        const deletionData = await notification.json()
        expect(deletionData).toEqual([{"message": "Notification deleted"}, 200])

        await subscription.delete();

    },20 * 1000);

    it("can create subscription for congestion insights without auth token", async () => {
        const notificationId: string = uuid();
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            expirationDate,
            `${notificationUrl}/notify/${notificationId}`
        );

        expect(subscription.expiresAt).toEqual(
            new Date(expirationDate.toISOString().replace(".000", ""))
        );
        
        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/congestion-insights/${notificationId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/congestion-insights/${notificationId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        const deletionData = await notification.json()
        expect(deletionData).toEqual([{"message": "Notification deleted"}, 200]) 

        await subscription.delete();

    },20 * 1000);

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

        await subscription.delete();
    });

    it("can get subscription start and expiration", async () => {
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            expirationDate,
            "https://example.com/notify"
        );

        expect(subscription.startsAt).toBeDefined()
        expect(subscription.expiresAt).toBeDefined()

        expect(subscription.startsAt instanceof Date).toBeTruthy();

        await subscription.delete();
    });

    it("can get start and expiration from selected subscription", async () => {
        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            expirationDate,
            "https://example.com/notify"
        );

        const subscriptionFromList = (await client.insights.getSubscriptions())[0]

        expect(subscriptionFromList.startsAt).toBeDefined()
        expect(subscriptionFromList.expiresAt).toBeDefined()
        
        const subscriptionById = await client.insights.get(
            subscription.subscriptionId
        );

        expect(subscriptionById.startsAt).toBeDefined()
        expect(subscriptionById.expiresAt).toBeDefined()

        await subscription.delete();
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

        await subscription.delete();
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

        await subscription.delete();
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

        await subscription.delete();
    });
});
