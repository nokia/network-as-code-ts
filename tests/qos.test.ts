import type { FetchMockStatic } from "fetch-mock";
import fetch from "node-fetch";
import { beforeAll, describe, expect, test } from "@jest/globals";
import { NetworkAsCodeClient } from "../src";

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = fetch as unknown as FetchMockStatic;

let client: NetworkAsCodeClient;

beforeAll((): any => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    return client;
});

describe("Qos", () => {
    beforeEach(() => {
        fetchMock.reset();
    });

    test("should get a device", () => {
        let device = client.devices.get({
            networkAccessIdentifier: "test-device@testcsp.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
        });

        expect(device.networkAccessIdentifier).toEqual(
            "test-device@testcsp.net"
        );
    });

    test("should create a session", async () => {
        let device = client.devices.get({
            networkAccessIdentifier: "test-device@testcsp.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            phoneNumber: "9382948473",
        });
        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
            qosProfile: "QOS_L",
            device: {
                ipv4Address: {
                    publicAddress: "1.1.1.2",
                    privateAddress: "1.1.1.2",
                    publicPort: 80,
                },
                networkAccessIdentifier: "test-device@testcsp.net",
                phoneNumber: "9382948473",
            },
            applicationServer: {
                ipv4Address: "5.6.7.8",
            },
            qosStatus: "REQUESTED",
            startedAt: "2024-06-18T09:46:58.213Z",
            expiresAt: "2024-06-18T09:47:58.213Z",
        };

        let mockRequestBody = {
            qosProfile: "QOS_L",
            device: {
                ipv4Address: {
                    publicAddress: "1.1.1.2",
                    privateAddress: "1.1.1.2",
                    publicPort: 80,
                },
                networkAccessIdentifier: "test-device@testcsp.net",
                phoneNumber: "9382948473",
            },
            applicationServer: {
                ipv4Address: "5.6.7.8",
            },
            duration: 3600,
        };

        fetchMock.post(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
                return JSON.stringify(mockResponse);
            }
        );

        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
        });
        expect(session.status).toEqual(mockResponse["qosStatus"]);
        expect(session.device.networkAccessIdentifier).toEqual(
            device.networkAccessIdentifier
        );
        expect(session.serviceIpv4).toEqual("5.6.7.8");
        expect(session.serviceIpv6).toBeFalsy();
        expect(session.duration()).toEqual(60);
    });

    test("should create a session with service ipv6", async () => {
        let device = client.devices.get({
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            ipv6Address: "2041:0000:140F::875B:131B",
            phoneNumber: "9382948473",
        });

        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
            qosProfile: "QOS_L",
            device: {
                ipv4Address: {
                    publicAddress: "1.1.1.2",
                    privateAddress: "1.1.1.2",
                    publicPort: 80,
                },
                ipv6Address: "2041:0000:140F::875B:131B",
                phoneNumber: "9382948473",
            },
            applicationServer: {
                ipv4Address: "5.6.7.8",
                ipv6Address: "2041:0000:140F::875B:131B",
            },
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
                phoneNumber: "9382948473",
            },
            applicationServer: {
                ipv4Address: "5.6.7.8",
                ipv6Address: "2041:0000:140F::875B:131B",
            },
            duration: 3600,
        };

        fetchMock.post(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
                return JSON.stringify(mockResponse);
            }
        );

        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual(mockResponse["qosStatus"]);
        expect(session.device.ipv6Address).toEqual(device.ipv6Address);
        expect(session.serviceIpv6).toEqual("2041:0000:140F::875B:131B");
    });

    test("should create a session with device ports", async () => {
        let device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            ipv6Address: "2041:0000:140F::875B:131B",
            phoneNumber: "9382948473",
        });

        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
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
            duration: 3600,
            devicePorts: {
                ports: [80, 3000],
            },
        };

        fetchMock.post(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
                return JSON.stringify(mockResponse);
            }
        );

        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            devicePorts: { ports: [80, 3000] },
        });
        expect(session.status).toEqual(mockResponse["qosStatus"]);
        expect(session.device.ipv6Address).toEqual(device.ipv6Address);
        expect(session.serviceIpv6).toEqual("2041:0000:140F::875B:131B");
    });

    test("should create a session with device port range", async () => {
        let device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            ipv6Address: "2041:0000:140F::875B:131B",
            phoneNumber: "9382948473",
        });

        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
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
            duration: 3600,
            devicePorts: {
                ranges: [{ from: 80, to: 3000 }],
            },
        };

        fetchMock.post(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
                return JSON.stringify(mockResponse);
            }
        );

        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            devicePorts: { ranges: [{ from: 80, to: 3000 }] },
        });
        expect(session.status).toEqual(mockResponse["qosStatus"]);
    });

    test("should create a session with service port", async () => {
        let device = client.devices.get({
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            ipv6Address: "2041:0000:140F::875B:131B",
            phoneNumber: "9382948473",
        });

        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
            qosProfile: "QOS_L",
            device: {
                ipv4Address: {
                    publicAddress: "1.1.1.2",
                    privateAddress: "1.1.1.2",
                    publicPort: 80,
                },
                ipv6Address: "2041:0000:140F::875B:131B",
                phoneNumber: "9382948473",
            },
            applicationServer: {
                ipv4Address: "5.6.7.8",
                ipv6Address: "2041:0000:140F::875B:131B",
            },
            duration: 3600,
            applicationServerPorts: {
                ports: [80, 3000],
            },
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
                phoneNumber: "9382948473",
            },
            applicationServer: {
                ipv4Address: "5.6.7.8",
                ipv6Address: "2041:0000:140F::875B:131B",
            },
            duration: 3600,
            applicationServerPorts: {
                ports: [80, 3000],
            },
        };

        fetchMock.post(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
                return JSON.stringify(mockResponse);
            }
        );

        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            servicePorts: { ports: [80, 3000] },
        });
        expect(session.status).toEqual(mockResponse["qosStatus"]);
        expect(session.servicePorts?.ports).toEqual([80, 3000]);
    });

    test("should create a session with service port range", async () => {
        let device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            ipv6Address: "2041:0000:140F::875B:131B",
            phoneNumber: "9382948473",
        });
        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
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
            duration: 3600,
            applicationServerPorts: {
                ranges: [{ from: 80, to: 3000 }],
            },
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
            duration: 3600,
            applicationServerPorts: {
                ranges: [{ from: 80, to: 3000 }],
            },
        };

        fetchMock.post(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
                return JSON.stringify(mockResponse);
            }
        );

        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            servicePorts: { ranges: [{ from: 80, to: 3000 }] },
        });
        expect(session.status).toEqual(mockResponse["qosStatus"]);
        expect(session.servicePorts?.ranges).toEqual([{ from: 80, to: 3000 }]);
    });

    test("should create a session with duration", async () => {
        let device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            ipv6Address: "2041:0000:140F::875B:131B",
            phoneNumber: "9382948473",
        });
        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
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
            qosStatus: "REQUESTED",
            startedAt: "2024-06-18T09:46:58.213Z",
            expiresAt: "2024-06-18T09:47:58.213Z",
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
            duration: 60,
        };

        fetchMock.post(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
                return JSON.stringify(mockResponse);
            }
        );

        const session = await device.createQodSession("QOS_L", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            duration: 60,
        });
        expect(session.status).toEqual(mockResponse["qosStatus"]);
        expect(session.duration()).toEqual(60);
    });

    test("should create a session with notification info", async () => {
        let device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            ipv6Address: "2041:0000:140F::875B:131B",
            phoneNumber: "9382948473",
        });
        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
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
            duration: 3600,
            notificationUrl: "https://example.com/notifications",
            notificationAuthToken: "Bearer c8974e592c2fa383d4a3960714",
        };

        fetchMock.post(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
                return JSON.stringify(mockResponse);
            }
        );

        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            notificationAuthToken: "c8974e592c2fa383d4a3960714",
            notificationUrl: "https://example.com/notifications",
        });
        expect(session.status).toEqual(mockResponse["qosStatus"]);
    });

    test("should get one session", async () => {
        let mockResponse = {
            sessionId: "1234",
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
            qosStatus: "BLA",
            expiresAt: 1641494400,
            startedAt: 0,
        };

        fetchMock.get(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions/1234",
            JSON.stringify(mockResponse)
        );

        const sessions = await client.sessions.get("1234");
        expect(sessions.id).toEqual("1234");
    });

    test("should get all sessions", async () => {
        let device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            ipv6Address: "2041:0000:140F::875B:131B",
            phoneNumber: "9382948473",
        });

        let mockResponse = [
            {
                sessionId: "1234",
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
                qosStatus: "BLA",
                expiresAt: 1641494400,
                startedAt: 0,
            },
        ];

        fetchMock.get(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions?networkAccessIdentifier=testuser@open5glab.net",
            JSON.stringify(mockResponse)
        );

        const sessions = await device.sessions();
        expect(sessions[0].id).toEqual("1234");
        expect(sessions[0].device.networkAccessIdentifier).toEqual(
            device.networkAccessIdentifier
        );
        expect(sessions[0].device.ipv6Address).toEqual(device.ipv6Address);
    });

    test("should not create a session without ip address", async () => {
        let device = client.devices.get({
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            ipv6Address: "2041:0000:140F::875B:131B",
            phoneNumber: "9382948473",
        });

        expect(
            device.createQodSession("QOS_L", { duration: 60 })
        ).rejects.toThrow(
            "ValueError: At least one of IP parameters must be provided"
        );
    });

    test("should not get sessions as unauthenticated user", async () => {
        fetchMock.get(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions/1234",
            {
                status: 403,
                body: JSON.stringify({ message: "Invalid API key." }),
            }
        );

        try {
            await client.sessions.get("1234");
            expect(true).toBe(false);
        } catch (error) {
            expect(true).toBe(true);
        }
    });

    test("should filter sessions by device network access identifier", async () => {
        let device = client.devices.get({
            networkAccessIdentifier: "testuser@open5glab.net",
        });

        let mockResponse = [
            {
                sessionId: "1234",
                qosProfile: "QOS_L",
                device: {
                    networkAccessIdentifier: "testuser@open5glab.net",
                },
                qosStatus: "BLA",
                expiresAt: 1641494400,
                startedAt: 0,
            },
            {
                sessionId: "12345",
                qosProfile: "QOS_L",
                device: {
                    networkAccessIdentifier: "testuser2@open5glab.net",
                },
                qosStatus: "BLA",
                expiresAt: 1641494400,
                startedAt: 0,
            },
        ];

        fetchMock.get(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions?networkAccessIdentifier=testuser@open5glab.net",
            JSON.stringify(mockResponse)
        );

        const sessions = await device.sessions();
        expect(sessions.length).toEqual(1);
    });

    test("should filter sessions by device phone number", async () => {
        let device = client.devices.get({
            phoneNumber: "+123214343",
        });

        let mockResponse = [
            {
                sessionId: "1234",
                qosProfile: "QOS_L",
                device: {
                    phoneNumber: "+123214343",
                },
                qosStatus: "BLA",
                expiresAt: 1641494400,
                startedAt: 0,
            },
            {
                sessionId: "12345",
                qosProfile: "QOS_L",
                device: {
                    phoneNumber: "+321433443",
                },
                qosStatus: "BLA",
                expiresAt: 1641494400,
                startedAt: 0,
            },
            {
                sessionId: "12346",
                qosProfile: "QOS_L",
                device: {
                    phoneNumber: "+123214343",
                },
                qosStatus: "BLA",
                expiresAt: 1641494400,
                startedAt: 0,
            },
        ];

        fetchMock.get(
            "https://quality-of-service-on-demand.p-eu.rapidapi.com/sessions?phoneNumber=+123214343",
            JSON.stringify(mockResponse)
        );

        const sessions = await device.sessions();
        expect(sessions.length).toEqual(2);
    });
});
