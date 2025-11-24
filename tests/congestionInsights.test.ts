import fetchMock from '@fetch-mock/jest';

import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";


jest.mock("node-fetch", () => {
	const nodeFetch = jest.requireActual("node-fetch");
	// only needed if your application makes use of Response, Request
	// or Headers classes directly
	Object.assign(fetchMock.config, {
		fetch: nodeFetch,
		Response: nodeFetch.Response,
		Request: nodeFetch.Request,
		Headers: nodeFetch.Headers,
	});
	return fetchMock.fetchHandler;
});

let client: NetworkAsCodeClient;

let device: Device;

beforeAll((): any => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get({
        networkAccessIdentifier: "test-device@testcsp.net",
        ipv4Address: {
            publicAddress: "1.1.1.2",
            privateAddress: "1.1.1.2",
            publicPort: 80,
        },
    });
    return client;
});

// Tests
beforeEach(() => {
    fetchMock.mockReset();
});

afterEach(() => {
    fetchMock.unmockGlobal();
});

describe("Congestion Insights", () => {
    it("should create a congestion insight subscription", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/congestion-insights/v0/subscriptions",
            JSON.stringify({
                subscriptionId: "4edb6919-8e91-406a-ab84-900a420af860",
                startedAt: "2024-04-12T08:45:37.210563Z",
                expiresAt: "2024-04-20T00:00:00Z",
            })
        );

        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            "2024-01-11T11:53:20.293671Z",
            "https://example.com/notifications",
            "c8974e592c2fa383d4a3960714"
        );
        expect(subscription.startsAt).toEqual(
            new Date("2024-04-12T08:45:37.210563Z")
        );
        expect(subscription.expiresAt).toEqual(
            new Date("2024-04-20T00:00:00Z")
        );
    });

    it("should send correct payload", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/congestion-insights/v0/subscriptions"
        fetchMock.mockGlobal().post(
            url,
            {
                body: {
                        subscriptionId: "4edb6919-8e91-406a-ab84-900a420af860",
                        startedAt: "2024-04-15T08:45:37.210563Z",
                        expiresAt: "2024-04-20T00:00:00Z",
                }
            },
            { 
                body: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    webhook: {
                        notificationUrl: "https://example.com/notify",
                        notificationAuthToken: "c8974e592c2fa383d4a3960714",
                    },
                    subscriptionExpireTime: "2024-04-20T00:00:00Z",
                }
            },
        );

        await client.insights.subscribeToCongestionInfo(
            device,
            "2024-04-20T00:00:00Z",
            "https://example.com/notify",
            "c8974e592c2fa383d4a3960714"
        );
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    webhook: {
                        notificationUrl: "https://example.com/notify",
                        notificationAuthToken: "c8974e592c2fa383d4a3960714",
                    },
                    subscriptionExpireTime: "2024-04-20T00:00:00Z",
            }
        });
    });

    it("can get a subscription by id", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/congestion-insights/v0/subscriptions/4edb6919-8e91-406a-ab84-900a420af860"
        fetchMock.mockGlobal().get(
            url,
            {
                body: {
                        subscriptionId: "4edb6919-8e91-406a-ab84-900a420af860",
                        startedAt: "2024-04-15T08:45:37.210563Z",
                        expiresAt: "2024-04-20T00:00:00Z",
                }
            },
        );

        const subscription = await client.insights.get(
            "4edb6919-8e91-406a-ab84-900a420af860"
        );

        expect(subscription.subscriptionId).toBe(
            "4edb6919-8e91-406a-ab84-900a420af860"
        );
        expect(fetchMock).toHaveFetched(url, {
            method: "GET",
        });
    });

    it("can get list of subscriptions", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/congestion-insights/v0/subscriptions"
        fetchMock.mockGlobal().get(
            url,
            {
                body: JSON.stringify([
                {
                    subscriptionId: "4edb6919-8e91-406a-ab84-900a420af860",
                    startedAt: "2024-04-15T08:45:37.210563Z",
                    expiresAt: "2024-04-20T00:00:00Z",
                },
                {
                    subscriptionId: "4edb6919-8e91-406a-ab84-900a420af861",
                    startedAt: "2024-04-15T08:45:37.210563Z",
                    expiresAt: "2024-04-20T00:00:00Z",
                },
                {
                    subscriptionId: "4edb6919-8e91-406a-ab84-900a420af862",
                    startedAt: "2024-04-15T08:45:37.210563Z",
                    expiresAt: "2024-04-20T00:00:00Z",
                },
                ])
            },
        );

        const subscriptions = await client.insights.getSubscriptions();

        expect(subscriptions.length).toBe(3);
        expect(fetchMock).toHaveFetched(url, {
            method: "GET",
        });
    });

    it("can handle a subscriptionExpireTime given as a Date", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/congestion-insights/v0/subscriptions"
        fetchMock.mockGlobal().post(
            url,
            {
                body: {
                        subscriptionId: "4edb6919-8e91-406a-ab84-900a420af860",
                        startedAt: "2024-04-15T08:45:37.210563Z",
                        expiresAt: "2024-01-11T11:53:20.000Z",
                }
            },
            { 
                body: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    webhook: {
                        notificationUrl: "https://example.com/notify",
                        notificationAuthToken: "c8974e592c2fa383d4a3960714",
                    },
                    subscriptionExpireTime: "2024-01-11T11:53:20.000Z"                                                                                                                         ,
                }
            },
        );

        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            new Date("2024-01-11T11:53:20.000Z"),
            "https://example.com/notify",
            "c8974e592c2fa383d4a3960714"
        );

        expect(subscription.startsAt instanceof Date).toBeTruthy();
        expect(subscription.expiresAt instanceof Date).toBeTruthy();
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    webhook: {
                        notificationUrl: "https://example.com/notify",
                        notificationAuthToken: "c8974e592c2fa383d4a3960714",
                    },
                    subscriptionExpireTime: "2024-01-11T11:53:20.000Z"                                                                                                                         ,
            }
        });
    });

    it("can delete a subscription", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/congestion-insights/v0/subscriptions",
            JSON.stringify({
                subscriptionId: "4edb6919-8e91-406a-ab84-900a420af860",
                startedAt: "2024-04-15T08:45:37.210563Z",
                expiresAt: "2024-01-11T11:53:20.000Z",
            })
        );

        const subscription = await client.insights.subscribeToCongestionInfo(
            device,
            new Date("2024-01-11T11:53:20.000Z"),
            "https://example.com/notify",
            "c8974e592c2fa383d4a3960714"
        );

        fetchMock.mockGlobal().delete(
            "https://network-as-code.p-eu.rapidapi.com/congestion-insights/v0/subscriptions/4edb6919-8e91-406a-ab84-900a420af860",
                { 
                    status: 200,
                }
        );

        await subscription.delete();

        expect(fetchMock.callHistory.calls().length).toBe(2);
        expect(fetchMock).toHaveFetched("https://network-as-code.p-eu.rapidapi.com/congestion-insights/v0/subscriptions/4edb6919-8e91-406a-ab84-900a420af860", {
            method: "DELETE",
        });
    });

    it("should poll congestion level of given time range", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/congestion-insights/v0/query"
        fetchMock.mockGlobal().post(
            url,
            {
                body: JSON.stringify([{
                        timeIntervalStart: "2024-08-20T21:00:00+0000",
                        timeIntervalStop: "2024-08-20T21:05:00+0000",
                        congestionLevel: "medium",
                        confidenceLevel: 50
                }])
            },
            { 
                body: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    start: "2024-04-15T05:11:30.961Z",
                    end: "2024-04-16T05:11:30.000Z",
                }
            },
        );

        const congestion = await device.getCongestion(
            new Date("2024-04-15T05:11:30.961136Z"),
            new Date("2024-04-16T05:11:30Z")
        );

        expect(congestion.length).toBe(1)
        expect(congestion[0].level).toBe("medium")
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                    start: "2024-04-15T05:11:30.961Z",
                    end: "2024-04-16T05:11:30.000Z",
            }
        });
    });
});
