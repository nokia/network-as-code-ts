import type { FetchMockStatic } from "fetch-mock";
import fetch from "node-fetch";

import {
    APIError,
    AuthenticationError,
    NotFoundError,
    ServiceError,
} from "../src/errors";
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
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
            service_type: 1,
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
    state: "inProgress",
};

beforeAll(() => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get(
        "test-device@testcsp.net",
        {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        },
        undefined,
        "+12065550100"
    );
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
            { service_type: "eMBB", differentiator: "AAABBB" },
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
                service_type: "eMBB",
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
                    service_type: "eMBB",
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
                service_type: "eMBB",
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
                    service_type: "eMBB",
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
            { service_type: "eMBB", differentiator: "AAABBB" },
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
        slice.modify({
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

        const slice = await client.slices.get(MOCK_SLICE.slice.name);
        expect(slice.sid).toEqual(MOCK_SLICE.csi_id);
    });

    it("should activate a slice", async () => {
        fetchMock.post(
            "https://network-slicing.p-eu.rapidapi.com/slices/sliceone/activate",
            {}
        );

        const slice = new Slice(
            client.api,
            "NOT_SUBMITTED",
            {
                service_type: "eMBB",
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
                service_type: "eMBB",
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
                service_type: "eMBB",
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

        const slice = await client.slices.get(MOCK_SLICE["slice"]["name"]);

        fetchMock.post(
            `https://network-slice-device-attach-norc.p-eu.rapidapi.com/slice/${slice.name}/attach`,
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+12065550100",
                    notificationUrl: "https://notify.me/here",
                });
                return Promise.resolve({
                    body: JSON.stringify({
                        id: "string",
                        phoneNumber: "string",
                        deviceStatus: "ATTACHED",
                        progress: "INPROGRESS",
                        slice_id: "string",
                    }),
                });
            }
        );

        await slice.attach(device, "https://notify.me/here");
    });

    it("should detach a device from slice", async () => {
        fetchMock.get(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE)
        );

        const slice = await client.slices.get(MOCK_SLICE["slice"]["name"]);

        fetchMock.post(
            `https://network-slice-device-attach-norc.p-eu.rapidapi.com/slice/${slice.name}/detach`,
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+12065550100",
                    notificationUrl: "https://notify.me/here",
                });
                return Promise.resolve(
                    JSON.stringify({
                        id: "string",
                        phoneNumber: "string",
                        deviceStatus: "ATTACHED",
                        progress: "INPROGRESS",
                        slice_id: "string",
                    })
                );
            }
        );

        await slice.detach(device, "https://notify.me/here");
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
                { service_type: "eMBB", differentiator: "AAABBB" },
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
                { service_type: "eMBB", differentiator: "AAABBB" },
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
                { service_type: "eMBB", differentiator: "AAABBB" },
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
                { service_type: "eMBB", differentiator: "AAABBB" },
                "https://example.com/notify",
                { name: "sliceone" }
            );
        } catch (error) {
            expect(error).toBeInstanceOf(ServiceError);
        }
    });
});
