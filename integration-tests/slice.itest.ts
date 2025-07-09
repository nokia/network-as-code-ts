import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { ProxyAgent } from "proxy-agent";
import fetch from "node-fetch";
import { Slice } from "../src/models/slice";
import { Device } from "../src/models/device";
import { configureClient, configureNotificationServerUrl } from "./configClient";

let client: NetworkAsCodeClient;
let notificationUrl: string;
let agent : ProxyAgent

beforeAll((): any => {
    client = configureClient();
    notificationUrl = configureNotificationServerUrl();
    agent = new ProxyAgent();
});

describe("Slicing", () => {
    let device: Device;
    beforeEach(async () => {
        device = client.devices.get({
            networkAccessIdentifier: "test-device@testcsp.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            phoneNumber: `+3670${
                Math.floor(Math.random() * (999999 - 123456 + 1)) + 123456
            }`,
        });

    });

    afterEach(async () => {
        // Clean up, currently nothing
    });

    test("should get a device", () => {
        expect(device.networkAccessIdentifier).toEqual(
            "test-device@testcsp.net"
        );
    });

    test("should create a slice", async () => {
        const random = Math.floor(Math.random() * 1000) + 1;

        const new_slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: `slice${random}`,
                notificationAuthToken: "my-token",
            }
        );

        expect(new_slice.networkIdentifier.mcc).toEqual("236");
        expect(new_slice.networkIdentifier.mnc).toEqual("30");

        new_slice.delete();
    });


    // Temporarly skip because of the ISE in attachment endpoint,
    // the test.failing couldn't mark it as failing test for some reason, so test.skip is used for now
    test("should get slices", async () => {
        const slices = await client.slices.getAll();
        expect(slices.length).toBeGreaterThanOrEqual(0);
    });

    test("should create a slice with other optional args", async () => {
        const slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: "sdk-integration-slice-2",
                notificationAuthToken: "my-token",
                areaOfService: {
                    polygon: [
                        {
                            latitude: 47.344,
                            longitude: 104.349,
                        },
                        {
                            latitude: 35.344,
                            longitude: 76.619,
                        },
                        {
                            latitude: 12.344,
                            longitude: 142.541,
                        },
                        {
                            latitude: 19.43,
                            longitude: 103.53,
                        },
                    ],
                },
                sliceDownlinkThroughput: {
                    guaranteed: 3415,
                    maximum: 1234324,
                },
                sliceUplinkThroughput: {
                    guaranteed: 3415,
                    maximum: 1234324,
                },
                deviceUplinkThroughput: {
                    guaranteed: 3415,
                    maximum: 1234324,
                },
                deviceDownlinkThroughput: {
                    guaranteed: 3415,
                    maximum: 1234324,
                },
                maxDataConnections: 10,
                maxDevices: 5,
            }
        );

        expect(slice.maxDevices).toEqual(5);
        expect(slice.maxDataConnections).toEqual(10);

        await slice.delete();
    });

    test("should get a slice", async () => {
        const random = Math.floor(Math.random() * 1000) + 1;

        const slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: `slice${random}`,
                notificationAuthToken: "my-token",
            }
        );

        const fetchedSlice = await client.slices.get(slice.name as string);
        expect(slice.sid).toEqual(fetchedSlice.sid);

        await slice.delete();
    });

    test("should mark a deleted slice's state as 'Deleted'", async () => {
        const random = Math.floor(Math.random() * 1000) + 1;

        const slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: `slice${random}`,
                notificationAuthToken: "my-token",
            }
        );

        await slice.delete();

        await slice.refresh();

        expect(slice.state).toEqual("DELETED");
    });

    test("should get attachments", async () => {
        const attachments: any = await client.slices.getAllAttachments();
        expect(attachments.length).toBeGreaterThanOrEqual(0);
    });

    // NOTE: This test takes a long time to execute, since it must wait for slice updates
    // if you are in a rush, add a temporary skip here
    test("Should deactivate and delete with notification polling", async() => {
        let lastNotification: {[key: string]: any};
        let data: {[key: string]: any}[];
        const random = Math.floor(Math.random() * 1000) + 1;

        const slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "444444" },
            `${notificationUrl}/notify`,
            {
                name: `slice${random}`,
                notificationAuthToken: "my-token",
            }
        );

        const pollNotifications = async () => {
            let notification = await fetch(`${notificationUrl}/network-slice/${slice.name}`,
            {
                method: "GET",
                agent: agent
            });

            data = await notification.json() as { [key: string]: any }[];

            return data[data.length-1];
        }

        // Wait for the notifiction to take action
        await new Promise(resolve => setTimeout(resolve, 120 * 1000));

        lastNotification = await pollNotifications()

        expect(lastNotification['current_slice_state']).toEqual("AVAILABLE");

        slice.activate()
        
        // Poll the notification server until slice is operating
        while (lastNotification['current_slice_state'] === "AVAILABLE") {
            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
            
            lastNotification = await pollNotifications()
        }

        expect(lastNotification['current_slice_state']).toEqual("OPERATING");
        slice.deactivate()

        // Poll the notification server until slice is deactivated
        while (lastNotification['current_slice_state'] === "OPERATING") {
            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
            
            lastNotification = await pollNotifications()
        }

        expect(lastNotification['current_slice_state']).toEqual("AVAILABLE");
        slice.delete()

         // Poll the notification server until slice is deactivated
        while (lastNotification['current_slice_state'] === "AVAILABLE") {
            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
            
            lastNotification = await pollNotifications()
        }

        expect(lastNotification['current_slice_state']).toEqual("DELETED");

        await fetch(`${notificationUrl}/network-slice/${slice.name}`,
            {
                method: "DELETE",
                agent: agent
            });

        }, 720000);

    // NOTE: This test takes a long time to execute, since it must wait for slice updates
    // if you are in a rush, add a temporary skip here
    test.skip("should attach device to slice and detach with all params", async () => {
        const random = Math.floor(Math.random() * 1000) + 1;

        const slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: `slice${random}`,
                notificationAuthToken: "my-token",
            }
        );

        const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

        await slice.waitFor("AVAILABLE");

        expect(slice.state).toEqual("AVAILABLE");

        await slice.activate();

        await slice.waitFor("OPERATING");

        expect(slice.state).toEqual("OPERATING");

        const newAttachment = await slice.attach(
            device,
            "c8974e592c2fa383d4a3960714",
            "https://example.com/notifications",
            {
                apps: {
                    os: "97a498e3-fc92-5c94-8986-0333d06e4e47",
                    apps: ["ENTERPRISE"],
                },
            }
        );

        await sleep(30000);

        const attachment: any = await client.slices.getAttachment(
            newAttachment["nac_resource_id"]
        );

        expect(attachment["nac_resource_id"]).toEqual(
            newAttachment["nac_resource_id"]
        );

        await slice.detach(device);

        await slice.deactivate();

        await slice.waitFor("AVAILABLE");

        expect(slice.state).toEqual("AVAILABLE");

        await slice.delete();
    }, 720000);

    // NOTE: This test takes a long time to execute, since it must wait for slice updates
    // if you are in a rush, add a temporary skip here
    test.skip("should attach device to slice and detach with manadatory params", async () => {
        const random = Math.floor(Math.random() * 1000) + 1;

        const slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: `slice${random}`,
                notificationAuthToken: "my-token",
            }
        );

        const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

        await slice.waitFor("AVAILABLE");

        expect(slice.state).toEqual("AVAILABLE");

        await slice.activate();

        await slice.waitFor("OPERATING");

        expect(slice.state).toEqual("OPERATING");

        const device = client.devices.get({
            phoneNumber: "+3637123456",
        });

        const newAttachment = await slice.attach(device);

        await sleep(30000);

        const attachment: any = await client.slices.getAttachment(
            newAttachment["nac_resource_id"]
        );

        expect(attachment["nac_resource_id"]).toEqual(
            newAttachment["nac_resource_id"]
        );

        await slice.detach(device);

        await slice.deactivate();

        await slice.waitFor("AVAILABLE");

        expect(slice.state).toEqual("AVAILABLE");

        await slice.delete();
    }, 720000);
});
