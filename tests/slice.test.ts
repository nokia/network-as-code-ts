import type { FetchMockStatic } from "fetch-mock";
import fetch from "node-fetch";

import {
    APIError,
    AuthenticationError,
    NotFoundError,
    ServiceError,
} from "../src/errors";
import { NetworkAsCodeClient } from "../src";
import { Device, DeviceIpv4Addr } from "../src/models/device";
import { Slice } from "../src/models/slice";

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = fetch as unknown as FetchMockStatic;

let client: NetworkAsCodeClient;
let device: Device;

const MOCK_SLICE = {
    slice: {
        name: "sliceone",
        notificationUrl: "",
        notificationAuthToken: "samplenotificationtoken",
        networkIdentifier: {
            mcc: "236",
            mnc: "30",
        },
        sliceInfo: {
            serviceType: 1,
            differentiator: "AAABBB",
        },
        areaOfService: {
            polygon: [
                {
                    lat: 47.344,
                    lon: 104.349,
                },
                {
                    lat: 35.344,
                    lon: 76.619,
                },
                {
                    lat: 12.344,
                    lon: 142.541,
                },
                {
                    lat: 19.43,
                    lon: 103.53,
                },
            ],
        },
        maxDataConnections: 12,
        maxDevices: 3,
        sliceDownlinkThroughput: {
            guaranteed: 0,
            maximum: 0,
        },
        sliceUplinkThroughput: {
            guaranteed: 0,
            maximum: 0,
        },
        deviceDownlinkThroughput: {
            guaranteed: 0,
            maximum: 0,
        },
        deviceUplinkThroughput: {
            guaranteed: 0,
            maximum: 0,
        },
    },
    startPollingAt: 1691482014,
    csi_id: "csi_368",
    order_id: "6ed9b1b3-a6c5-49c2-8fa7-5cf70ba8fc23",
    administrativeState: undefined,
    state: "PENDING",
};

beforeAll(() => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get({
        ipv4Address: {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        },
        ipv6Address: "2041:0000:140F::875B:131B",
        phoneNumber: "3637123456",
    });
});

beforeEach(() => {
    fetchMock.reset();
});

