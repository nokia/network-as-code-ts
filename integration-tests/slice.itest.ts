import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import { NetworkAsCodeClient } from "../src/network_as_code/client";
import "dotenv/config";

let client: NetworkAsCodeClient;

beforeAll((): any => {
    const NAC_TOKEN = process.env["NAC_TOKEN"];
    client = new NetworkAsCodeClient(
        NAC_TOKEN ? NAC_TOKEN : "TEST_TOKEN",
        true
    );
    return client;
});

describe("Qos", () => {
    let device: any;
    beforeEach(() => {
        device = client.devices.get(
            "test-device@testcsp.net",
            {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            undefined,
            "9382948473"
        );
    });
    test("should get a device", () => {
        expect(device.networkAccessIdentifier).toEqual(
            "test-device@testcsp.net"
        );
    });

    test("should create a slice", async () => {
        const slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { service_type: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: "sdk-integration-slice-2",
                notificationAuthToken: "my-token",
            }
        );

        expect(slice.name).toEqual("sdk-integration-slice-2");
    });

    test("should get slices", async () => {
        const slices = await client.slices.getAll();
        expect(slices.length).toBeGreaterThanOrEqual(0);
    });

    test("should create a slice with other optional args", async () => {
        const slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { service_type: "eMBB", differentiator: "444444" },
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

        expect(slice.name).toEqual("sdk-integration-slice-2");
    });

    test("should get a slice", async () => {
        const newSlice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { service_type: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: "sdk-integration-slice-3",
                notificationAuthToken: "my-token",
            }
        );

        const fetchedSlice = await client.slices.get(newSlice.name as string);
        expect(newSlice.sid).toEqual(fetchedSlice.sid);
    });

    test("should mark a deleted slice's state as 'Deleted'", async () => {
        const slice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { service_type: "eMBB", differentiator: "444444" },
            "https://notify.me/here",
            {
                name: "sdk-integration-slice-3",
                notificationAuthToken: "my-token",
            }
        );

        await slice.delete();

        await slice.refresh();

        expect(slice.state).toEqual("DELETED");
    });
});
