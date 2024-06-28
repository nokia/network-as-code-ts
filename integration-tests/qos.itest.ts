import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { Device, DeviceIpv4Addr } from "../src/models/device";

let client: NetworkAsCodeClient;

beforeAll((): any => {
    const NAC_TOKEN = process.env["NAC_TOKEN"];
    client = new NetworkAsCodeClient(
        NAC_TOKEN ? NAC_TOKEN : "TEST_TOKEN",
        true
    );
    return client;
});

describe("Qos", () => {
    let device: Device;
    let deviceWithPhoneNumber: Device;
    beforeEach(async () => {
        try {
            device = client.devices.get({
                networkAccessIdentifier: "test-device@testcsp.net",
                ipv4Address: {
                    publicAddress: "1.1.1.2",
                    privateAddress: "1.1.1.2",
                    publicPort: 80,
                },
                phoneNumber: `3670${
                    Math.floor(Math.random() * (999999 - 123456 + 1)) + 123456
                }`,
            });

            deviceWithPhoneNumber = client.devices.get({
                ipv4Address: {
                    publicAddress: "1.1.1.2",
                    privateAddress: "1.1.1.2",
                    publicPort: 80,
                },
                phoneNumber: `3670${
                    Math.floor(Math.random() * (999999 - 123456 + 1)) + 123456
                }`,
            });
        } catch (error) {
            console.error("Error during setup:", error);
            throw error;
        }
    });

    test("should get a device", () => {
        expect((device.ipv4Address as DeviceIpv4Addr).publicAddress).toEqual(
            "1.1.1.2"
        );
    });

    test("should create a session", async () => {
        const session = await device.createQodSession("QOS_L", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        await session.deleteSession();
    });

    test("should create a session to a device with phone number", async () => {
        const session = await deviceWithPhoneNumber.createQodSession("QOS_L", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual("REQUESTED");
        await session.deleteSession();
    });

    test("should create a session with medium profile", async () => {
        const session = await device.createQodSession("QOS_M", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_M");
        await session.deleteSession();
    });

    test("should create a session with small profile", async () => {
        const session = await device.createQodSession("QOS_S", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_S");
        await session.deleteSession();
    });

    test("should create a session with low latency profile", async () => {
        const session = await device.createQodSession("QOS_E", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_E");
        await session.deleteSession();
    });

    test("should get one session", async () => {
        const session = await device.createQodSession("QOS_E", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        const fetchedSession = await client.sessions.get(session.id);
        expect(session.id).toEqual(fetchedSession.id);
        await session.deleteSession();

        try {
            await client.sessions.get(session.id);
            expect(true).toBe(false);
        } catch (error) {
            expect(true).toBe(true);
        }
    });

    test("should get all sessions", async () => {
        await device.createQodSession("QOS_E", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        const sessions = await device.sessions();

        expect(sessions.length).toBeGreaterThan(0);

        await device.clearSessions();
    });

    test("should create a session with service port", async () => {
        const session = await device.createQodSession("QOS_L", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            servicePorts: { ports: [80] },
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        await session.deleteSession();
    });

    test("should create a session with service port range", async () => {
        const session = await device.createQodSession("QOS_M", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            servicePorts: { ranges: [{ from: 80, to: 443 }] },
        });

        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_M");
        await session.deleteSession();
    });

    test("should create a session with device port", async () => {
        const session = await device.createQodSession("QOS_M", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            devicePorts: { ports: [80] },
        });

        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_M");
        await session.deleteSession();
    });

    test("should create a session with device port range", async () => {
        const session = await device.createQodSession("QOS_M", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            devicePorts: { ranges: [{ from: 80, to: 443 }] },
        });

        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_M");
        await session.deleteSession();
    });

    test("should create a session with duration", async () => {
        const session = await device.createQodSession("QOS_L", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            duration: 60,
        });

        expect(session.startedAt).toBeTruthy();
        expect(session.expiresAt).toBeTruthy();
        expect(session.duration()).toEqual(60);
        await session.deleteSession();
    });

    test("should create a session with notification url", async () => {
        const session = await device.createQodSession("QOS_L", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            notificationAuthToken: "c8974e592c2fa383d4a3960714",
            notificationUrl: "https://example.com/notifications",
        });

        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        await session.deleteSession();
    });
});
