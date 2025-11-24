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
        ipv4Address: {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80
        },
        ipv6Address: "2041:0000:140F::875B:131B",
        phoneNumber: "3637123456"
    });
    return client;
});

beforeEach(() => {
    fetchMock.mockReset();
});

afterEach(() => {
    fetchMock.unmockGlobal();
});

describe("Sim Swap", () => {
    it("should get the latest sim swap date", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/sim-swap/sim-swap/v0/retrieve-date"
        fetchMock.mockGlobal().post(
            url,
            {
                body: {
                    latestSimChange: "2024-06-19T10:36:59.976Z"
                }
            },
            { 
                body: {
                    phoneNumber: "3637123456"
                }
            },
        );

        const latestSimSwapDate = await device.getSimSwapDate();
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "3637123456"
            }
        });
        expect(latestSimSwapDate).toEqual(
            new Date(Date.parse("2024-06-19T10:36:59.976Z"))
        );
    });

    it("should throw InvalidParameter error for no phone number - getSimSwapDate()", async () => {
        const device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net"
        });
        try {
            await device.getSimSwapDate();
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidParameterError);
        }
    });

    it("should return null if the response doesn't contain latestSimChange", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/sim-swap/sim-swap/v0/retrieve-date"
        fetchMock.mockGlobal().post(
            url,
            {
               body: JSON.stringify({}) 
            },
            { 
                body: {
                    phoneNumber: "3637123456"
                }
            },
        );

        const response = await device.getSimSwapDate();
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "3637123456"
            }
        });
        expect(response).toBeNull();
    });

    it("should handle null", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/sim-swap/sim-swap/v0/retrieve-date"
        fetchMock.mockGlobal().post(
            url,
            {
               body: {
                    latestSimSwapDate: null
                } 
            },
            { 
                body: {
                    phoneNumber: "3637123456" 
                }
            },
        );

        const latestSimSwapDate = await device.getSimSwapDate();
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "3637123456"
            }
        });
        expect(latestSimSwapDate).toBeNull();
    });

    it("should raise exception on missing phone number", async () => {
        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.getSimSwapDate()
        ).rejects.toThrow(InvalidParameterError);
    });

    it("should verify sim swap without max age", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/sim-swap/sim-swap/v0/check"
        fetchMock.mockGlobal().post(
            url,
            {
               body: {
                    swapped: true
                } 
            },
            { 
                body: {
                    phoneNumber: "3637123456" 
                }
            },
        );

        expect(await device.verifySimSwap()).toEqual(true);
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "3637123456"
            }
        });
    });

    it("should verify sim swap with max age", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/sim-swap/sim-swap/v0/check"
        fetchMock.mockGlobal().post(
            url,
            {
               body: {
                    swapped: true
                } 
            },
            { 
                body: {
                    phoneNumber: "3637123456",
                    maxAge: 120
                }
            },
        );

        expect(await device.verifySimSwap(120)).toEqual(true);
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "3637123456",
                maxAge: 120
            }
        });
    });

    it("verify should raise exception on missing phone number", async () => {
        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.verifySimSwap()
        ).rejects.toThrow(InvalidParameterError);
    });
});
