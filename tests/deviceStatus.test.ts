import fetchMock from '@fetch-mock/jest';

import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { EventType } from '../src/models/deviceStatus';

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
    fetchMock.mockReset();
});

afterEach(() => {
    fetchMock.unmockGlobal();
});

describe("Device Status", () => {
    it("can invoke subscription to CONNECTIVITY updates", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions",
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


    it("can invoke subscription to CONNECTIVITY_DATA updates", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions",
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
                    type: "org.camaraproject.device-status.v0.connectivity-data",
                },
                webhook: {
                    notificationUrl: "https://example.com/notify",
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            EventType.CONNECTIVITY_DATA,
            "https://example.com/notify"
        );

        expect(subscription.eventType).toBe("org.camaraproject.device-status.v0.connectivity-data");
    });

    it("sends a request out on subscribe", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions",
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
                    type: "org.camaraproject.device-status.v0.connectivity-sms",
                },
                webhook: {
                    notificationUrl: "https://example.com/notify",
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
            })
        );

        await client.deviceStatus.subscribe(
            device,
            EventType.CONNECTIVITY_SMS,
            "https://example.com/notify"
        );

        expect(fetchMock.callHistory.calls().length).toBe(1);
    });

    it("uses the returned response to fill the subscription object", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions",
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
                    type: "org.camaraproject.device-status.v0.roaming-status",
                },
                webhook: {
                    notificationUrl: "https://example.com/notify",
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            EventType.ROAMING_STATUS,
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
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions",
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
            },
                { response: Promise.resolve(
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
                )}
            
        );

        await client.deviceStatus.subscribe(
            device,
            "org.camaraproject.device-status.v0.connectivity-data",
            "https://example.com/notify"
        );
    });

    it("can handle a subscriptionExpireTime given as a Date", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions",
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
            },
                { response: Promise.resolve(
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
                )}
            
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
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions",
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
            },
                { response: Promise.resolve(
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
                )}
            
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
        expect(subscription.maxNumOfReports).toEqual(5);
        expect(subscription.notificationAuthToken).toEqual("asdasd");

        expect(subscription.expiresAt).toEqual(
            new Date("2024-01-11T11:53:20.293671Z")
        );
    });

    it("can delete a subscription", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions",
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

        fetchMock.mockGlobal().delete(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions/89cc1355-2ff1-4091-a935-54817c821260",
            (_: any, req: any): any => {
                expect(req.method).toBe("DELETE");
            },
                { response: Promise.resolve({
                    status: 200,
                })}
            
        );

        await subscription.delete();

        expect(fetchMock.callHistory.calls().length).toBe(2);
    });

    it("can fetch a subscription by id", async () => {
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions/89cc1355-2ff1-4091-a935-54817c821260",
            (_: any, req: any): any => {
                expect(req.method).toBe("GET");
            },
               { response: Promise.resolve({
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
                            notificationAuthToken: "my-token",
                        },
                        maxNumberOfReports: 5,
                        startsAt: "2024-01-11T11:53:20.293671Z",
                    }),
                })
            }
        );

        const subscription = await client.deviceStatus.get(
            "89cc1355-2ff1-4091-a935-54817c821260"
        );

        expect(subscription.eventSubscriptionId).toBe(
            "89cc1355-2ff1-4091-a935-54817c821260"
        );
        expect(subscription.maxNumOfReports).toEqual(5);
        expect(subscription.notificationAuthToken).toEqual("my-token");
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
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/subscriptions",
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
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/connectivity",
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
            },
               { response: Promise.resolve({
                    status: 200,
                    body: JSON.stringify({
                        connectivityStatus: "CONNECTED_DATA",
                    }),
                })
            }
        );

        const status = await device.getConnectivity();

        expect(status).toBe("CONNECTED_DATA");
    });

    it("allows polling device roaming status", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/v0/roaming",
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
            },
               { response: Promise.resolve({
                    status: 200,
                    body: JSON.stringify({
                        roaming: true,
                        countryCode: 358,
                        countryName: ["Finland"],
                    }),
                })
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
