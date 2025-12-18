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
            publicPort: 80
        }
    });
});

beforeEach(() => {
    fetchMock.mockReset();
});

afterEach(() => {
    fetchMock.unmockGlobal();
});

describe("Device Status Reachability Tests", () => {
    it("can invoke subscription to REACHABILITY_SMS updates", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/device-reachability-status-subscriptions/v0.7/subscriptions",
            JSON.stringify({
                id: "89cc1355-2ff1-4091-a935-54817c821260",
                sink: "https://example.com/notify",
                protocol: "HTTP",
                types: ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"],
                config: {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            }
                        }
                    },
                    subscriptionExpireTime: "2024-07-17T13:18:23.682Z",
                    subscriptionMaxEvents: 5,
                    initialEvent: true
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
                expiresAt: "2024-07-17T13:18:23.682Z",
                status: "ACTIVE"
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            [EventType.REACHABILITY_SMS],
            "https://example.com/notify",
            {
                initialEvent: true,
                subscriptionMaxEvents: 5,
                subscriptionExpireTime: "2024-07-17T13:18:23.682Z"
            }
        );

        expect(subscription.eventType).toStrictEqual(["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"]);
    });


    it("can invoke subscription to REACHABILITY_DATA updates", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/device-reachability-status-subscriptions/v0.7/subscriptions",
            JSON.stringify({
                id: "89cc1355-2ff1-4091-a935-54817c821260",
                sink: "https://example.com/notify",
                protocol: "HTTP",
                types: ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"],
                config: {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            }
                        }
                    },
                    subscriptionExpireTime: null,
                    subscriptionMaxEvents: null,
                    initialEvent: null
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
                expiresAt: "2024-07-03T21:12:02.871Z",
                status: "ACTIVE"
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            [EventType.REACHABILITY_DATA],
            "https://example.com/notify"
        );

        expect(subscription.eventType).toStrictEqual(["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"]);
    });

    it("can delete a reachability subscription", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/device-status/device-reachability-status-subscriptions/v0.7/subscriptions"
        fetchMock.mockGlobal().post(
            url,
            JSON.stringify({
                id: "89cc1355-2ff1-4091-a935-54817c8212604",
                sink: "https://example.com/notify",
                protocol: "HTTP",
                types: ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-sms"],
                config: {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            }
                        }
                    },
                    subscriptionExpireTime: null,
                    subscriptionMaxEvents: null,
                    initialEvent: null
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
                expiresAt: "2024-07-03T21:12:02.871Z",
                status: "ACTIVE"
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            [EventType.REACHABILITY_SMS],
            "https://example.com/notify"
        );

        fetchMock.mockGlobal().delete(
            `${url}/89cc1355-2ff1-4091-a935-54817c8212604`,
                { 
                    status: 200,
                }
        );

        await subscription.delete()

        expect(fetchMock.callHistory.calls().length).toBe(2);
        expect(fetchMock).toHaveFetched(`${url}/89cc1355-2ff1-4091-a935-54817c8212604`, {
            method: "DELETE",
        });
    });

    it("can fetch a reachability subscription by id", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/device-status/device-reachability-status-subscriptions/v0.7/subscriptions/89cc1355-2ff1-4091-a935-54817c821260"
        fetchMock.mockGlobal().get(
           url, 
               { 
                    status: 200,
                    body: {
                        id: "89cc1355-2ff1-4091-a935-54817c821260",
                        sink: "https://example.com/notify",
                        protocol: "HTTP",
                        types: ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"],
                        config: {
                            subscriptionDetail: {
                                device: {
                                    networkAccessIdentifier: "test-device@testcsp.net",
                                    ipv4Address: {
                                        publicAddress: "1.1.1.2",
                                        privateAddress: "1.1.1.2",
                                        publicPort: 80,
                                    }
                                }
                            },
                            subscriptionExpireTime: null,
                            subscriptionMaxEvents: null,
                            initialEvent: null
                        },
                        startsAt: "2024-01-11T11:53:20.293671Z",
                        expiresAt: "2024-07-03T21:12:02.871Z",
                        status: "ACTIVE"
                    }
                })

        const subscription = await client.deviceStatus.getReachabilitySubscription(
            "89cc1355-2ff1-4091-a935-54817c821260"
        );
        expect(subscription.eventSubscriptionId).toBe(
            "89cc1355-2ff1-4091-a935-54817c821260"
        );
        expect(fetchMock).toHaveFetched(url , {
            method: "GET",
        });
    });

    it("allows polling device reachability", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/device-status/device-reachability-status/v1/retrieve"
        fetchMock.mockGlobal().post(
            url,
                {
                    status: 200,
                    body: JSON.stringify({
                        lastStatusTime: "2024-02-20T10:41:38.657Z",
                        reachable: true,
                        connectivity: ["SMS"]
                    })
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
                        }
                    }
                });

        const status = await device.getReachability();

        expect(status).toStrictEqual({"connectivity": ["SMS"], "lastStatusTime": "2024-02-20T10:41:38.657Z", "reachable": true});
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
                    }
                }
            });
        });

    it("sends a request out on subscribe", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/device-reachability-status-subscriptions/v0.7/subscriptions",
            JSON.stringify({
                id: "89cc1355-2ff1-4091-a935-54817c8212604",
                sink: "https://example.com/notify",
                protocol: "HTTP",
                types: ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"],
                config: {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            }
                        }
                    },
                    subscriptionExpireTime: null,
                    subscriptionMaxEvents: null,
                    initialEvent: null
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
                expiresAt: "2024-07-03T21:12:02.871Z",
                status: "ACTIVE"
            })
        );

        await client.deviceStatus.subscribe(
            device,
            [EventType.REACHABILITY_DATA],
            "https://example.com/notify"
        );

        expect(fetchMock.callHistory.calls().length).toBe(1);
    });

    it("can handle a subscriptionExpireTime given as a Date", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/device-status/device-reachability-status-subscriptions/v0.7/subscriptions"
        fetchMock.mockGlobal().post(
            url,
                {
                    body: JSON.stringify({
                        id: "89cc1355-2ff1-4091-a935-54817c8212604",
                        sink: "https://example.com/notify",
                        protocol: "HTTP",
                        types: ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"],
                        config: {
                            subscriptionDetail: {
                                device: {
                                    networkAccessIdentifier: "test-device@testcsp.net",
                                    ipv4Address: {
                                        publicAddress: "1.1.1.2",
                                        privateAddress: "1.1.1.2",
                                        publicPort: 80,
                                    }
                                }
                            },
                            subscriptionExpireTime: "2024-07-17T13:18:23.682Z",
                            subscriptionMaxEvents: 2
                        },
                        startsAt: "2024-01-11T11:53:20.293671Z",
                        expiresAt: "2024-07-03T21:12:02.871Z",
                        status: "ACTIVE"
                    })
                },
                {
                    body: { 
                        sink: "https://example.com/notify",
                        protocol: "HTTP",
                        types: ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"],
                        config: {
                            subscriptionDetail: {
                                device: {
                                    networkAccessIdentifier: "test-device@testcsp.net",
                                    ipv4Address: {
                                        publicAddress: "1.1.1.2",
                                        privateAddress: "1.1.1.2",
                                        publicPort: 80,
                                    }
                                }
                            },
                            subscriptionExpireTime: "2024-07-17T13:18:23.682Z",
                            subscriptionMaxEvents: 2
                        }
                    }
                });

        await client.deviceStatus.subscribe(
            device,
            ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"],
            "https://example.com/notify",
            {
                subscriptionExpireTime: new Date("2024-07-17T13:18:23.682Z"),
                subscriptionMaxEvents: 2
            });
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body: {
                    sink: "https://example.com/notify",
                    protocol: "HTTP",
                    types: ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"],
                    config: {
                        subscriptionDetail: {
                            device: {
                                networkAccessIdentifier: "test-device@testcsp.net",
                                ipv4Address: {
                                    publicAddress: "1.1.1.2",
                                    privateAddress: "1.1.1.2",
                                    publicPort: 80,
                                }
                            }
                        },
                        subscriptionExpireTime: "2024-07-17T13:18:23.682Z",
                        subscriptionMaxEvents: 2
                    }
                }
            });
        });
    });

