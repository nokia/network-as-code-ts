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
        fetchMock.mockGlobal().post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "3637123456"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    latestSimChange: "2024-06-19T10:36:59.976Z"
                })
            })
            }
        );

        const latestSimSwapDate = await device.getSimSwapDate();
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
        fetchMock.mockGlobal().post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "3637123456"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({})
            })
            }
        );

        const response = await device.getSimSwapDate();
        expect(response).toBeNull();
    });

    it("should throw InvalidParameter error for no phone number - verifySimSwap()", async () => {
        const device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net"
        });
        try {
            await device.verifySimSwap();
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidParameterError);
        }
    });

    it("should handle null", async () => {
        fetchMock.mockGlobal().post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "3637123456"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    latestSimChange: null
                })
            })
            }
        );

        const latestSimSwapDate = await device.getSimSwapDate();
        expect(latestSimSwapDate).toBeNull();
    });

    it("should raise exception on missing phone number", async () => {
        fetchMock.mockGlobal().post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    networkAccessIdentifier: "device@testcsp.net"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    latestSimChange: null
                })
            })
            }
        );

        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.getSimSwapDate()
        ).rejects.toThrow(InvalidParameterError);
    });

    it("should verify sim swap without max age", async () => {
        fetchMock.mockGlobal().post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/check",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "3637123456"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    swapped: true
                })
            })
            }
        );

        expect(await device.verifySimSwap()).toEqual(true);
    });

    it("should verify sim swap with max age", async () => {
        fetchMock.mockGlobal().post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/check",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "3637123456",
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

        expect(await device.verifySimSwap(120)).toEqual(true);
    });

    it("verify should raise exception on missing phone number", async () => {
        fetchMock.mockGlobal().post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    networkAccessIdentifier: "device@testcsp.net"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    latestSimChange: null
                })
            })
            }
        );

        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.verifySimSwap()
        ).rejects.toThrow(InvalidParameterError);
    });
});
