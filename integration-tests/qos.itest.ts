import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";

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
    let device: any;
    beforeEach(() => {
        device = client.devices.get(
            "test-device@testcsp.net",
            {
                publicAddress: "1.1.1.2",
                privateAddress: "1.1.1.2",
                publicPort: 80,
            },
            undefined,
            "9382948473"
        );
    });
    test("should get a device", () => {
        expect(device.networkAccessIdentifier).toEqual(
            "test-device@testcsp.net"
        );
    });

    test("should create a session", async () => {
        const session = await device.createQodSession(
            "QOS_L",
            "5.6.7.8",
            "2041:0000:140F::875B:131B"
        );
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        await session.deleteSession();
    });

    test("should get one session", async () => {
        const newSession = await device.createQodSession(
            "QOS_L",
            "5.6.7.8",
            "2041:0000:140F::875B:131B"
        );

        const session = await client.sessions.get(newSession.id);
        expect(session.id).toEqual(newSession.id);
        await session.deleteSession();

        try {
            await client.sessions.get(newSession.id);
            expect(true).toBe(false);
        } catch (error) {
            expect(true).toBe(true);
        }
    });

    test("should get all sessions", async () => {
        const newSession = await device.createQodSession(
            "QOS_L",
            "5.6.7.8",
            "2041:0000:140F::875B:131B"
        );

        const sessions = await device.sessions();

        expect(sessions.length).toBeGreaterThan(0);

        await device.clearSessions();
    })

    test("should create a session with service port", async () => {
        const session = await device.createQodSession(
            "QOS_L",
            "5.6.7.8",
            "2041:0000:140F::875B:131B",
            undefined,
            { ports: [80] }
        );
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        await session.deleteSession();
    });

    test("should create a session with port range", async () => {
        const session = await device.createQodSession(
            "QOS_L",
            "5.6.7.8",
            "2041:0000:140F::875B:131B",
            undefined,
            { ranges: [{ from: 80, to: 443 }] }
        );
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        await session.deleteSession();
    });

    test("should create a session with duration", async () => {
        const session = await device.createQodSession(
            "QOS_L",
            "5.6.7.8",
            "2041:0000:140F::875B:131B",
            undefined,
            undefined,
            60
        );
        expect(session.startedAt).toBeTruthy();
        expect(session.expiresAt).toBeTruthy();
        expect(session.duration()).toEqual(60);
        await session.deleteSession();
    });

    test("should create a session with notification url", async () => {
        const session = await device.createQodSession(
            "QOS_L",
            "5.6.7.8",
            "2041:0000:140F::875B:131B",
            undefined,
            undefined,
            undefined,
            "https://example.com/notifications",
            "c8974e592c2fa383d4a3960714"
        );
        expect(session.status).toEqual("REQUESTED");
        expect(session.profile).toEqual("QOS_L");
        await session.deleteSession();
    });
});
