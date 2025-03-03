
import { describe, expect, test } from "@jest/globals";
import { NetworkAsCodeClient } from "../src";

let client: NetworkAsCodeClient;

beforeAll((): any => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    return client;
});

describe("Device creation", () => {
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

    test("should set private address to public if only public IPv4 address is provided", () => {
        let device = client.devices.get({
            networkAccessIdentifier: "test-device@testcsp.net",
            ipv4Address: {
                publicAddress: "1.1.1.2",
            },
        });

        expect(device.ipv4Address?.privateAddress).toEqual(
            device.ipv4Address?.publicAddress
        );
    });
})