describe("Device Status Roaming Tests", () => {
    it("can invoke subscription to ROAMING_STATUS updates", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/device-roaming-status-subscriptions/v0.7/subscriptions",
            JSON.stringify({
                id: "89cc1355-2ff1-4091-a935-54817c821260",
                sink: "https://example.com/notify",
                protocol: "HTTP",
                types: ["org.camaraproject.device-roaming-status-subscriptions.v0.roaming-status"],
                config: {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            }
                        }
                    },
                    subscriptionExpireTime: "2024-07-17T13:18:23.682Z",
                    subscriptionMaxEvents: 5,
                    initialEvent: true
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
                expiresAt: "2024-07-03T21:12:02.871Z",
                status: "ACTIVE"
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            [EventType.ROAMING_STATUS],
            "https://example.com/notify"
        );

        expect(subscription.eventType).toStrictEqual(["org.camaraproject.device-roaming-status-subscriptions.v0.roaming-status"]);
    });

    it("can create subscription with String[] event type", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/device-roaming-status-subscriptions/v0.7/subscriptions",
            JSON.stringify({
                id: "89cc1355-2ff1-4091-a935-54817c821260",
                sink: "https://example.com/notify",
                protocol: "HTTP",
                types: ["org.camaraproject.device-roaming-status-subscriptions.v0.roaming-status"],
                config: {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            }
                        }
                    },
                    subscriptionExpireTime: null,
                    subscriptionMaxEvents: null,
                    initialEvent: null
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
                expiresAt: "2024-07-03T21:12:02.871Z",
                status: "ACTIVE"
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            ["org.camaraproject.device-roaming-status-subscriptions.v0.roaming-status"],
            "https://example.com/notify"
        );

        expect(subscription.eventType).toStrictEqual(["org.camaraproject.device-roaming-status-subscriptions.v0.roaming-status"]);
    });

    it("uses the returned response to fill the subscription object", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/device-status/device-roaming-status-subscriptions/v0.7/subscriptions",
            JSON.stringify({
                id: "89cc1355-2ff1-4091-a935-54817c821260",
                sink: "https://example.com/notify",
                protocol: "HTTP",
                types: ["org.camaraproject.device-roaming-status-subscriptions.v0.roaming-status"],
                config: {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            }
                        }
                    },
                    subscriptionExpireTime: null,
                    subscriptionMaxEvents: null,
                    initialEvent: null
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
                expiresAt: "2024-07-03T21:12:02.871Z",
                status: "ACTIVE"
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            [EventType.ROAMING_STATUS],
            "https://example.com/notify"
        );

        expect(subscription.eventSubscriptionId).toBe(
            "89cc1355-2ff1-4091-a935-54817c821260"
        );
        expect(subscription.sink).toBe("https://example.com/notify");
        expect(subscription.startsAt).toEqual(
            new Date("2024-01-11T11:53:20.293671Z")
        );
    });

    it("allows polling device roaming status", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/device-status/device-roaming-status/v1/retrieve"
        fetchMock.mockGlobal().post(
            url,
                {
                    status: 200,
                    body: JSON.stringify({
                        lastStatusTime: "2024-02-20T10:41:38.657Z",
                        roaming: true,
                        countryCode: 358,
                        countryName: ["Finland"]
                    })
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
                    }
                },
            );

        const status = await device.getRoaming();

        expect(status).toStrictEqual({
            lastStatusTime: "2024-02-20T10:41:38.657Z",
            roaming: true,
            countryCode: 358,
            countryName: ["Finland"],
        });
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body: {
                    device: {
                        networkAccessIdentifier: "test-device@testcsp.net",
                        ipv4Address: {
                            publicAddress: "1.1.1.2",
                            privateAddress: "1.1.1.2",
                            publicPort: 80,
                        },
                    },
                }
            });
    });

    it("can fetch a roaming subscription by id", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/device-status/device-roaming-status-subscriptions/v0.7/subscriptions/89cc1355-2ff1-4091-a935-54817c821260"
        fetchMock.mockGlobal().get(
            url,
               { 
                status: 200,
                body: JSON.stringify({
                    id: "89cc1355-2ff1-4091-a935-54817c821260",
                    sink: "https://example.com/notify",
                    protocol: "HTTP",
                    types: ["org.camaraproject.device-roaming-status-subscriptions.v0.roaming-on"],
                    config: {
                        subscriptionDetail: {
                            device: {
                                networkAccessIdentifier: "test-device@testcsp.net",
                                ipv4Address: {
                                    publicAddress: "1.1.1.2",
                                    privateAddress: "1.1.1.2",
                                    publicPort: 80,
                                }
                            }
                        },
                        subscriptionExpireTime: null,
                        subscriptionMaxEvents: null,
                        initialEvent: null
                    },
                    startsAt: "2024-01-11T11:53:20.293671Z",
                    expiresAt: "2024-07-03T21:12:02.871Z",
                    status: "ACTIVE"
                }),
            }
        );

        const subscription = await client.deviceStatus.getRoamingSubscription(
            "89cc1355-2ff1-4091-a935-54817c821260"
        );
        expect(subscription.eventSubscriptionId).toBe(
            "89cc1355-2ff1-4091-a935-54817c821260"
        );
        expect(fetchMock).toHaveFetched(url, {
            method: "GET",
        });
    });

     it("can delete a roaming subscription", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/device-status/device-roaming-status-subscriptions/v0.7/subscriptions"
        fetchMock.mockGlobal().post(
            url,
            JSON.stringify({
                id: "89cc1355-2ff1-4091-a935-54817c8212604",
                sink: "https://example.com/notify",
                protocol: "HTTP",
                types: ["org.camaraproject.device-roaming-status-subscriptions.v0.roaming-on"],
                config: {
                    subscriptionDetail: {
                        device: {
                            networkAccessIdentifier: "test-device@testcsp.net",
                            ipv4Address: {
                                publicAddress: "1.1.1.2",
                                privateAddress: "1.1.1.2",
                                publicPort: 80,
                            }
                        }
                    },
                    subscriptionExpireTime: null,
                    subscriptionMaxEvents: null,
                    initialEvent: null
                },
                startsAt: "2024-01-11T11:53:20.293671Z",
                expiresAt: "2024-07-03T21:12:02.871Z",
                status: "ACTIVE"
            })
        );

        const subscription = await client.deviceStatus.subscribe(
            device,
            [EventType.ROAMING_ON],
            "https://example.com/notify"
        );


        fetchMock.mockGlobal().delete(
            `${url}/89cc1355-2ff1-4091-a935-54817c8212604`,
                { 
                    status: 200,
                }
        );

        await subscription.delete();

        expect(fetchMock.callHistory.calls().length).toBe(2);
        expect(fetchMock).toHaveFetched(`${url}/89cc1355-2ff1-4091-a935-54817c8212604`, {
            method: "DELETE",
            });
    });

});   


