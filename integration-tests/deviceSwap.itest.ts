import { beforeAll, beforeEach, describe, expect } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { configureClient } from "./configClient";

let client: NetworkAsCodeClient;

beforeAll((): any => {
    client = configureClient()
});

describe("Device Swap retrieval and verification", () => {
    let device: Device;

    beforeEach(() => {
        device = client.devices.get({
            phoneNumber: "+99999991000",
        });
    });
    it("should retrieve device swap of a test device", async () => {
        expect(device.getDeviceSwapDate()).toBeTruthy();
    });

    it("should verify device swap without max age", async () => {
        expect(device.verifyDeviceSwap()).toBeTruthy();
    });

    it("should verify device swap with max age", async () => {
        expect(device.verifyDeviceSwap(120)).toBeTruthy();
    });

    it("should verify device swap - True", async () => {
        device = client.devices.get({
            phoneNumber: "+99999991000",
        });

       expect(device.verifyDeviceSwap(120)).resolves.toBeTruthy();

    });

    it("should verify device swap - False", async () => {
        device = client.devices.get({
            phoneNumber: "+99999991001",
        });

        expect(device.verifyDeviceSwap(120)).resolves.toBeFalsy();

    });

});
