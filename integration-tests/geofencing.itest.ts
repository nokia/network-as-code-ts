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
        phoneNumber:"+99999991000",
    });
    notificationUrl = configureNotificationServerUrl();
    agent = new ProxyAgent()
});

describe("Geofencing", () => {
    it.skip("should subscribe for geofencing with areaType Circle and event area entered", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: `${notificationUrl}/notify`,
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            area: {areaType: "CIRCLE", center: {latitude: 47.48627616952785, longitude: 19.07915612501993}, radius: 2000},
            initialEvent: true
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();
        expect(subscription.area).toEqual({"areaType": "CIRCLE","center": {"latitude": 47.48627616952785, "longitude": 19.07915612501993}, "radius": 2000});
        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            });

        const data: any = await notification.json();
        expect(data).not.toBeNull();
        expect(data[0].data.area.areaType).toEqual("CIRCLE");
        expect(data[0].data.area.center.latitude).toEqual(47.48627616952785);
        expect(data[0].data.area.radius).toEqual(2000);


        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent 
            });

        await subscription.delete();
    },20 * 1000);

    it.skip("should subscribe for geofencing with areaType POI and event area entered", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: `${notificationUrl}/notify`,
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            area: {areaType: "POI", poiName: "StatueOfLiberty"},
            initialEvent: true
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();
        expect(subscription.area).toEqual({"areaType": "POI", "poiName": "StatueOfLiberty"})

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            });

        const data: any = await notification.json();

        expect(data).not.toBeNull();
        expect(data[0].data.area.areaType).toEqual("POI");
        expect(data[0].data.area.poiName).toEqual("StatueOfLiberty");

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent 
            });

        await subscription.delete();
    },20 * 1000);

    it.skip("should subscribe for geofencing event area entered using event type enum", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: `${notificationUrl}/notify`,
            types: [EventType.AREA_ENTERED],
            area: {areaType: "CIRCLE", center: {latitude: 47.48627616952785, longitude: 19.07915612501993}, radius: 2000},
            initialEvent: true
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            });

        const data: any = await notification.json();

        expect(data).not.toBeNull();
        expect(data[0].data.area.areaType).toEqual("CIRCLE");


        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent 
            });

        await subscription.delete();
    },20 * 1000);

    it.skip("should subscribe for geofencing event area left", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: `${notificationUrl}/notify`,
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-left"],
            area: {areaType: "POI", poiName: "StatueOfLiberty"},
            initialEvent: true
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data: any = await notification.json();

        expect(data).not.toBeNull();
        expect(data[0].data.area.areaType).toEqual("POI");

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        await subscription.delete();
    },20* 1000);

    it.skip("should subscribe for geofencing event with plain credential", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: `${notificationUrl}/notify`,
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-left"],
            area: {areaType: "CIRCLE", center: {latitude: 47.48627616952785, longitude: 19.07915612501993}, radius: 2000},
            sinkCredential: {
                credentialType:"PLAIN",
                identifier: "client-id",
                secret: "client-secret"
            },
            initialEvent: true
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data: any = await notification.json();

        expect(data).not.toBeNull();
        expect(data[0].data.area.areaType).toEqual("CIRCLE");

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        await subscription.delete();
    }, 20 * 1000);

    it.skip("should subscribe for geofencing event with accesstoken credential", async () => {
        const expirationDate = new Date(Date.now() + 5 * 60 * 60 * 1000);
        expirationDate.setMilliseconds(0);
        const subscription = await client.geofencing.subscribe(device, {
            sink: `${notificationUrl}/notify`,
            types: [EventType.AREA_LEFT],
            area: {areaType: "POI", poiName: "StatueOfLiberty"},
            sinkCredential: {
                credentialType:"ACCESSTOKEN",
                accessToken: "some-access-token",
                accessTokenType: "bearer",
                accessTokenExpiresUtc: expirationDate
            },
            initialEvent: true
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        // Fetching the subscription notification
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        let notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            {
                method: "GET",
                agent: agent
            }
        );

        const data: any = await notification.json();

        expect(data).not.toBeNull();
        expect(data[0].data.area.areaType).toEqual("POI");

        // Deleting the subscription notification
        notification = await fetch(`${notificationUrl}/geofencing-subscriptions/${subscription.eventSubscriptionId}`,
            { 
                method: 'DELETE',
                agent: agent
            });

        await subscription.delete();
    }, 20 * 1000);

    it.skip("should get an event subscription", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: "https://example.com/notif",
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            area: {areaType: "CIRCLE", center: {latitude: 47.48627616952785, longitude: 19.07915612501993}, radius: 2000}
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        const fetchedSubscription = await client.geofencing.get(subscription.eventSubscriptionId as string);

        expect(fetchedSubscription.eventSubscriptionId).toBeTruthy();

        await subscription.delete();
    });
    
    it.skip("should get all event subscriptions", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: "https://example.com/notif",
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            area: {areaType: "CIRCLE", center: {latitude: 47.48627616952785, longitude: 19.07915612501993}, radius: 2000}
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        const fetchedSubscriptions = await client.geofencing.getAll();

        expect(fetchedSubscriptions.length).toBeGreaterThanOrEqual(0);

        await subscription.delete();
    });

    it.skip("should delete an event subscription", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: "https://example.com/notif",
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            area: {areaType: "CIRCLE", center: {latitude: 47.48627616952785, longitude: 19.07915612501993}, radius: 2000}
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        await subscription.delete();

        try {
            await client.geofencing.get(subscription.eventSubscriptionId);
            expect(true).toBe(false);
        } catch (error){
            expect(error).toBeDefined();
        }
    });
});
