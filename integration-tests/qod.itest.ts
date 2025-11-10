import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import { NetworkAsCodeClient } from "../src";
import { Device, DeviceIpv4Addr } from "../src/models/device";
import { ProxyAgent } from "proxy-agent";
import fetch from "node-fetch";
import "dotenv/config";


import { configureClient, configureNotificationServerUrl } from "./configClient";

let client: NetworkAsCodeClient;
let notificationUrl: string;
let agent : ProxyAgent

beforeAll(() => {
    client = configureClient();
    notificationUrl = configureNotificationServerUrl();
    agent = new ProxyAgent()
});

describe("QoD", () => {
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
                phoneNumber: `+3670${
                    Math.floor(Math.random() * (999999 - 123456 + 1)) + 123456
                }`,
            });

            deviceWithPhoneNumber = client.devices.get({
                ipv4Address: {
                    publicAddress: "1.1.1.2",
                    privateAddress: "1.1.1.2",
                    publicPort: 80,
                },
                phoneNumber: `+3670${
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
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        expect(session.serviceIpv4).toEqual("5.6.7.8");
        expect(session.serviceIpv6).toEqual("2041:0000:140F::875B:131B");
        await session.deleteSession();
    });

    test("should create a session to a device with phone number", async () => {
        const session = await deviceWithPhoneNumber.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.device.phoneNumber).toEqual(
            deviceWithPhoneNumber.phoneNumber
        );
        expect(session.serviceIpv4).toEqual("5.6.7.8");
        expect(session.serviceIpv6).toEqual("2041:0000:140F::875B:131B");
        await session.deleteSession();
    });

    test("should create a session with medium profile", async () => {
        const session = await device.createQodSession("QOS_M", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_M");
        await session.deleteSession();
    });

    test("should create a session with small profile", async () => {
        const session = await device.createQodSession("QOS_S", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_S");
        await session.deleteSession();
    });

    test("should create a session with low latency profile", async () => {
        const session = await device.createQodSession("QOS_E", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_E");
        await session.deleteSession();
    });

    test("should get one session", async () => {
        const session = await device.createQodSession("QOS_E", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        const fetchedSession = await client.sessions.get(session.id);
        expect(session.id).toEqual(fetchedSession.id);
        expect(fetchedSession.device.networkAccessIdentifier).toEqual(
            device.networkAccessIdentifier
        );
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
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
        });
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        const sessions = await device.sessions();
        expect(sessions.length).toBeGreaterThan(0);

        await device.clearSessions();
    }, 20 * 1000);

    test("should create a session with service port", async () => {
        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            servicePorts: { ports: [80] },
        });
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        expect(session.servicePorts?.ports).toEqual([80]);
        await session.deleteSession();
    });

    test("should create a session with service port range", async () => {
        const session = await device.createQodSession("QOS_M", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            servicePorts: { ranges: [{ from: 80, to: 443 }] },
        });

        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_M");
        expect(session.servicePorts?.ranges).toEqual([{ from: 80, to: 443 }]);
        await session.deleteSession();
    });

    test("should create a session with device port", async () => {
        const session = await device.createQodSession("QOS_M", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            devicePorts: { ports: [80] },
        });

        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_M");
        expect(session.devicePorts?.ports).toEqual([80]);
        await session.deleteSession();
    });

    test("should create a session with device port range", async () => {
        const session = await device.createQodSession("QOS_M", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            devicePorts: { ranges: [{ from: 80, to: 443 }] },
        });

        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_M");
        expect(session.devicePorts?.ranges).toEqual([{ from: 80, to: 443 }]);
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
        expect(session.duration).toEqual(60);
        await session.deleteSession();
    });

    test("should extend the duration of a session", async () => {
        const session = await device.createQodSession("QOS_L", {
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            duration: 60,
        });

        expect(session.duration).toEqual(60);
        await session.extendSession(60);
        expect(session.duration).toEqual(120);
        await session.deleteSession();
    });

    test("should create and delete a session with notification url", async () => {
        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            sink: `${notificationUrl}/notify`,
        });

        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        // Fetching the session notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/quality-on-demand/${session.id}`,
            {
                method: "GET",
                agent: agent
            });

        const data = (await notification.json()) as any[];
        expect(data).not.toBeNull();

        const sessionInfo = data[0]
        expect(sessionInfo).toHaveProperty("data.sessionId")
        expect(sessionInfo).toHaveProperty("data.qosStatus")

        session.deleteSession();
        
        // Deleting the session notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        notification = await fetch(`${notificationUrl}/quality-on-demand/${session.id}`,
            {
                method: "DELETE",
                agent: agent
            });

        const message = (await notification.json()) as any[]
        expect(message).toEqual([{'message': 'Notification deleted'}, 200])

    },20 * 1000);

    test("should change session status from deletion", async () => {
        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
            serviceIpv6: "2041:0000:140F::875B:131B",
            sink: `${notificationUrl}/notify`
        });

        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));

        session.deleteSession();

        // Fetching the session notification
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        let notification = await fetch(`${notificationUrl}/quality-on-demand/${session.id}`,
            {
                method: "GET",
                agent: agent
            });
        
        const data = (await notification.json()) as any[];
        expect(data).not.toBeNull();

        const deletionInfo = data[1]
        expect(deletionInfo).toHaveProperty("data.statusInfo", "DELETE_REQUESTED")

        // Deleting the session notification
        notification = await fetch(`${notificationUrl}/quality-on-demand/${session.id}`,
            {
                method: "DELETE",
                agent: agent
            });

    },20 * 1000);

    test("should create a session with public and private ipv4", async () => {
        device = client.devices.get({
            networkAccessIdentifier: "test-device@testcsp.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
            },
        });
        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
        });

        expect(session.serviceIpv4).toEqual("5.6.7.8");
        expect(session.device.ipv4Address?.publicAddress).toEqual("1.1.1.2");
        expect(session.device.ipv4Address?.privateAddress).toEqual("1.1.1.2");

        await session.deleteSession();
    });

    test("should create a session with public ipv4 and public port", async () => {
        device = client.devices.get({
            networkAccessIdentifier: "test-device@testcsp.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
                publicPort: 80,
            },
        });
        const session = await device.createQodSession("QOS_L", {
            duration: 3600,
            serviceIpv4: "5.6.7.8",
        });

        expect(session.serviceIpv4).toEqual("5.6.7.8");
        expect(session.device.ipv4Address?.publicAddress).toEqual("1.1.1.2");
        expect(session.device.ipv4Address?.publicPort).toEqual(80);

        await session.deleteSession();
    });
});