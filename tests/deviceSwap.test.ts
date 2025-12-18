import fetchMock from '@fetch-mock/jest';

import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { InvalidParameterError } from "../src/errors";

jest.mock("node-fetch", () => {
	const nodeFetch = jest.requireActual("node-fetch");
	// only needed if your application makes use of Response, Request
	// or Headers classes directly
	Object.assign(fetchMock.config, {
		fetch: nodeFetch,
		Response: nodeFetch.Response,
		Request: nodeFetch.Request,
		Headers: nodeFetch.Headers
	});
	return fetchMock.fetchHandler;
});

let client: NetworkAsCodeClient;

let device: Device;

beforeAll((): any => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get({
        phoneNumber: "+346661113334"
    });
    return client;
});

beforeEach(() => {
    fetchMock.mockReset();
});

afterEach(() => {
    fetchMock.unmockGlobal();
});

describe("Device Swap", () => {
    it("should get the latest device swap date", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/device-swap/device-swap/v1/retrieve-date"
        fetchMock.mockGlobal().post(
            url,
            {
                body: {
                    latestDeviceChange: "2024-06-19T10:36:59.976Z"
                }
            },
            {
                body: {
                    phoneNumber: "+346661113334"
                }
            }
        );

        const latestDeviceSwapDate = await device.getDeviceSwapDate();
        expect(latestDeviceSwapDate).toEqual(
            new Date(Date.parse("2024-06-19T10:36:59.976Z"))
        );
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "+346661113334"
            }
        });
    });

    it("should throw InvalidParameter error for no phone number - getDeviceSwapDate()", async () => {
        const device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net"
        });
        try {
            await device.getDeviceSwapDate();
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidParameterError);
        }
    });

    it("should return null if the response doesn't contain latestDeviceChange", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/device-swap/device-swap/v1/retrieve-date"
        fetchMock.mockGlobal().post(
            url,
            {
                body: JSON.stringify({})
            },
            {
                body: {
                    phoneNumber: "+346661113334"
                }
            }
        );

        const response = await device.getDeviceSwapDate();
        expect(response).toBeNull();
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "+346661113334"
            }
        });
    });

    it("should handle null", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/device-swap/device-swap/v1/retrieve-date"
        fetchMock.mockGlobal().post(
            url,
            {
                body: {
                    latestDeviceChange: null
                }
            },
            {
                body: {
                    phoneNumber: "+346661113334"
                }
            }
        );

        const latestDeviceSwapDate = await device.getDeviceSwapDate();
        expect(latestDeviceSwapDate).toBeNull();
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "+346661113334"
            }
        });
    });

    it("get date should raise exception on missing phone number - getDeviceSwapDate()", async () => {
        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.getDeviceSwapDate()
        ).rejects.toThrow(InvalidParameterError);
    });

    it("should verify device swap without max age", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/device-swap/device-swap/v1/check"
        fetchMock.mockGlobal().post(
            url,
            {
                body: {
                    swapped: true
                }
            },
            {
                body: {
                    phoneNumber: "+346661113334"
                }
            }
        );

        expect(await device.verifyDeviceSwap()).toEqual(true);
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "+346661113334"
            }
        });
    });

    it("should verify device swap with max age", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/device-swap/device-swap/v1/check"
        fetchMock.mockGlobal().post(
            url,
            {
                body: {
                    swapped: true
                }
            },
            {
                body: {
                    phoneNumber: "+346661113334",
                    maxAge: 120
                }
            }
        );

        expect(await device.verifyDeviceSwap(120)).toEqual(true);
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "+346661113334",
                maxAge: 120
            }
        });
    });

    it("verify should raise exception on missing phone number - verifyDeviceSwap()", async () => {
        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.verifyDeviceSwap()
        ).rejects.toThrow(InvalidParameterError);
    });
});
