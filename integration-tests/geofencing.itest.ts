import { NetworkAsCodeClient } from "../src";
import { beforeAll, describe, expect} from "@jest/globals";
import { ProxyAgent } from "proxy-agent";
import fetch from "node-fetch";
import "dotenv/config";
import { Device } from "../src/models/device";
import { EventType } from "../src/models/geofencing";
import { configureClient, configureNotificationServerUrl } from "./configClient";

let client: NetworkAsCodeClient;
let device: Device;
let notificationUrl: string;
let agent : ProxyAgent

beforeAll(() => {
    client = configureClient();
    device = client.devices.get({
        phoneNumber:"+3637123456",
    });
    notificationUrl = configureNotificationServerUrl();
    agent = new ProxyAgent()
});

describe("Geofencing", () => {
    it("should subscribe for geofencing with areaType Circle and event area entered", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            areaType: "CIRCLE",
            sink: `${notificationUrl}/notify`,
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            latitude: 47.48627616952785,
            longitude: 19.07915612501993,
            radius: 2000
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();
        expect(subscription.area).toEqual({"areaType": "CENTER","center": {"latitude": 47.48627616952785, "longitude": 19.07915612501993}, "radius": 2000});

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            });

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent 
            });

        subscription.delete();
    },20 * 1000);

    it("should subscribe for geofencing with areaType POI and event area entered", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            areaType: "POI",
            sink: `${notificationUrl}/notify`,
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            poiName: "TestingPOI"
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();
        expect(subscription.area).toEqual({"areaType": "POI", "poiName": "TestingPOI"})

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            });

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent 
            });

        subscription.delete();
    },20 * 1000);

    it("should subscribe for geofencing event area entered using event type enum", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            areaType: "CIRCLE",
            sink: `${notificationUrl}/notify`,
            types: [EventType.AREA_ENTERED],
            latitude: 47.48627616952785,
            longitude: 19.07915612501993,
            radius: 2000
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            });

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent 
            });

        subscription.delete();
    },20 * 1000);

    it("should subscribe for geofencing event area left", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            areaType: "POI",
            sink: `${notificationUrl}/notify`,
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-left"],
            poiName: "TestingPOI"
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        subscription.delete();
    },20* 1000);

    it("should subscribe for geofencing event with plain credential", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            areaType: "CIRCLE",
            sink: `${notificationUrl}/notify`,
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-left"],
            latitude: 47.48627616952785,
            longitude: 19.07915612501993,
            radius: 2000,
            sinkCredential: {
                credentialType:"PLAIN",
                identifier: "client-id",
                secret: "client-secret"
            }
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        subscription.delete();
    }, 20 * 1000);

    it("should subscribe for geofencing event with accesstoken credential", async () => {
        const expirationDate = new Date(Date.now() + 5 * 60 * 60 * 1000);
        expirationDate.setMilliseconds(0);
        const subscription = await client.geofencing.subscribe(device, {
            areaType: "POI",
            sink: `${notificationUrl}/notify`,
            types: [EventType.AREA_LEFT],
            poiName: "TestingPOI",
            sinkCredential: {
                credentialType:"ACCESSTOKEN",
                accessToken: "some-access-token",
                accessTokenType: "bearer",
                accessTokenExpiresUtc: expirationDate
            }
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data = await notification.json();

        expect(data).not.toBeNull();

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        subscription.delete();
    }, 20 * 1000);

    it("should get an event subscription", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            areaType: "CIRCLE",
            sink: "https://example.com/notif",
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            latitude: 47.48627616952785,
            longitude: 19.07915612501993,
            radius: 2000
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        const fetchedSubscription = await client.geofencing.get(subscription.eventSubscriptionId as string);

        expect(fetchedSubscription.eventSubscriptionId).toBeTruthy();

        subscription.delete();
    });
    
    it("should get all event subscriptions", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            areaType: "CIRCLE",
            sink: "https://example.com/notif",
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            latitude: 47.48627616952785,
            longitude: 19.07915612501993,
            radius: 2000
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        const fetchedSubscriptions = await client.geofencing.getAll();

        expect(fetchedSubscriptions.length).toBeGreaterThanOrEqual(0);

        subscription.delete();
    });

    it("should delete an event subscription", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            areaType: "CIRCLE",
            sink: "https://example.com/notif",
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            latitude: 47.48627616952785,
            longitude: 19.07915612501993,
            radius: 2000
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        subscription.delete();

        try {
            await client.geofencing.get(subscription.eventSubscriptionId);
            expect(true).toBe(false);
        } catch (error){
            expect(error).toBeDefined();
        }
    });
});
