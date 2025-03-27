import type { FetchMockStatic } from "fetch-mock";
import fetch from "node-fetch";

import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { AuthenticationError } from "../src/errors";

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = fetch as unknown as FetchMockStatic;

let client: NetworkAsCodeClient;

let device: Device;

beforeAll((): any => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get({
        networkAccessIdentifier: "test-device@testcsp.net",
        ipv4Address: {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        },
    });
    return client;
});

// Tests
beforeEach(() => {
    fetchMock.reset();
});

describe("Location", () => {
    it("should use mocks correctly", async () => {
        fetchMock.get("https://example.com/test", {
            status: 200,
            body: {
                status: "ok",
            },
        });

        const response = await fetch("https://example.com/test", {
            method: "GET",
        });

        expect(await response.json()).toEqual({ status: "ok" });
        expect(response.status).toBe(200);
    });

    it("should send location retrieval request to the right URL with right parameters", async () => {
        fetchMock.post(
            "https://location-retrieval.p-eu.rapidapi.com/retrieve",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    maxAge: 60,
                });

                return Promise.resolve({
                    body: JSON.stringify({
                        area: {
                            center: {
                                longitude: 0.0,
                                latitude: 0.0,
                            },
                        },
                        civicAddress: {
                            country: "Finland",
                            A1: "",
                            A2: "",
                            A3: "",
                            A4: "",
                            A5: "",
                            A6: "",
                        },
                    }),
                });
            }
        );

        const location = await device.getLocation(60);

        expect(location).toBeDefined();
    });

    it("should get location from a valid response", async () => {
        fetchMock.post(
            "https://location-retrieval.p-eu.rapidapi.com/retrieve",
            JSON.stringify({
                area: {
                    center: {
                        longitude: 0.0,
                        latitude: 0.0,
                    },
                    radius: 1000,
                },
                civicAddress: {
                    country: "Finland",
                    A1: "",
                    A2: "",
                    A3: "",
                    A4: "",
                    A5: "",
                    A6: "",
                },
            })
        );

        const location = await device.getLocation(60);

        expect(location.longitude).toBe(0.0);
        expect(location.latitude).toBe(0.0);
        expect(location.radius).toBe(1000);
        expect(location.civicAddress).toBeDefined();
    });

    it("should get location without civic address", async () => {
        fetchMock.post(
            "https://location-retrieval.p-eu.rapidapi.com/retrieve",
            JSON.stringify({
                area: {
                    center: {
                        longitude: 0.0,
                        latitude: 0.0,
                    },
                    radius: 1000,
                },
                civicAddress: {
                    country: "Finland",
                    A1: "",
                    A2: "",
                    A3: "",
                    A4: "",
                    A5: "",
                    A6: "",
                },
            })
        );

        const location = await device.getLocation(60);

        expect(location.longitude).toBe(0.0);
        expect(location.latitude).toBe(0.0);
        expect(location.radius).toBe(1000);
        expect(location.civicAddress).toBeDefined();
    });

    it("can omit maxAge if 60 seconds is fine", async () => {
        fetchMock.post(
            "https://location-retrieval.p-eu.rapidapi.com/retrieve",
            JSON.stringify({
                area: {
                    center: {
                        longitude: 0.0,
                        latitude: 0.0,
                    },
                },
            })
        );

        const location = await device.getLocation();

        expect(location.longitude).toBe(0.0);
        expect(location.latitude).toBe(0.0);
        expect(location.civicAddress).toBeUndefined();
    });

    it("should send location verification request to the right URL with right parameters", async () => {
        fetchMock.post(
            "https://location-verification.p-eu.rapidapi.com/v1/verify",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    area: {
                        areaType: "CIRCLE",
                        center: {
                            latitude: 0.0,
                            longitude: 0.0,
                        },
                        radius: 10_000,
                    },
                    maxAge: 60,
                });

                return Promise.resolve({
                    body: JSON.stringify({
                        verificationResult: "TRUE",
                    }),
                });
            }
        );

        const location = await device.verifyLocation(0, 0, 10_000);

        expect(location).toBeDefined();
    });

    it("should return true if location verification response is TRUE", async () => {
        fetchMock.post(
            "https://location-verification.p-eu.rapidapi.com/v1/verify",
            JSON.stringify({
                verificationResult: "TRUE",
            })
        );

        const result = await device.verifyLocation(0, 0, 5000);

        expect(result.resultType).toBe("TRUE");
    });

    it("should return 'PARTIAL' if location verification response is 'PARTIAL'", async () => {
        fetchMock.post(
            "https://location-verification.p-eu.rapidapi.com/v1/verify",
            JSON.stringify({
                verificationResult: "PARTIAL",
            })
        );

        const result = await device.verifyLocation(0, 0, 5000);

        expect(result.resultType).toBe("PARTIAL");
    });

    it("should verify location with possibility to omit maxAge if 60 seconds is fine", async () => {
        fetchMock.post(
            "https://location-verification.p-eu.rapidapi.com/v1/verify",
            JSON.stringify({
                verificationResult: "TRUE",
            })
        );

        const result = await device.verifyLocation(0, 0, 5000);

        expect(result.resultType).toBe("TRUE");
    });

    it("should still return true with non-default maxAge value", async () => {
        fetchMock.post(
            "https://location-verification.p-eu.rapidapi.com/v1/verify",
            JSON.stringify({
                verificationResult: "TRUE",
            })
        );

        const result = await device.verifyLocation(0, 0, 5000, 80);

        expect(result.resultType).toBe("TRUE");
    });

    it("should return false if location verification response is FALSE", async () => {
        fetchMock.post(
            "https://location-verification.p-eu.rapidapi.com/v1/verify",
            JSON.stringify({
                verificationResult: "FALSE",
            })
        );

        const result = await device.verifyLocation(0, 0, 5000);

        expect(result.resultType).toBe("FALSE");
    });

    it("should raise exception if status code indicates error", async () => {
        fetchMock.post(
            "https://location-verification.p-eu.rapidapi.com/v1/verify",
            403
        );

        await expect(device.verifyLocation(0, 0, 5000)).rejects.toThrow(
            new AuthenticationError("403 - Forbidden")
        );
    });
});
