import type { FetchMockStatic } from "fetch-mock";
import fetch from "node-fetch";

import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { InvalidParameterError } from "../src/errors";

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = fetch as unknown as FetchMockStatic;

let client: NetworkAsCodeClient;

let device: Device;

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
    fetchMock.reset();
});

describe("Sim Swap", () => {
    it("should get the latest sim swap date", async () => {
        fetchMock.post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "3637123456",
                });
                return Promise.resolve({
                    body: JSON.stringify({
                        latestSimChange: "2024-06-19T10:36:59.976Z",
                    }),
                });
            }
        );

        const latestSimSwapDate = await device.getSimSwapDate();
        expect(latestSimSwapDate).toEqual(new Date(Date.parse("2024-06-19T10:36:59.976Z")));
    });

    it("should handle null", async () => {
        fetchMock.post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "3637123456",
                });
                return Promise.resolve({
                    body: JSON.stringify({
                        latestSimChange: null,
                    }),
                });
            }
        );

        const latestSimSwapDate = await device.getSimSwapDate();
        expect(latestSimSwapDate).toBeNull();
    });

    it("should raise exception on missing phone number", async () => {
        fetchMock.post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    networkAccessIdentifier: "device@testcsp.net",
                });
                return Promise.resolve({
                    body: JSON.stringify({
                        latestSimChange: null,
                    }),
                });
            }
        );

        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        
        expect(async () => await deviceWithoutNumber.getSimSwapDate()).rejects.toThrow(InvalidParameterError);
    });

    it("should verify sim swap without max age", async () => {
        fetchMock.post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/check",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "3637123456",
                });
                return Promise.resolve({
                    body: JSON.stringify({
                        swapped: true,
                    }),
                });
            }
        );

        expect(await device.verifySimSwap()).toEqual(true);
    });

    it("should verify sim swap with max age", async () => {
        fetchMock.post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/check",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "3637123456",
                    maxAge: 120,
                });
                return Promise.resolve({
                    body: JSON.stringify({
                        swapped: true,
                    }),
                });
            }
        );

        expect(await device.verifySimSwap(120)).toEqual(true);
    });

    it("verify should raise exception on missing phone number", async () => {
        fetchMock.post(
            "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0/retrieve-date",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    networkAccessIdentifier: "device@testcsp.net",
                });
                return Promise.resolve({
                    body: JSON.stringify({
                        latestSimChange: null,
                    }),
                });
            }
        );

        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        
        expect(async () => await deviceWithoutNumber.verifySimSwap()).rejects.toThrow(InvalidParameterError);
    });
});
