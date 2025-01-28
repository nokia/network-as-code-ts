
import type { FetchMockStatic } from "fetch-mock";
import fetch from "node-fetch";
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = fetch as unknown as FetchMockStatic;

let client: NetworkAsCodeClient;

let device: Device;

beforeAll(() => {
    client  = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get({
        networkAccessIdentifier: "testuser@open5glab.net",
        ipv4Address: {
            publicAddress: "1.1.1.2",
            publicPort: 80,
        }
    })
})

beforeEach(() => {
    fetchMock.reset();
});

describe("Geofencing", () => {
    it("should allow subscribing to geofencing information", async () => {
        fetchMock.post(
            "https://geofencing-subscription.p-eu.rapidapi.com/v0.3/subscriptions",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    "protocol": "HTTP",
                    "sink": "https://example.com/",
                    "types": [
                        "org.camaraproject.geofencing-subscriptions.v0.area-entered"
                    ],
                    "config": {
                        "subscriptionDetail": {
                            "device": {
                                "networkAccessIdentifier": "testuser@open5glab.net",
                                "ipv4Address": {
                                    "publicAddress": "1.1.1.2",
                                    "publicPort": 80
                                },
                            },
                            "area": {
                                "areaType": "CIRCLE",
                                "center": {
                                    "latitude": -90,
                                    "longitude": -180
                                },
                                "radius": 2001
                            }
                        },
                        "subscriptionExpireTime": "2025-01-23T10:40:30.616Z",
                        "subscriptionMaxEvents": 1,
                    }
                })

                return Promise.resolve(
                    JSON.stringify(
                        {
                            "protocol": "HTTP",
                            "sink": "https://example.com/",
                            "types": [
                                "org.camaraproject.geofencing-subscriptions.v0.area-entered"
                            ],
                            "config": {
                                "subscriptionDetail": {
                                    "device": {
                                        "networkAccessIdentifier": "123456789@domain.com",
                                        "phoneNumber": "+123456789",
                                        "ipv4Address": {
                                            "publicAddress": "1.1.1.2",
                                            "publicPort": 80
                                        },
                                        "ipv6Address": "2001:db8:85a3:8d3:1319:8a2e:370:7344"
                                    },
                                    "area": {
                                        "areaType": "CIRCLE",
                                        "center": {
                                            "latitude": -90,
                                            "longitude": -180
                                        },
                                        "radius": 2001
                                    }
                                },
                                "subscriptionExpireTime": "2025-01-23T10:40:30.616Z",
                                "subscriptionMaxEvents": 1,
                                "initialEvent": false
                            },
                            "id": "de87e438-58b4-42c3-9d49-0fbfbd878305",
                            "startsAt": "2025-01-23T10:40:30.616Z"
                        },
                    )
                );
            }
        )

        const geofencingSubscription = await client.geofencing.subscribe(
            device,
            {
                sink: "https://example.com/",
                types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
                latitude: -90,
                longitude: -180,
                radius: 2001,
                subscriptionExpireTime: new Date("2025-01-23T10:40:30.616Z"),
                subscriptionMaxEvents: 1,
                initialEvent: false
            }
        )

        expect(geofencingSubscription.eventSubscriptionId).toBe("de87e438-58b4-42c3-9d49-0fbfbd878305")
        expect(geofencingSubscription.types).toEqual(["org.camaraproject.geofencing-subscriptions.v0.area-entered"])
        expect(geofencingSubscription.sink).toBe("https://example.com/")
        expect(geofencingSubscription.latitude).toBe(-90)
        expect(geofencingSubscription.longitude).toBe(-180)
        expect(geofencingSubscription.radius).toBe(2001)
    })

    it("should allow subscriptions to be deleted", async () => {
        fetchMock.post(
            "https://geofencing-subscription.p-eu.rapidapi.com/v0.3/subscriptions",
            JSON.stringify({
                "protocol": "HTTP",
                "sink": "https://example.com/",
                "types": [
                    "org.camaraproject.geofencing-subscriptions.v0.area-entered"
                ],
                "config": {
                    "subscriptionDetail": {
                        "device": {
                            "networkAccessIdentifier": "123456789@domain.com",
                            "phoneNumber": "+123456789",
                            "ipv4Address": {
                                "publicAddress": "1.1.1.2",
                                "publicPort": 80
                            },
                            "ipv6Address": "2001:db8:85a3:8d3:1319:8a2e:370:7344"
                        },
                        "area": {
                            "areaType": "CIRCLE",
                            "center": {
                                "latitude": -90,
                                "longitude": -180
                            },
                            "radius": 2001
                        }
                    },
                    "subscriptionExpireTime": "2025-01-23T10:40:30.616Z",
                    "subscriptionMaxEvents": 1,
                    "initialEvent": false
                },
                "id": "de87e438-58b4-42c3-9d49-0fbfbd878305",
                "startsAt": "2025-01-23T10:40:30.616Z"
            })
        )

        const geofencingSubscription = await client.geofencing.subscribe(
            device,
            {
                sink: "https://example.com/",
                types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
                latitude: -90,
                longitude: -180,
                radius: 2001,
                subscriptionExpireTime: new Date("2025-01-23T10:40:30.616Z"),
                subscriptionMaxEvents: 1,
                initialEvent: false
            }
        );

        fetchMock.delete(
            "https://geofencing-subscription.p-eu.rapidapi.com/v0.3/subscriptions/de87e438-58b4-42c3-9d49-0fbfbd878305",
            (_: any, req: any): any => {
                expect(req.method).toBe("DELETE");

                return Promise.resolve({
                    status: 200,
                });
            }
        );

        await geofencingSubscription.delete();
            
        expect(fetchMock.calls().length).toBe(2);
    })

    // TODO: Test geofencing subscription retrieval
})
