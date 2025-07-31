import { beforeAll, describe, expect} from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { configureClient } from "./configClient";

let client: NetworkAsCodeClient;

beforeAll((): any => {
    client = configureClient()
});

describe("Location retrieval and verification", () => {
    it("should retrieve location of a test device", async () => {
        let device = client.devices.get({
            phoneNumber: "+3671123456"
        });

        let location = await device.getLocation();

        expect(location).toBeDefined();

        expect(location.latitude).toBe(47.48627616952785);
        expect(location.longitude).toBe(19.07915612501993);
        expect(location.radius).toBe(1000);
    });

    it("should verify location of a test device", async () => {
        let device = client.devices.get({
            phoneNumber: "+3671123456"
        });

        let isHere = await device.verifyLocation(
            47.48627616952785,
            19.07915612501993,
            10_000,
            70
        );

        expect(isHere.resultType).toBe("TRUE");
    });
});