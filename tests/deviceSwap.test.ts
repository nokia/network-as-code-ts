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
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-swap/v1/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+346661113334"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    latestDeviceChange: "2024-06-19T10:36:59.976Z"
                })
            })
            }
        );

        const latestDeviceSwapDate = await device.getDeviceSwapDate();
        expect(latestDeviceSwapDate).toEqual(
            new Date(Date.parse("2024-06-19T10:36:59.976Z"))
        );
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
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-swap/v1/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+346661113334"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({})
            })
            }
        );

        const response = await device.getDeviceSwapDate();
        expect(response).toBeNull();
    });

    it("should throw InvalidParameter error for no phone number - verifyDeviceSwap()", async () => {
        const device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net"
        });
        try {
            await device.verifyDeviceSwap();
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidParameterError);
        }
    });

    it("should handle null", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-swap/v1/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+346661113334"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    latestDeviceChange: null
                })
            })
            }
        );

        const latestDeviceSwapDate = await device.getDeviceSwapDate();
        expect(latestDeviceSwapDate).toBeNull();
    });

    it("get date should raise exception on missing phone number", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-swap/v1/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    networkAccessIdentifier: "device@testcsp.net"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    latestDeviceChange: null
                })
            })
            }
        );

        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.getDeviceSwapDate()
        ).rejects.toThrow(InvalidParameterError);
    });

    it("should verify device swap without max age", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-swap/v1/check",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+346661113334"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    swapped: true
                })
            })
            }
        );

        expect(await device.verifyDeviceSwap()).toEqual(true);
    });

    it("should verify device swap with max age", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-swap/v1/check",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+346661113334",
                    maxAge: 120
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    swapped: true
                })
            })
            }
        );

        expect(await device.verifyDeviceSwap(120)).toEqual(true);
    });

    it("verify should raise exception on missing phone number", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-swap/v1/check",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    networkAccessIdentifier: "device@testcsp.net"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    latestDeviceChange: null
                })
            })
            }
        );

        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.verifyDeviceSwap()
        ).rejects.toThrow(InvalidParameterError);
    });
});
