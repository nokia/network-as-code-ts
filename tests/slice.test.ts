import fetchMock from "jest-fetch-mock";

import {
    APIError,
    AuthenticationError,
    NotFoundError,
    ServiceError,
} from "../src/errors";
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { Slice } from "../src/models/slice";

fetchMock.enableMocks();

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
    fetchMock.resetMocks();
});

describe("Slicing", () => {
    it("should create a slice", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(MOCK_SLICE));

        const newSlice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { service_type: "eMBB", differentiator: "AAABBB" },
            "https://example.com/notify",
            { name: "sliceone" }
        );

        expect(newSlice.name).toBe("sliceone");
        expect(newSlice.state).toBe(MOCK_SLICE.state);
        expect(fetchMock).toHaveBeenCalledWith(
            "https://network-slicing.p-eu.rapidapi.com/slices",
            expect.anything()
        );
    });

    it("should get all slices", async () => {
        const mockSlices = [MOCK_SLICE];

        fetchMock.mockResponseOnce(JSON.stringify(mockSlices));

        const slices = await client.slices.getAll();
        expect(slices[0].name).toEqual("sliceone");
        expect(fetchMock).toHaveBeenCalledWith(
            "https://network-slicing.p-eu.rapidapi.com/slices",
            expect.anything()
        );
    });

    it("should get a slice", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(MOCK_SLICE));

        const slice = await client.slices.get(MOCK_SLICE.slice.name);
        expect(slice.sid).toEqual(MOCK_SLICE.csi_id);
        expect(fetchMock).toHaveBeenCalledWith(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            expect.anything()
        );
    });

    it("should activate a slice", async () => {
        fetchMock.mockIf(
            "https://network-slicing.p-eu.rapidapi.com/slices/sliceone/activate"
        );

        const slice = new Slice(
            client.api,
            "NOT_SUBMITTED",
            {
                service_type: "eMBB",
                differentiator: "AAABBB",
            },
            { mcc: "236", mnc: "30" },
            {
                name: "sliceone",
            }
        );

        await slice.activate();

        expect(fetchMock).toHaveBeenCalledWith(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}/activate`,
            expect.anything()
        );
    });

    it("should deactivate a slice", async () => {
        fetchMock.mockIf(
            "https://network-slicing.p-eu.rapidapi.com/slices/sliceone/deactivate"
        );

        const slice = new Slice(
            client.api,
            "NOT_SUBMITTED",
            {
                service_type: "eMBB",
                differentiator: "AAABBB",
            },
            { mcc: "236", mnc: "30" },
            {
                name: "sliceone",
            }
        );

        await slice.deactivate();

        expect(fetchMock).toHaveBeenCalledWith(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}/deactivate`,
            expect.anything()
        );
    });

    it("should delete a slice", async () => {
        fetchMock.mockIf(
            "https://network-slicing.p-eu.rapidapi.com/slices/sliceone",
            (req) => {
                expect(req.method).toBe("DELETE");
                return Promise.resolve({});
            }
        );

        const slice = new Slice(
            client.api,
            "NOT_SUBMITTED",
            {
                service_type: "eMBB",
                differentiator: "AAABBB",
            },
            { mcc: "236", mnc: "30" },
            {
                name: "sliceone",
            }
        );

        await slice.delete();

        expect(fetchMock).toHaveBeenCalledWith(
            `https://network-slicing.p-eu.rapidapi.com/slices/${MOCK_SLICE.slice.name}`,
            expect.anything()
        );
    });

    it("should attach a device to slice", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(MOCK_SLICE));

        const slice = await client.slices.get(MOCK_SLICE["slice"]["name"]);

        fetchMock.mockIf(
            `https://network-slice-device-attach-norc.p-eu.rapidapi.com/slice/${slice.name}/attach`,
            (req) => {
                expect(req.method).toBe("POST");
                expect(req.body).toEqual(
                    Buffer.from(
                        JSON.stringify({
                            phoneNumber: "+12065550100",
                            notificationUrl: "https://notify.me/here",
                        })
                    )
                );
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

        await slice.attach(device, "https://notify.me/here");
    });

    it("should detach a device from slice", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(MOCK_SLICE));

        const slice = await client.slices.get(MOCK_SLICE["slice"]["name"]);

        fetchMock.mockIf(
            `https://network-slice-device-attach-norc.p-eu.rapidapi.com/slice/${slice.name}/detach`,
            (req) => {
                expect(req.method).toBe("POST");
                expect(req.body).toEqual(
                    Buffer.from(
                        JSON.stringify({
                            phoneNumber: "+12065550100",
                            notificationUrl: "https://notify.me/here",
                        })
                    )
                );
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
        fetchMock.mockResponseOnce(JSON.stringify({ message: "Not Found" }), {
            status: 404,
        });

        try {
            await client.slices.get(MOCK_SLICE["slice"]["name"]);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
        }
    });

    test("should throw Authentication Error for 403 HTTPError", async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({ message: "Authentication Error" }),
            {
                status: 403,
            }
        );

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
        fetchMock.mockResponseOnce(
            JSON.stringify({ message: "Authentication Error" }),
            {
                status: 401,
            }
        );

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
        fetchMock.mockResponseOnce(JSON.stringify({ message: "API Error" }), {
            status: 400, // All 4XX error code except 401, 403, and 404.
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
        fetchMock.mockResponseOnce(JSON.stringify({ message: "API Error" }), {
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
