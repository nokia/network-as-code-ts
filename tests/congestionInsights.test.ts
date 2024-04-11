import type { FetchMockStatic } from "fetch-mock";
import fetch from "node-fetch";

import { NetworkAsCodeClient } from "../src";
import { Device, DeviceIpv4Addr } from "../src/models/device";
import { AuthenticationError } from "../src/errors";

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = fetch as unknown as FetchMockStatic;

let client: NetworkAsCodeClient;

let device: Device;

beforeAll((): any => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get("test-device@testcsp.net", {
        publicAddress: "1.1.1.2",
        privateAddress: "1.1.1.2",
        publicPort: 80,
    });
    return client;
});

// Tests
beforeEach(() => {
    fetchMock.reset();
});

describe("Congestion Insights", () => {
    it("should create a congestion insight subscription", async () => {
        fetchMock.post(
            "https://congestion-insights.p-eu.rapidapi.com/subscriptions",
            JSON.stringify({
                device: {
                    phoneNumber: device.phoneNumber,
                    networkAccessIdentifier: device.networkAccessIdentifier,
                    ipv4Address: {
                        publicAddress: (device.ipv4Address as DeviceIpv4Addr)
                            .publicAddress,
                        privateAddress: (device.ipv4Address as DeviceIpv4Addr)
                            .privateAddress,
                        publicPort: (device.ipv4Address as DeviceIpv4Addr)
                            .publicPort,
                    },
                    ipv6Address: device.ipv6Address,
                },
                webhook: {
                    notificationUrl: "https://example.com/notifications",
                    notificationAuthToken: "c8974e592c2fa383d4a3960714",
                },
                subscriptionExpireTime: 0,
            })
        );

        const subscription = await client.insights.subscribe_to_congestion_info(
            device,
            0,
            "https://example.com/notifications",
            "c8974e592c2fa383d4a3960714"
        );
        
    });
});
