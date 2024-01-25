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

describe("Location retrieval and verification", () => {
    it("should retrieve location of a test device", async () => {
        let device = client.devices.get("test-device@testcsp.net", {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        });

        let location = await device.getLocation();

        expect(location).toBeDefined();

        expect(location.latitude).toBe(47.48627616952785);
        expect(location.longitude).toBe(19.07915612501993);
        expect(location.civicAddress).toBeDefined();
    });

    it("should verify location of a test device", async () => {
        let device = client.devices.get("test-device@testcsp.net", {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        });

        let isHere = await device.verifyLocation(
            47.48627616952785,
            19.07915612501993,
            10_000,
            60
        );

        expect(isHere).toBeTruthy();
    });
});
