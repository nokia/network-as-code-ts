import type { FetchMockStatic } from "fetch-mock";
import fetch from "node-fetch";

import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = fetch as unknown as FetchMockStatic;

let client: NetworkAsCodeClient;
let device: Device;

beforeAll(() => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get({
        networkAccessIdentifier: "test-device@testcsp.net",
        ipv4Address: {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        },
    });
});

beforeEach(() => {
    fetchMock.reset();
});

describe("Device Status", () => {
    it("can invoke subscription to CONNECTIVITY updates", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/subscriptions",
            JSON.stringify({
                subscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                subscriptionDetail: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    type: "CONNECTIVITY",
                },
                webhook: {
                    notificationUrl: "https://example.com/notify",
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            "CONNECTIVITY",
            "https://example.com/notify"
        );

        expect(subscription.eventType).toBe("CONNECTIVITY");
    });

    it("sends a request out on subscribe", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/subscriptions",
            JSON.stringify({
                subscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                subscriptionDetail: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    type: "CONNECTIVITY",
                },
                webhook: {
                    notificationUrl: "https://example.com/notify",
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
            })
        );

        await client.deviceStatus.subscribe(
            device,
            "CONNECTIVITY",
            "https://example.com/notify"
        );

        expect(fetchMock.calls().length).toBe(1);
    });

    it("uses the returned response to fill the subscription object", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/subscriptions",
            JSON.stringify({
                subscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                subscriptionDetail: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    type: "CONNECTIVITY",
                },
                webhook: {
                    notificationUrl: "https://example.com/notify",
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            "CONNECTIVITY",
            "https://example.com/notify"
        );

        expect(subscription.eventSubscriptionId).toBe(
            "89cc1355-2ff1-4091-a935-54817c821260"
        );
        expect(subscription.notificationUrl).toBe("https://example.com/notify");
        expect(subscription.startsAt).toEqual(
            new Date("2024-01-11T11:53:20.293671Z")
        );
    });

    it("sends the right body to the correct URL for subscription", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/subscriptions",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            },
                        },
                        type: "org.camaraproject.device-status.v0.connectivity-data",
                    },
                    webhook: {
                        notificationUrl: "https://example.com/notify",
                    },
                });

                return Promise.resolve(
                    JSON.stringify({
                        subscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                        subscriptionDetail: {
                            device: {
                                networkAccessIdentifier:
                                    "test-device@testcsp.net",
                                ipv4Address: {
                                    publicAddress: "1.1.1.2",
                                    privateAddress: "1.1.1.2",
                                    publicPort: 80,
                                },
                            },
                            type: "org.camaraproject.device-status.v0.connectivity-data",
                        },
                        webhook: {
                            notificationUrl: "https://example.com/notify",
                        },
                        startsAt: "2024-01-11T11:53:20.293671Z",
                    })
                );
            }
        );

        await client.deviceStatus.subscribe(
            device,
            "org.camaraproject.device-status.v0.connectivity-data",
            "https://example.com/notify"
        );
    });

    it("can handle a subscriptionExpireTime given as a Date", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/subscriptions",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            },
                        },
                        type: "org.camaraproject.device-status.v0.connectivity-data",
                    },
                    subscriptionExpireTime: "2024-01-11T11:53:20.000Z",
                    webhook: {
                        notificationUrl: "https://example.com/notify",
                    },
                });

                return Promise.resolve(
                    JSON.stringify({
                        subscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                        subscriptionDetail: {
                            device: {
                                networkAccessIdentifier:
                                    "test-device@testcsp.net",
                                ipv4Address: {
                                    publicAddress: "1.1.1.2",
                                    privateAddress: "1.1.1.2",
                                    publicPort: 80,
                                },
                            },
                            type: "org.camaraproject.device-status.v0.connectivity-data",
                        },
                        webhook: {
                            notificationUrl: "https://example.com/notify",
                        },
                        startsAt: "2024-01-11T11:53:20.293671Z",
                    })
                );
            }
        );

        await client.deviceStatus.subscribe(
            device,
            "org.camaraproject.device-status.v0.connectivity-data",
            "https://example.com/notify",
            {
                subscriptionExpireTime: new Date("2024-01-11T11:53:20.000Z"),
            }
        );
    });

    it("handles optional parameters in subscription", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/subscriptions",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            },
                        },
                        type: "CONNECTIVITY",
                    },
                    subscriptionExpireTime: "2024-01-11T11:53:20.293671Z",
                    maxNumberOfReports: 5,
                    webhook: {
                        notificationUrl: "https://example.com/notify",
                        notificationAuthToken: "asdasd",
                    },
                });

                return Promise.resolve(
                    JSON.stringify({
                        subscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                        subscriptionDetail: {
                            device: {
                                networkAccessIdentifier:
                                    "test-device@testcsp.net",
                                ipv4Address: {
                                    publicAddress: "1.1.1.2",
                                    privateAddress: "1.1.1.2",
                                    publicPort: 80,
                                },
                            },
                            type: "CONNECTIVITY",
                        },
                        webhook: {
                            notificationUrl: "https://example.com/notify",
                            notificationAuthToken: "asdasd",
                        },
                        startsAt: "2024-01-11T11:53:20.293671Z",
                        expiresAt: "2024-01-11T11:53:20.293671Z",
                    })
                );
            }
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            "CONNECTIVITY",
            "https://example.com/notify",
            {
                subscriptionExpireTime: "2024-01-11T11:53:20.293671Z",
                maxNumberOfReports: 5,
                notificationAuthToken: "asdasd",
            }
        );

        expect(subscription.startsAt instanceof Date).toBeTruthy();
        expect(subscription.expiresAt instanceof Date).toBeTruthy();

        expect(subscription.expiresAt).toEqual(
            new Date("2024-01-11T11:53:20.293671Z")
        );
    });

    it("can delete a subscription", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/subscriptions",
            JSON.stringify({
                subscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                subscriptionDetail: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    type: "CONNECTIVITY",
                },
                webhook: {
                    notificationUrl: "https://example.com/notify",
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            "CONNECTIVITY",
            "https://example.com/notify"
        );

        fetchMock.delete(
            "https://device-status.p-eu.rapidapi.com/subscriptions/89cc1355-2ff1-4091-a935-54817c821260",
            (_: any, req: any): any => {
                expect(req.method).toBe("DELETE");

                return Promise.resolve({
                    status: 200,
                });
            }
        );

        await subscription.delete();

        expect(fetchMock.calls().length).toBe(2);
    });

    it("can fetch a subscription by id", async () => {
        fetchMock.get(
            "https://device-status.p-eu.rapidapi.com/subscriptions/89cc1355-2ff1-4091-a935-54817c821260",
            (_: any, req: any): any => {
                expect(req.method).toBe("GET");

                return Promise.resolve({
                    status: 200,
                    body: JSON.stringify({
                        subscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                        subscriptionDetail: {
                            device: {
                                networkAccessIdentifier:
                                    "test-device@testcsp.net",
                                ipv4Address: {
                                    publicAddress: "1.1.1.2",
                                    privateAddress: "1.1.1.2",
                                    publicPort: 80,
                                },
                            },
                            type: "CONNECTIVITY",
                        },
                        webhook: {
                            notificationUrl: "https://example.com/notify",
                        },
                        startsAt: "2024-01-11T11:53:20.293671Z",
                    }),
                });
            }
        );

        const subscription = await client.deviceStatus.get(
            "89cc1355-2ff1-4091-a935-54817c821260"
        );

        expect(subscription.eventSubscriptionId).toBe(
            "89cc1355-2ff1-4091-a935-54817c821260"
        );
        expect(subscription.device).toBeDefined();
        expect(subscription.device.networkAccessIdentifier).toBe(
            "test-device@testcsp.net"
        );
        expect(subscription.device.ipv4Address).toEqual({
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        });
    });

    it("can get list of subscriptions", async () => {
        fetchMock.get(
            "https://device-status.p-eu.rapidapi.com/subscriptions",
            JSON.stringify([
                {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "testuser@testcsp.net",
                        },
                        type: "org.camaraproject.device-status.v0.connectivity-data",
                    },
                    maxNumberOfReports: 1,
                    webhook: {
                        notificationUrl: "https://example.com",
                    },
                    subscriptionId: "34e9e3ee-e281-4f47-bbc2-2431e6abbef0",
                    eventSubscriptionId: "34e9e3ee-e281-4f47-bbc2-2431e6abbef0",
                    startsAt: "2024-04-09T11:14:50.254312Z",
                    expiresAt: "2024-04-10T14:13:29.766268",
                },
                {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "testuser@testcsp.net",
                        },
                        type: "org.camaraproject.device-status.v0.connectivity-data",
                    },
                    maxNumberOfReports: 1,
                    webhook: {
                        notificationUrl: "https://example.com",
                    },
                    subscriptionId: "51b24d1a-26ae-4c9d-b114-2086da958c50",
                    eventSubscriptionId: "51b24d1a-26ae-4c9d-b114-2086da958c50",
                    startsAt: "2024-04-09T11:21:22.871187Z",
                    expiresAt: "2024-04-10T14:13:29Z",
                },
                {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier:
                                "sdk-integration@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            },
                        },
                        type: "org.camaraproject.device-status.v0.roaming-status",
                        eventType: "ROAMING_STATUS",
                    },
                    maxNumberOfReports: 1,
                    webhook: {
                        notificationUrl: "http://192.0.2.0:8080/",
                        notificationAuthToken: "c8974e592c2fa383d4a3960714",
                    },
                    subscriptionId: "815e6da4-813d-4111-987d-5e6036aaa410",
                    eventSubscriptionId: "815e6da4-813d-4111-987d-5e6036aaa410",
                    startsAt: "2024-04-05T14:29:56.792078Z",
                },
                {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier:
                                "sdk-integration@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            },
                        },
                        type: "org.camaraproject.device-status.v0.connectivity-data",
                    },
                    maxNumberOfReports: 1,
                    webhook: {
                        notificationUrl: "http://192.0.2.0:8080/",
                        notificationAuthToken: "c8974e592c2fa383d4a3960714",
                    },
                    subscriptionId: "f6b03776-5e0f-4dbc-abce-30a916f94ad0",
                    eventSubscriptionId: "f6b03776-5e0f-4dbc-abce-30a916f94ad0",
                    startsAt: "2024-04-09T11:11:27.052869Z",
                    expiresAt: "2025-04-08T14:13:29.766268",
                },
            ])
        );

        const subscriptions = await client.deviceStatus.getSubscriptions();

        expect(subscriptions.length).toBe(4);
    });

    it("allows polling device connectivity", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/connectivity",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body)).toStrictEqual({
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                });

                return Promise.resolve({
                    status: 200,
                    body: JSON.stringify({
                        connectivityStatus: "CONNECTED_DATA",
                    }),
                });
            }
        );

        const status = await device.getConnectivity();

        expect(status).toBe("CONNECTED_DATA");
    });

    it("allows polling device roaming status", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/roaming",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body)).toStrictEqual({
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                });

                return Promise.resolve({
                    status: 200,
                    body: JSON.stringify({
                        roaming: true,
                        countryCode: 358,
                        countryName: ["Finland"],
                    }),
                });
            }
        );

        const status = await device.getRoaming();

        expect(status).toStrictEqual({
            roaming: true,
            countryCode: 358,
            countryName: ["Finland"],
        });
    });
});