describe("Slicing", () => {
    it("should create a slice", async () => {
        fetchMock.post(
            "https://network-slicing.p-eu.rapidapi.com/slices",
            JSON.stringify(MOCK_SLICE)
        );

        const newSlice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "AAABBB" },
            "https://example.com/notify",
            { name: "sliceone" }
        );

        expect(newSlice.name).toBe("sliceone");
        expect(newSlice.state).toBe(MOCK_SLICE.state);
    });

    it("should modify a slice", async () => {
        const slicePayload = {
            networkIdentifier: {
                mnc: "30",
                mcc: "236",
            },
            sliceInfo: {
                serviceType: "eMBB",
                differentiator: "AAABBB",
            },
            notificationUrl: "https://example.com/notify",
            name: "slicefour",
        };

        const sliceResponseOriginal = {
            slice: {
                name: "slicefour",
                notificationUrl: "",
                notificationAuthToken: "samplenotificationtoken",
                networkIdentifier: {
                    mcc: "236",
                    mnc: "30",
                },
                sliceInfo: {
                    serviceType: "eMBB",
                    differentiator: "AAABBB",
                },
                maxDataConnections: 12,
                maxDevices: 3,
            },
            startPollingAt: 1691482014,
            csi_id: "csi_989",
            order_id: "6ed9b1b3-a6c5-49c2-8fa7-5cf70ba8fc23",
            administrativeState: null,
            state: "PENDING",
        };

        const sliceModificationPayload = {
            networkIdentifier: {
                mnc: "30",
                mcc: "236",
            },
            sliceInfo: {
                serviceType: "eMBB",
                differentiator: "AAABBB",
            },
            notificationUrl: "https://example.com/notify",
            name: "slicefour",
            maxDataConnections: 12,
            maxDevices: 3,
            sliceDownlinkThroughput: {
                guaranteed: 10.0,
                maximum: 10.0,
            },
            sliceUplinkThroughput: {
                guaranteed: 10.0,
                maximum: 10.0,
            },
            deviceUplinkThroughput: {
                guaranteed: 10.0,
                maximum: 10.0,
            },
            deviceDownlinkThroughput: {
                guaranteed: 10.0,
                maximum: 10.0,
            },
        };

        const sliceResponseModified = {
            slice: {
                name: "slicefour",
                notificationUrl: "",
                notificationAuthToken: "samplenotificationtoken",
                networkIdentifier: {
                    mcc: "236",
                    mnc: "30",
                },
                sliceInfo: {
                    serviceType: "eMBB",
                    differentiator: "AAABBB",
                },
                maxDataConnections: 12,
                maxDevices: 3,
                sliceDownlinkThroughput: {
                    guaranteed: 10.0,
                    maximum: 10.0,
                },
                sliceUplinkThroughput: {
                    guaranteed: 10.0,
                    maximum: 10.0,
                },
                deviceDownlinkThroughput: {
                    guaranteed: 10.0,
                    maximum: 10.0,
                },
                deviceUplinkThroughput: {
                    guaranteed: 10.0,
                    maximum: 10.0,
                },
            },
            startPollingAt: 1691482014,
            csi_id: "csi_989",
            order_id: "6ed9b1b3-a6c5-49c2-8fa7-5cf70ba8fc23",
            administrativeState: null,
            state: "PENDING",
        };

        fetchMock.post(
            "https://network-slicing.p-eu.rapidapi.com/slices",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual(slicePayload);

                return Promise.resolve({
                    body: JSON.stringify(sliceResponseOriginal),
                });
            }
        );

        const slice = await client.slices.create(
            {
                mnc: "30",
                mcc: "236",
            },
            { serviceType: "eMBB", differentiator: "AAABBB" },
            "https://example.com/notify",
            { name: "slicefour" }
        );

        expect(slice.maxDataConnections).toBeUndefined();
        expect(slice.maxDevices).toBeUndefined();

        fetchMock.put(
            `https://network-slicing.p-eu.rapidapi.com/slices/${slice.name}`,
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual(
                    sliceModificationPayload
                );

                return Promise.resolve({
                    body: JSON.stringify(sliceResponseModified),
                });
            }
        );
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

    it("should get all slices", async () => {
        const mockSlices = [MOCK_SLICE];

        fetchMock.get(
            `https://device-application-attach.p-eu.rapidapi.com/attachments`,
            JSON.stringify([
                {
                    nac_resource_id: "attachment-1",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-2",
                    resource: {
                        device: {
                            phoneNumber: "09213284343",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-3",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sdk-integration-slice-5",
                    },
                },
            ])
        );

        fetchMock.get(
            "https://network-slicing.p-eu.rapidapi.com/slices",
            JSON.stringify(mockSlices)
        );

        const slices = await client.slices.getAll();
        expect(slices[0].name).toEqual("sliceone");
    });

    it("should get a slice", async () => {
        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE)
        );

        fetchMock.get(
            `https://device-application-attach.p-eu.rapidapi.com/attachments`,
            JSON.stringify([
                {
                    nac_resource_id: "attachment-1",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-2",
                    resource: {
                        device: {
                            phoneNumber: "09213284343",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-3",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sdk-integration-slice-5",
                    },
                },
            ])
        );

        const slice = await client.slices.get(MOCK_SLICE.slice.name);
        expect(slice.sid).toEqual(MOCK_SLICE.csi_id);
    });

    it("should get wait until polling completion", async () => {
        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE),
            { repeat: 1 }
        );

        fetchMock.get(
            `https://device-application-attach.p-eu.rapidapi.com/attachments`,
            JSON.stringify([
                {
                    nac_resource_id: "attachment-1",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-2",
                    resource: {
                        device: {
                            phoneNumber: "09213284343",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-3",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sdk-integration-slice-5",
                    },
                },
            ])
        );

        const slice = await client.slices.get(MOCK_SLICE.slice.name);

        expect(slice.state).toEqual("PENDING");

        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE),
            { overwriteRoutes: false, repeat: 1 }
        );

        let modifiedSlice = { ...slice, state: "AVAILABLE" };

        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(modifiedSlice),
            { overwriteRoutes: false, repeat: 1 }
        );

        await slice.waitFor();

        expect(slice.state).toEqual("AVAILABLE");
    }, 72000);

    it("should get wait for other states than AVAILABLE", async () => {
        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE),
            { repeat: 1 }
        );

        fetchMock.get(
            `https://device-application-attach.p-eu.rapidapi.com/attachments`,
            JSON.stringify([
                {
                    nac_resource_id: "attachment-1",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-2",
                    resource: {
                        device: {
                            phoneNumber: "09213284343",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-3",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sdk-integration-slice-5",
                    },
                },
            ])
        );

        const slice = await client.slices.get(MOCK_SLICE.slice.name);

        expect(slice.state).toEqual("PENDING");

        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE),
            { overwriteRoutes: false, repeat: 1 }
        );

        let modifiedSlice = { ...slice, state: "AVAILABLE" };

        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(modifiedSlice),
            { overwriteRoutes: false, repeat: 1 }
        );

        await slice.waitFor();

        expect(slice.state).toEqual("AVAILABLE");

        modifiedSlice = { ...slice, state: "OPERATING" };

        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(modifiedSlice),
            { overwriteRoutes: false, repeat: 1 }
        );

        await slice.waitFor("OPERATING");

        expect(slice.state).toEqual("OPERATING");
    }, 72000);

    it("should activate a slice", async () => {
        fetchMock.post(
            "https://network-slicing.p-eu.rapidapi.com/slices/sliceone/activate",
            {}
        );

        const slice = new Slice(
            client.api,
            "NOT_SUBMITTED",
            {
                serviceType: "eMBB",
                differentiator: "AAABBB",
            },
            { mcc: "236", mnc: "30" },
            "https://example.com/notify",
            {
                name: "sliceone",
            }
        );

        await slice.activate();

        expect(fetchMock).toBeTruthy();
    });

    it("should deactivate a slice", async () => {
        fetchMock.post(
            "https://network-slicing.p-eu.rapidapi.com/slices/sliceone/deactivate",
            {}
        );

        const slice = new Slice(
            client.api,
            "NOT_SUBMITTED",
            {
                serviceType: "eMBB",
                differentiator: "AAABBB",
            },
            { mcc: "236", mnc: "30" },
            "https://example.com/notify",
            {
                name: "sliceone",
            }
        );

        await slice.deactivate();

        expect(fetchMock).toBeTruthy();
    });

    it("should delete a slice", async () => {
        fetchMock.delete(
            "https://network-slicing.p-eu.rapidapi.com/slices/sliceone",
            {}
        );

        const slice = new Slice(
            client.api,
            "NOT_SUBMITTED",
            {
                serviceType: "eMBB",
                differentiator: "AAABBB",
            },
            { mcc: "236", mnc: "30" },
            "https://example.com/notify",
            {
                name: "sliceone",
            }
        );

        await slice.delete();

        expect(fetchMock).toBeTruthy();
    });

    it("should attach a device to slice", async () => {
        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE)
        );

        fetchMock.get(
            `https://device-application-attach.p-eu.rapidapi.com/attachments`,
            JSON.stringify([
                {
                    nac_resource_id: "attachment-1",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-2",
                    resource: {
                        device: {
                            phoneNumber: "09213284343",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-3",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sdk-integration-slice-5",
                    },
                },
            ])
        );

        const slice = await client.slices.get(MOCK_SLICE["slice"]["name"]);

        fetchMock.post(
            `https://device-application-attach.p-eu.rapidapi.com/attachments`,
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    device: {
                        phoneNumber: device.phoneNumber,
                        ipv4Address: {
                            publicAddress: (
                                device.ipv4Address as DeviceIpv4Addr
                            ).publicAddress,
                            privateAddress: (
                                device.ipv4Address as DeviceIpv4Addr
                            ).privateAddress,
                            publicPort: (device.ipv4Address as DeviceIpv4Addr)
                                .publicPort,
                        },
                        ipv6Address: device.ipv6Address,
                    },
                    sliceId: "sliceone",
                    trafficCategories: {
                        apps: {
                            os: "97a498e3-fc92-5c94-8986-0333d06e4e47",
                            apps: ["ENTERPRISE"],
                        },
                    },
                    webhook: {
                        notificationUrl: "https://example.com/notifications",
                        notificationAuthToken: "c8974e592c2fa383d4a3960714",
                    },
                });

                return Promise.resolve({
                    body: JSON.stringify({
                        nac_resource_id: "attachment-1",
                    }),
                });
            }
        );

        await slice.attach(
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
    });

    it("should detach a device from slice", async () => {
        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE)
        );

        fetchMock.get(
            `https://device-application-attach.p-eu.rapidapi.com/attachments`,
            JSON.stringify([
                {
                    nac_resource_id: "attachment-1",
                    resource: {
                        device: {
                            phoneNumber: "3637123456",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-2",
                    resource: {
                        device: {
                            phoneNumber: "09213284343",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-3",
                    resource: {
                        device: {
                            phoneNumber: "+12065550100",
                        },
                        sliceId: "sdk-integration-slice-5",
                    },
                },
            ])
        );

        const slice = await client.slices.get(MOCK_SLICE["slice"]["name"]);

        fetchMock.delete(
            `https://device-application-attach.p-eu.rapidapi.com/attachments/attachment-1`,
            JSON.stringify({})
        );

        await slice.detach(device);
    });

    it("should get application attachment", async () => {
        fetchMock.get(
            `https://device-application-attach.p-eu.rapidapi.com/attachments/4f11d02d-e661-4e4b-b623-55292a431c60`,
            JSON.stringify({
                nac_resource_id: "4f11d02d-e661-4e4b-b623-55292a431c60",
            })
        );

        const response: any = await client.slices.getAttachment(
            "4f11d02d-e661-4e4b-b623-55292a431c60"
        );
        expect(response.nac_resource_id).toEqual(
            "4f11d02d-e661-4e4b-b623-55292a431c60"
        );
    });

    it("should get all application attachments", async () => {
        fetchMock.get(
            `https://device-application-attach.p-eu.rapidapi.com/attachments`,
            JSON.stringify([
                {
                    nac_resource_id: "attachment-1",
                    resource: {
                        device: {
                            phoneNumber: "12065550100",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-2",
                    resource: {
                        device: {
                            phoneNumber: "09213284343",
                        },
                        sliceId: "sliceone",
                    },
                },
                {
                    nac_resource_id: "attachment-3",
                    resource: {
                        device: {
                            phoneNumber: "12065550100",
                        },
                        sliceId: "sdk-integration-slice-5",
                    },
                },
            ])
        );

        const response: any = await client.slices.getAllAttachments();
        expect(response.length).toEqual(3);
    });

    test("should throw NotFound Error for 404 HTTPError", async () => {
        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            {
                status: 404,
                body: JSON.stringify({ message: "Not Found" }),
            }
        );

        try {
            await client.slices.get(MOCK_SLICE["slice"]["name"]);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
        }
    });

    test("should throw Authentication Error for 403 HTTPError", async () => {
        fetchMock.post(`https://network-slicing.p-eu.rapidapi.com/slices`, {
            status: 403,
            body: JSON.stringify({ message: "Authentication Error" }),
        });

        try {
            await client.slices.create(
                { mcc: "236", mnc: "30" },
                { serviceType: "eMBB", differentiator: "AAABBB" },
                "https://example.com/notify",
                { name: "sliceone" }
            );
        } catch (error) {
            expect(error).toBeInstanceOf(AuthenticationError);
        }
    });

    test("should throw Authentication Error for 401 HTTPError", async () => {
        fetchMock.post(`https://network-slicing.p-eu.rapidapi.com/slices`, {
            status: 401,
            body: JSON.stringify({ message: "Authentication Error" }),
        });

        try {
            await client.slices.create(
                { mcc: "236", mnc: "30" },
                { serviceType: "eMBB", differentiator: "AAABBB" },
                "https://example.com/notify",
                { name: "sliceone" }
            );
        } catch (error) {
            expect(error).toBeInstanceOf(AuthenticationError);
        }
    });

    test("should throw API Error for 4xx HTTPError", async () => {
        fetchMock.post(`https://network-slicing.p-eu.rapidapi.com/slices`, {
            status: 400,
            body: JSON.stringify({ message: "API Error" }),
        });

        try {
            await client.slices.create(
                { mcc: "236", mnc: "30" },
                { serviceType: "eMBB", differentiator: "AAABBB" },
                "https://example.com/notify",
                { name: "sliceone" }
            );
        } catch (error) {
            expect(error).toBeInstanceOf(APIError);
        }
    });

    test("should throw Service Error for 500 HTTPError", async () => {
        fetchMock.post(`https://network-slicing.p-eu.rapidapi.com/slices`, {
            status: 500,
        });

        try {
            await client.slices.create(
                { mcc: "236", mnc: "30" },
                { serviceType: "eMBB", differentiator: "AAABBB" },
                "https://example.com/notify",
                { name: "sliceone" }
            );
        } catch (error) {
            expect(error).toBeInstanceOf(ServiceError);
        }
    });
});
