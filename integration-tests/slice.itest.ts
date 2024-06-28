import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { Slice } from "../src/models/slice";
import { Device } from "../src/models/device";

let client: NetworkAsCodeClient;

beforeAll((): any => {
    const NAC_TOKEN = process.env["NAC_TOKEN"];
    client = new NetworkAsCodeClient(
        NAC_TOKEN ? NAC_TOKEN : "TEST_TOKEN",
        true
    );
    return client;
});

describe("Slicing", () => {
    let device: Device;
    let slice: Slice;
    const random = Math.floor(Math.random() * 1000) + 1;
    beforeEach(async () => {
        device = client.devices.get({
            networkAccessIdentifier: "test-device@testcsp.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            phoneNumber: `3670${
                Math.floor(Math.random() * (999999 - 123456 + 1)) + 123456
            }`,
        });

        slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: `slice${random}`,
                notificationAuthToken: "my-token",
            }
        );
    });

    afterEach(async () => {
        await slice.delete();
    });

    test("should get a device", () => {
        expect(device.networkAccessIdentifier).toEqual(
            "test-device@testcsp.net"
        );
    });

    test("should create a slice", async () => {
        const new_slice = slice;
        expect(new_slice.networkIdentifier.mcc).toEqual("236");
        expect(new_slice.networkIdentifier.mnc).toEqual("30");
    });

    test.failing("should modify a slice", async () => {
        expect(slice.maxDataConnections).toBeUndefined();
        expect(slice.maxDevices).toBeUndefined();

        await slice.modify({
            sliceDownlinkThroughput: { guaranteed: 10, maximum: 10 },
            sliceUplinkThroughput: { guaranteed: 10, maximum: 10 },
            deviceDownlinkThroughput: { guaranteed: 10, maximum: 10 },
            deviceUplinkThroughput: { guaranteed: 10, maximum: 10 },
            maxDataConnections: 12,
            maxDevices: 3,
        });

        expect(slice.maxDataConnections).toEqual(12);
        expect(slice.maxDevices).toEqual(3);
        expect(slice.sliceUplinkThroughput).toBeTruthy();
        expect(slice.sliceDownlinkThroughput).toBeTruthy();
        expect(slice.deviceUplinkThroughput).toBeTruthy();
        expect(slice.deviceDownlinkThroughput).toBeTruthy();
    });

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
        const newSlice = slice;
        const fetchedSlice = await client.slices.get(newSlice.name as string);
        expect(newSlice.sid).toEqual(fetchedSlice.sid);
    });

    test("should mark a deleted slice's state as 'Deleted'", async () => {
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
    test("should deactivate and delete", async () => {
        const slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: "sdk-integration-slice-3",
                notificationAuthToken: "my-token",
            }
        );

        await slice.waitFor("AVAILABLE");

        expect(slice.state).toEqual("AVAILABLE");

        await slice.activate();

        await slice.waitFor("OPERATING");

        expect(slice.state).toEqual("OPERATING");

        await slice.deactivate();

        await slice.waitFor("AVAILABLE");

        expect(slice.state).toEqual("AVAILABLE");

        await slice.delete();
    }, 720000);

    // NOTE: This test takes a long time to execute, since it must wait for slice updates
    // if you are in a rush, add a temporary skip here
    test("should attach device to slice and detach", async () => {
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
});
