import type { FetchMockStatic } from 'fetch-mock';
import fetch from 'node-fetch';

import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = (fetch as unknown) as FetchMockStatic;

let client: NetworkAsCodeClient;
let device: Device;

beforeAll(() => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get("test-device@testcsp.net", {
        publicAddress: "1.1.1.2",
        privateAddress: "1.1.1.2",
        publicPort: 80,
    });
});

beforeEach(() => {
    fetchMock.reset();
});

describe("Device Status", () => {
    it("can invoke subscription to CONNECTIVITY updates", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/event-subscriptions",
            JSON.stringify({
                eventSubscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                subscriptionDetail: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    eventType: "CONNECTIVITY",
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
            "https://device-status.p-eu.rapidapi.com/event-subscriptions",
            JSON.stringify({
                eventSubscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                subscriptionDetail: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    eventType: "CONNECTIVITY",
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
            "https://device-status.p-eu.rapidapi.com/event-subscriptions",
            JSON.stringify({
                eventSubscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                subscriptionDetail: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    eventType: "CONNECTIVITY",
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
        expect(subscription.startsAt).toBe("2024-01-11T11:53:20.293671Z");
    });

    it("sends the right body to the correct URL for subscription", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/event-subscriptions",
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
                        eventType: "CONNECTIVITY",
                    },
                    webhook: {
                        notificationUrl: "https://example.com/notify",
                    },
                });

                return Promise.resolve(
                    JSON.stringify({
                        eventSubscriptionId:
                            "89cc1355-2ff1-4091-a935-54817c821260",
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
                            eventType: "CONNECTIVITY",
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
            "CONNECTIVITY",
            "https://example.com/notify"
        );
    });

    it("handles optional parameters in subscription", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/event-subscriptions",
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
                        eventType: "CONNECTIVITY",
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
                        eventSubscriptionId:
                            "89cc1355-2ff1-4091-a935-54817c821260",
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
                            eventType: "CONNECTIVITY",
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

        expect(subscription.expiresAt).toBe("2024-01-11T11:53:20.293671Z");
    });

    it("can delete a subscription", async () => {
        fetchMock.post(
            "https://device-status.p-eu.rapidapi.com/event-subscriptions",
            JSON.stringify({
                eventSubscriptionId: "89cc1355-2ff1-4091-a935-54817c821260",
                subscriptionDetail: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    eventType: "CONNECTIVITY",
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
            "https://device-status.p-eu.rapidapi.com/event-subscriptions/89cc1355-2ff1-4091-a935-54817c821260",
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
            "https://device-status.p-eu.rapidapi.com/event-subscriptions/89cc1355-2ff1-4091-a935-54817c821260",
            (_: any, req: any): any => {
                expect(req.method).toBe("GET");

                return Promise.resolve({
                    status: 200,
                    body: JSON.stringify({
                        eventSubscriptionId:
                            "89cc1355-2ff1-4091-a935-54817c821260",
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
                            eventType: "CONNECTIVITY",
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
});
