import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();
import { beforeAll, describe, expect, test } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { NetworkAsCodeClient } from "../src";

let client: NetworkAsCodeClient;

beforeAll((): any => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    return client;
});

describe("Qos", () => {
    let baseUrl = "https://quality-of-service-on-demand.p-eu.rapidapi.com";
    let headers = {
        "X-RapidAPI-Host": "quality-of-service-on-demand.nokia.rapidapi.com",
        "X-RapidAPI-Key": "TEST_TOKEN",
        "content-type": "application/json",
    };
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("should get a device", () => {
        let device = client.devices.get("testuser@open5glab.net", {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        });
        expect(device.networkAccessIdentifier).toEqual(
            "testuser@open5glab.net"
        );
    });

    test("should create a session", async () => {
        let device = client.devices.get(
            "testuser@open5glab.net",
            {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            undefined,
            "9382948473"
        );
        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
            qosProfile: "QOS_L",
            qosStatus: "REQUESTED",
            startedAt: 1691671102,
            expiresAt: 1691757502,
        };

        let mockRequestBody = {
            qosProfile: "QOS_L",
            device: {
                ipv4Address: {
                    publicAddress: "1.1.1.2",
                    privateAddress: "1.1.1.2",
                    publicPort: 80,
                },
                networkAccessIdentifier: "testuser@open5glab.net",
                phoneNumber: "9382948473",
            },
            applicationServer: {
                ipv4Address: "5.6.7.8",
            },
        };

        fetchMock.mockOnce(async (req: any) => {
            expect(req.method).toBe("POST");
            const requestBody = await JSON.parse(req.body);
            expect(requestBody).toEqual(mockRequestBody);
            return JSON.stringify(mockResponse);
        });

        const session = await device.createQodSession(
            "QOS_L",
            "5.6.7.8",
        );
        expect(session.status).toEqual(mockResponse["qosStatus"]);
    });

    test("should create a session with ipv6", async () => {
        let device = client.devices.get(
            "testuser@open5glab.net",
            {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            "2041:0000:140F::875B:131B",
            "9382948473"
        );
        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
            qosProfile: "QOS_L",
            qosStatus: "REQUESTED",
            startedAt: 1691671102,
            expiresAt: 1691757502,
        };

        let mockRequestBody = {
            qosProfile: "QOS_L",
            device: {
                ipv4Address: {
                    publicAddress: "1.1.1.2",
                    privateAddress: "1.1.1.2",
                    publicPort: 80,
                },
                ipv6Address: "2041:0000:140F::875B:131B",
                networkAccessIdentifier: "testuser@open5glab.net",
                phoneNumber: "9382948473",
            },
            applicationServer: {
                ipv4Address: "5.6.7.8",
                ipv6Address: "2041:0000:140F::875B:131B",
            },
        };

        fetchMock.mockOnce(async (req: any) => {
            expect(req.method).toBe("POST");
            const requestBody = await JSON.parse(req.body);
            expect(requestBody).toEqual(mockRequestBody);
            return JSON.stringify(mockResponse);
        });

        const session = await device.createQodSession(
            "QOS_L",
            "5.6.7.8",
            "2041:0000:140F::875B:131B"
        );
        expect(session.status).toEqual(mockResponse["qosStatus"]);
    });

    test("should get one session", async () => {
        let mockResponse = {
            sessionId: "1234",
            qosProfile: "QOS_L",
            qosStatus: "BLA",
            expiresAt: 1641494400,
            startedAt: 0,
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const sessions = await client.sessions.get("1234");
        expect(sessions.id).toEqual("1234");
        expect(fetchMock).toHaveBeenCalledWith(baseUrl + "/sessions/1234", {
            method: "GET",
            headers,
        });
    });

    test("should get all sessions", async () => {
        let device = client.devices.get("testuser@open5glab.net", {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        });

        let mockResponse = [
            {
                sessionId: "1234",
                qosProfile: "QOS_L",
                qosStatus: "BLA",
                expiresAt: 1641494400,
                startedAt: 0,
            },
        ];

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const sessions = await device.sessions();
        expect(sessions[0].id).toEqual("1234");
        expect(fetchMock).toHaveBeenCalledWith(
            baseUrl +
                "/sessions?networkAccessIdentifier=testuser@open5glab.net",
            {
                method: "GET",
                headers,
            }
        );
    });

    test("should not create a session without ip address", async () => {
        let device = client.devices.get(
            "testuser@open5glab.net",
            {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            undefined,
            "9382948473"
        );

        expect(device.createQodSession("QOS_L")).rejects.toThrow(
            "ValueError: At least one of IP parameters must be provided"
        );
    });

    test("should not get sessions as unauthenticated user", async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({ message: "Invalid API key." }),
            {
                status: 403,
            }
        );

        try {
            await client.sessions.get("1234");
            expect(true).toBe(false);
        } catch (error) {
            expect(true).toBe(true);
        }
    });
});
