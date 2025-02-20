import { NetworkAsCodeClient } from "../src";
import { beforeAll, describe, expect} from "@jest/globals";
import "dotenv/config";
import { Device } from "../src/models/device";
import { configureClient } from "./configClient";

let client: NetworkAsCodeClient;
let device: Device;

beforeAll(() => {
    client = configureClient();
    device = client.devices.get({
        phoneNumber:"+3637123456",
    });
});

describe("Geofencing", () => {
    it("should subscribe for geofencing event area entered", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: "https://example.com/notif",
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
            latitude: 47.48627616952785,
            longitude: 19.07915612501993,
            radius: 2000
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        subscription.delete();
    });

    it("should subscribe for geofencing event area left", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: "https://example.com/notif",
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-left"],
            latitude: 47.48627616952785,
            longitude: 19.07915612501993,
            radius: 2000
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();

        subscription.delete();
    });

    it("should subscribe for geofencing event with plain credential", async () => {
        const subscription = await client.geofencing.subscribe(device, {
            sink: "https://example.com/notif",
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
    
        subscription.delete();
    });

    it("should subscribe for geofencing event with accesstoken credential", async () => {
        const expirationDate = new Date(Date.now() + 5 * 60 * 60 * 1000);
        expirationDate.setMilliseconds(0);
        const subscription = await client.geofencing.subscribe(device, {
            sink: "https://example.com/notif",
            types: ["org.camaraproject.geofencing-subscriptions.v0.area-left"],
            latitude: 47.48627616952785,
            longitude: 19.07915612501993,
            radius: 2000,
            sinkCredential: {
                credentialType:"ACCESSTOKEN",
                accessToken: "some-access-token",
                accessTokenType: "bearer",
                accessTokenExpiresUtc: expirationDate
            }
        });

        expect(subscription.eventSubscriptionId).toBeTruthy();
    
        subscription.delete();
    });

    it("should get an event subscription", async () => {
        const subscription = await client.geofencing.subscribe(device, {
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
