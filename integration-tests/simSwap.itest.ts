import { beforeAll, beforeEach, describe, expect } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { configureClient } from "./configClient";

let client: NetworkAsCodeClient;

beforeAll((): any => {
    client = configureClient()
});

describe("Sim Swap retrieval and verification", () => {
    let device: Device;

    beforeEach(() => {
        device = client.devices.get({
            phoneNumber: "+3637123456",
        });
    });
    it("should retrieve sim swap of a test device", async () => {
        expect(device.getSimSwapDate()).toBeTruthy();
    });

    it("should verify sim swap without max age", async () => {
        expect(device.verifySimSwap()).toBeTruthy();
    });

    it("should verify sim swap with max age", async () => {
        expect(device.verifySimSwap(120)).toBeTruthy();
    });
});
