import fetchMock from '@fetch-mock/jest';
import { NetworkAsCodeClient } from "../src";
import { Device, DeviceIpv4Addr } from "../src/models/device";

import {
    APIError,
    AuthenticationError,
    InvalidParameterError,
    NotFoundError,
    ServiceError
} from "../src/errors";
import { Slice } from "../src/models/slice";

jest.mock("node-fetch", () => {
	const nodeFetch = jest.requireActual("node-fetch");
	Object.assign(fetchMock.config, {
		fetch: nodeFetch,
		Response: nodeFetch.Response,
		Request: nodeFetch.Request,
		Headers: nodeFetch.Headers,
	});
	return fetchMock.fetchHandler;
});

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

beforeAll((): any => {
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
    return client;
});

beforeEach(() => {
    fetchMock.mockReset();
});

afterEach(() => {
    fetchMock.unmockGlobal();
});

describe("Slicing", () => {
    it("should create a slice only with mandatory params", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/slice/v1/slices",
            JSON.stringify(MOCK_SLICE)
        );

        const newSlice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "AAABBB" },
            "https://example.com/notify"
        );

        expect(newSlice.state).toBe(MOCK_SLICE.state);
    });

    it("should create a slice with optional args", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/slice/v1/slices",
            JSON.stringify(MOCK_SLICE)
        );

        const newSlice = await client.slices.create(
            { mcc: "236", mnc: "30" },
            { serviceType: "eMBB", differentiator: "AAABBB" },
            "https://example.com/notify",
            {
                name: "sliceone",
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
                notificationAuthToken: "my-token",
            }
        );

        expect(newSlice.name).toBe("sliceone");
        expect(newSlice.state).toBe(MOCK_SLICE.state);
    });

    it("should get all slices", async () => {
        const mockSlices = [MOCK_SLICE];

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
            { response: JSON.stringify([
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
            }
        );

        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/slice/v1/slices",
            JSON.stringify(mockSlices)
        );

        const slices = await client.slices.getAll();
        expect(slices[0].name).toEqual("sliceone");
    });

    it("should return empty array if no slices found", async () => {
        const mockSlices: any = [];

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
            JSON.stringify([])
        );

        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/slice/v1/slices",
            JSON.stringify(mockSlices)
        );

        const slices = await client.slices.getAll();
        expect(slices.length).toEqual(0);
    });

    it("should get a slice", async () => {
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE)
        );

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
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

    it("should get a slice with no differentiator", async () => {
        const MOCK_SLICE_RES = {
            slice: {
                name: "sliceone",
                notificationUrl: "",
                notificationAuthToken: "samplenotificationtoken",
                networkIdentifier: {
                    mcc: "236",
                    mnc: "30",
                },
                sliceInfo: {
                    serviceType: "1",
                },
            },
            csi_id: "csi_368",
            state: "PENDING",
        };
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE_RES.slice.name}`,
            JSON.stringify(MOCK_SLICE_RES)
        );

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
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
            ]) 
        );

        const slice = await client.slices.get(MOCK_SLICE_RES.slice.name);
        expect(slice.sid).toEqual(MOCK_SLICE_RES.csi_id);
    });

    it("should get wait until polling completion", async () => {
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE),
            { repeat: 1 }
        );

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
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

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE),
            { repeat: 1 }            
        );

        let modifiedSlice = { ...slice, state: "AVAILABLE" };

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(modifiedSlice),
            { repeat: 1 }
        );

        await slice.waitFor();

        expect(slice.state).toEqual("AVAILABLE");
    }, 72000);

    it("should get wait for other states than AVAILABLE", async () => {
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE),
            { repeat: 1 }
        );

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
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

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE),
            { repeat: 1 }
        );

        let modifiedSlice = { ...slice, state: "AVAILABLE" };

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(modifiedSlice),
            { repeat: 1 }
        );

        await slice.waitFor();

        expect(slice.state).toEqual("AVAILABLE");

        modifiedSlice = { ...slice, state: "OPERATING" };

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(modifiedSlice),
            { repeat: 1 }
        );

        await slice.waitFor("OPERATING");

        expect(slice.state).toEqual("OPERATING");
    }, 72000);

    it("should activate a slice", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/sliceone/activate",
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

        expect(fetchMock.mockGlobal).toBeTruthy();
    });

    it("should deactivate a slice", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/sliceone/deactivate",
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
        expect(fetchMock.mockGlobal).toBeTruthy();
    });

    it("should delete a slice", async () => {
        fetchMock.mockGlobal().delete(
            "https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/sliceone",
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

        expect(fetchMock.mockGlobal).toBeTruthy();
    });

    it("should attach a device to slice with all params", async () => {
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE)
        );

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
            JSON.stringify([
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

        fetchMock.mockGlobal().post(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
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
                                .publicPort
                        },
                        ipv6Address: device.ipv6Address
                    },
                    sliceId: "sliceone",
                    trafficCategories: {
                        apps: {
                            os: "97a498e3-fc92-5c94-8986-0333d06e4e47",
                            apps: ["ENTERPRISE"]
                        }
                    },
                    webhook: {
                        notificationUrl: "https://example.com/notifications",
                        notificationAuthToken: "c8974e592c2fa383d4a3960714"
                    }
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    nac_resource_id: "attachment-1"
                })
            })
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

    it("should attach a device to slice with only mandatory params", async () => {
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE)
        );

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
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
            ])
        );

        const slice = await client.slices.get(MOCK_SLICE["slice"]["name"]);

        fetchMock.mockGlobal().post(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    device: {
                        phoneNumber: device.phoneNumber,
                    },
                    sliceId: "sliceone",
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    nac_resource_id: "attachment-1",
                }),
            })
            }
        );
        const device = client.devices.get({
            phoneNumber: "+3637123456",
        });
        await slice.attach(device);
    });

    it("should throw an error if a device phone number is not given for attachment", async () => {
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE)
        );

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
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
            ])
        );

        const slice = await client.slices.get(MOCK_SLICE["slice"]["name"]);

        fetchMock.mockGlobal().post(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    device: {
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    sliceId: "sliceone",
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    nac_resource_id: "attachment-1",
                }),
            })
            }
        );
        const device = client.devices.get({
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
        });

        try {
            await slice.attach(device);
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidParameterError);
        }
    });

    it("should detach a device from slice", async () => {
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
            JSON.stringify(MOCK_SLICE)
        );

        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
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

        fetchMock.mockGlobal().delete(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments/attachment-1`,
            JSON.stringify({})
        );

        await slice.detach(device);
    });

    test("should throw a NotFoundError if attachment id is not found", async () => {
        try {
            fetchMock.mockGlobal().get(
                `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
                JSON.stringify(MOCK_SLICE)
            );
            fetchMock.mockGlobal().get(
                `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
                JSON.stringify([])
            );
            const slice = await client.slices.get(MOCK_SLICE["slice"]["name"]);
            fetchMock.mockGlobal().delete(
                `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments/attachment-1`,
                JSON.stringify({})
            );
            await slice.detach(device);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
        }
    });

    it("should get application attachment", async () => {
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments/4f11d02d-e661-4e4b-b623-55292a431c60`,
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
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/device-attach/v0/attachments`,
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
        fetchMock.mockGlobal().get(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices/${MOCK_SLICE.slice.name}`,
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
        fetchMock.mockGlobal().post(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices`, {
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
        fetchMock.mockGlobal().post(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices`, {
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
        fetchMock.mockGlobal().post(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices`, {
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
        fetchMock.mockGlobal().post(
            `https://network-as-code.p-eu.rapidapi.com/slice/v1/slices`, {
            status: 500
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
