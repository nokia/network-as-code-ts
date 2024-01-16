import fetchMock from "jest-fetch-mock";

import { NetworkAsCodeClient } from "../src/network_as_code/client";
import { Device } from "../src/network_as_code/models/device";

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
    device = client.devices.get("test-device@testcsp.net", {
        publicAddress: "1.1.1.2",
        privateAddress: "1.1.1.2",
        publicPort: 80,
    });
});

beforeEach(() => {
    fetchMock.resetMocks();
});

describe("Slicing", () => {
    it("should create a slice", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(MOCK_SLICE));

        const newSlice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "AAABBB" },
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
});
