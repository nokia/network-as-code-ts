import fetchMock from '@fetch-mock/jest';

import { NetworkAsCodeClient } from "../src";

jest.mock("node-fetch", () => {
	const nodeFetch = jest.requireActual("node-fetch");
	// only needed if your application makes use of Response, Request
	// or Headers classes directly
	Object.assign(fetchMock.config, {
		fetch: nodeFetch,
		Response: nodeFetch.Response,
		Request: nodeFetch.Request,
		Headers: nodeFetch.Headers,
	});
	return fetchMock.fetchHandler;
});

let client: NetworkAsCodeClient;

beforeAll((): any => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    return client;
});

describe("Qos", () => {
    beforeEach(() => {
        fetchMock.mockReset();
    });
    afterEach(() => {
        fetchMock.unmockGlobal();
    })

    test("should throw an Error if no identifier is provided", () => {
        try {
            client.devices.get({});
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
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
            sink: "https://endpoint.example.com/sink",
            sinkCredential: {
                credentialType: "ACCESSTOKEN"
            },
            qosStatus: "REQUESTED",
            statusInfo: "DURATION_EXPIRED",
            startedAt: "2024-06-18T09:46:58.213Z",
            expiresAt: "2024-06-18T09:47:58.213Z",
            duration: 3600,
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
            sink: "https://example.com/notifications",
            sinkCredential: {
                credentialType:"ACCESSTOKEN", 
                accessToken: "c8974e592c2fa383d4a3960714", 
                accessTokenType: 'bearer', 
                accessTokenExpiresUtc: new Date("2025-01-23T10:40:30.616Z")},
            duration: 3600
        };

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
            },
               { response: JSON.stringify(mockResponse)
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
        expect(session.duration).toEqual(3600);
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

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
            },
               { response: JSON.stringify(mockResponse)
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
            devicePorts: {
                ports: [80, 3000],
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

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
            },
               { response: JSON.stringify(mockResponse)
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
        expect(session.devicePorts?.ports).toEqual([80, 3000]);
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
            devicePorts: {
                ranges: [{ from: 80, to: 3000 }],
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

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
            },
               { response: JSON.stringify(mockResponse)
            }
        );

        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            devicePorts: { ranges: [{ from: 80, to: 3000 }] },
        });
        expect(session.status).toEqual(mockResponse["qosStatus"]);
        expect(session.devicePorts?.ranges).toEqual([{ from: 80, to: 3000 }]);
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

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
            },
               { response: JSON.stringify(mockResponse)
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

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
            },
               { response: JSON.stringify(mockResponse)
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
            duration: 60,
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

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
            },
               { response: JSON.stringify(mockResponse)
            }
        );

        const session = await device.createQodSession("QOS_L", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            duration: 60,
        });
        expect(session.status).toEqual(mockResponse["qosStatus"]);
        expect(session.duration).toEqual(60);
    });

    test("should extend a session's duration", async () => {
        let mockFetchResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
            qosProfile: "QOS_L",
            device: {
                networkAccessIdentifier: "testuser@open5glab.net",
            },
            applicationServer: {
                ipv4Address: "5.6.7.8",
            },
            qosStatus: "REQUESTED",
            startedAt: "2024-06-18T09:46:58.213Z",
            expiresAt: "2024-06-18T09:47:58.213Z",
            duration: 60,
        };

        let mockResponse = {
            sessionId: "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
            qosProfile: "QOS_L",
            device: {
                networkAccessIdentifier: "testuser@open5glab.net",
            },
            applicationServer: {
                ipv4Address: "5.6.7.8",
            },
            qosStatus: "REQUESTED",
            startedAt: "2024-06-18T09:46:58.213Z",
            expiresAt: "2024-06-18T09:47:58.213Z",
            duration: 260,
        };

        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions/08305343-7ed2-43b7-8eda-4c5ae9805bd0",
            JSON.stringify(mockFetchResponse)
        );

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions/08305343-7ed2-43b7-8eda-4c5ae9805bd0/extend",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual({
                    requestedAdditionalDuration: 200,
                });
            },
               { response: JSON.stringify(mockResponse)
            }
        );

        let session = await client.sessions.get(
            "08305343-7ed2-43b7-8eda-4c5ae9805bd0"
        );
        expect(session.duration).toEqual(60);
        await session.extendSession(200);
        expect(session.duration).toEqual(260);
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
            webhook: {
                notificationUrl: "https://example.com/notifications",
                notificationAuthToken: "Bearer c8974e592c2fa383d4a3960714",
            },
        };

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
            },
               { response: JSON.stringify(mockResponse)
            }
        );

        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            sink: "https://example.com/notifications",
            sinkCredential: {
                credentialType:"ACCESSTOKEN", 
                accessToken: "c8974e592c2fa383d4a3960714", 
                accessTokenType: "bearer", 
                accessTokenExpiresUtc: new Date("2025-01-23T10:40:30.616Z")}
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

        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions/1234",
            JSON.stringify(mockResponse)
        );

        const sessions = await client.sessions.get("1234");
        expect(sessions.id).toEqual("1234");
    });

    test("should get all sessions", async () => {
        let device = client.devices.get({ phoneNumber: "9382948473" });

        let mockResponse = [
            {
                sessionId: "1234",
                qosProfile: "QOS_L",
                device: {
                    phoneNumber: "9382948473",
                },
                qosStatus: "BLA",
                expiresAt: 1641494400,
                startedAt: 0,
            },
        ];

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/retrieve-sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual({
                    device: {
                        phoneNumber: "9382948473",
                    },
                });
            },
               { response: JSON.stringify(mockResponse)
            }
        );

        const sessions = await device.sessions();
        expect(sessions[0].id).toEqual("1234");
        expect(sessions[0].device.phoneNumber).toEqual(device.phoneNumber);
    });

    test("should clear all device's sessions", async () => {
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
                    networkAccessIdentifier: "testuser@open5glab.net",
                },
                qosStatus: "BLA",
                expiresAt: 1641494400,
                startedAt: 0,
            },
        ];

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/retrieve-sessions",
            (_: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual({
                    device: {
                        networkAccessIdentifier: "testuser@open5glab.net",
                    },
                });
            },
               { response: JSON.stringify(mockResponse)
            }
        );

        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions?networkAccessIdentifier=testuser@open5glab.net",
            JSON.stringify(mockResponse)
        );

        const sessions = await device.sessions();
        expect(sessions.length).toEqual(2);

        fetchMock.mockGlobal().delete(
            `https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions/${mockResponse[0].sessionId}`,
            JSON.stringify({})
        );

        fetchMock.mockGlobal().delete(
            `https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions/${mockResponse[1].sessionId}`,
            JSON.stringify({})
        );
        await device.clearSessions();
        expect(device.sessions.length).toEqual(0)

        const requests = fetchMock.callHistory.calls();
        expect(requests.length).toEqual(4);
        
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
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/sessions/1234",
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

    test("should return empty array for non-existent device", async () => {
        let device = client.devices.get({
            networkAccessIdentifier: "nonexistent-user@open5glab.net",
        });

        const mockRequestBody = {
            device: {
                networkAccessIdentifier: "nonexistent-user@open5glab.net",
            },
        };

        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/quality-on-demand/v1/retrieve-sessions",
            (res: any, req: any) => {
                expect(req.method).toBe("POST");
                const requestBody = JSON.parse(req.body);
                expect(requestBody).toEqual(mockRequestBody);
                expect(res.status).toEqual(404);
                expect(res.detail).toEqual("QoS subscription not found");
                return JSON.stringify("QoS subscription not found");
            }
        );
        const sessions = await device.sessions();
        expect(sessions.length).toEqual(0);
    });
});
