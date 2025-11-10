import { NetworkAsCodeClient } from "../src";
import "dotenv/config";
import { Device } from "../src/models/device";
import { EventType } from "../src/models/deviceStatus";
import { configureClient, configureNotificationServerUrl } from "./configClient";
import { ProxyAgent } from "proxy-agent";
import fetch from "node-fetch";


let client: NetworkAsCodeClient;
let device: Device;
let notificationUrl: string;
let agent : ProxyAgent


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
    notificationUrl = configureNotificationServerUrl();
    agent = new ProxyAgent();
});

describe("Device Status", () => {
    it("can create a connectivity subscription and delete it", async () => {
        const subscription = await client.deviceStatus.subscribe(
            device,
            "org.camaraproject.device-status.v0.connectivity-data",
            `${notificationUrl}/notify`
        );
        expect(subscription.eventSubscriptionId).toBeDefined();

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/device-status/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/device-status/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        subscription.delete();
    },20 * 1000);

    it("can create a connectivity subscription using event type enum and delete it", async () => {
        const subscription = await client.deviceStatus.subscribe(
            device,
            EventType.CONNECTIVITY_DATA,
            `${notificationUrl}/notify`
        );
        expect(subscription.eventSubscriptionId).toBeDefined();

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/device-status/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/device-status/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        subscription.delete();
    },20 * 1000);

    it("can create a connectivity subscription with expiry", async () => {
        const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        tomorrowDate.setMilliseconds(0);

        const subscription = await client.deviceStatus.subscribe(
            device,
            "org.camaraproject.device-status.v0.connectivity-data",
            `${notificationUrl}/notify`,
            {
                subscriptionExpireTime: tomorrowDate,
            }
        );

        expect(subscription.expiresAt).toEqual(
            new Date(tomorrowDate.toISOString().replace(".000", ""))
        );

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/device-status/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/device-status/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        subscription.delete();
    },20 * 1000);

    it("can create a connectivity subscription with other optional arguments", async () => {
        const subscription = await client.deviceStatus.subscribe(
            device,
            "org.camaraproject.device-status.v0.connectivity-data",
            `${notificationUrl}/notify`,
            {
                maxNumberOfReports: 2,
                notificationAuthToken: "my-token",
            }
        );

        expect(subscription.eventSubscriptionId).toBeDefined();
        expect(subscription.maxNumOfReports).toEqual(2);
        expect(subscription.notificationAuthToken).toEqual("my-token");

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/device-status/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/device-status/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        subscription.delete();
    },20 * 1000);

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

    it.skip("can get a list of subscriptions", async () => {
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

    it("can poll device connectivity status sms", async () => {
        device = client.devices.get({
            phoneNumber: "+99999991000"
        });

        const status = await device.getConnectivity();

        expect(status).toBe("CONNECTED_SMS");
    });

    it("can poll device connectivity status connected", async () => {
        device = client.devices.get({
            phoneNumber: "+99999991001"
        });
        
        const status = await device.getConnectivity();

        expect(status).toBe("CONNECTED_DATA");
    });

    it("can poll device connectivity status not connected", async () => {
        device = client.devices.get({
            phoneNumber: "+99999991002"
        });
        
        const status = await device.getConnectivity();

        expect(status).toBe("NOT_CONNECTED");
    });

    it("can poll device roaming status true", async () => {
        device = client.devices.get({
            phoneNumber: "+99999991000"
        });
        
        const status = await device.getRoaming();

        expect(status.roaming).toBeTruthy();
    });

    it("can poll device roaming status false", async () => {
        device = client.devices.get({
            phoneNumber: "+99999991001"
        });
        
        const status = await device.getRoaming();

        expect(status.roaming).toBeFalsy();
    });
});