describe("Device Status Get All Tests", () => {
    it("can get list of subscriptions", async () => {
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/device-status/device-reachability-status-subscriptions/v0.7/subscriptions",
            JSON.stringify([
                {
                    id: "89cc1355-2ff1-4091-a935-54817c8212601",
                    sink: "https://example.com/notify",
                    protocol: "HTTP",
                    types: ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"],
                    config: {
                        subscriptionDetail: {
                            device: {
                                networkAccessIdentifier: "test-device@testcsp.net",
                                ipv4Address: {
                                    publicAddress: "1.1.1.2",
                                    privateAddress: "1.1.1.2",
                                    publicPort: 80,
                                }
                            }
                        },
                        subscriptionExpireTime: "2024-07-17T13:18:23.682Z",
                        subscriptionMaxEvents: 5,
                        initialEvent: true
                    },
                    startsAt: "2024-01-11T11:53:20.293671Z",
                    expiresAt: "2024-07-03T21:12:02.871Z",
                    status: "ACTIVE"
                },
                {
                    id: "89cc1355-2ff1-4091-a935-54817c8212602",
                    sink: "https://example.com/notify",
                    protocol: "HTTP",
                    types: ["org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data"],
                    config: {
                        subscriptionDetail: {
                            device: {
                                networkAccessIdentifier: "test-device@testcsp.net",
                                ipv4Address: {
                                    publicAddress: "1.1.1.2",
                                    privateAddress: "1.1.1.2",
                                    publicPort: 80,
                                }
                            }
                        },
                        subscriptionExpireTime: "2024-07-17T13:18:23.682Z",
                        subscriptionMaxEvents: 5,
                        initialEvent: true
                    },
                    startsAt: "2024-01-11T11:53:20.293671Z",
                    expiresAt: "2024-07-03T21:12:02.871Z",
                    status: "ACTIVE"
                }
            ])
        );


        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/device-status/device-roaming-status-subscriptions/v0.7/subscriptions",
            JSON.stringify([
                {
                    id: "89cc1355-2ff1-4091-a935-54817c8212603",
                    sink: "https://example.com/notify",
                    protocol: "HTTP",
                    types: ["org.camaraproject.device-roaming-status-subscriptions.v0.roaming-status"],
                    config: {
                        subscriptionDetail: {
                            device: {
                                networkAccessIdentifier: "test-device@testcsp.net",
                                ipv4Address: {
                                    publicAddress: "1.1.1.2",
                                    privateAddress: "1.1.1.2",
                                    publicPort: 80,
                                }
                            }
                        },
                        subscriptionExpireTime: "2024-07-17T13:18:23.682Z",
                        subscriptionMaxEvents: 5,
                        initialEvent: true
                    },
                    startsAt: "2024-01-11T11:53:20.293671Z",
                    expiresAt: "2024-07-03T21:12:02.871Z",
                    status: "ACTIVE"
                },
                {
                    id: "89cc1355-2ff1-4091-a935-54817c8212604",
                    sink: "https://example.com/notify",
                    protocol: "HTTP",
                    types: ["org.camaraproject.device-roaming-status-subscriptions.v0.roaming-status"],
                    config: {
                        subscriptionDetail: {
                            device: {
                                networkAccessIdentifier: "test-device@testcsp.net",
                                ipv4Address: {
                                    publicAddress: "1.1.1.2",
                                    privateAddress: "1.1.1.2",
                                    publicPort: 80,
                                }
                            }
                        },
                        subscriptionExpireTime: "2024-07-17T13:18:23.682Z",
                        subscriptionMaxEvents: 5,
                        initialEvent: true
                    },
                    startsAt: "2024-01-11T11:53:20.293671Z",
                    expiresAt: "2024-07-03T21:12:02.871Z",
                    status: "ACTIVE"
                }
            ])
        );

        const subscriptions = await client.deviceStatus.getSubscriptions();
        expect(subscriptions.length).toBe(4);
    });

});
