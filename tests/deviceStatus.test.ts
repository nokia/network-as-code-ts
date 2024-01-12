
import fetchMock from "jest-fetch-mock";

import { NetworkAsCodeClient } from "../src/network_as_code/client";
import { Device, DeviceIpv4Addr } from "../src/network_as_code/models/device";

fetchMock.enableMocks();

let client: NetworkAsCodeClient;
let device: Device;

beforeAll(() => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get("test-device@testcsp.net", { publicAddress: "1.1.1.2", privateAddress: "1.1.1.2", publicPort: 80 });
})

beforeEach(() => {
    fetchMock.resetMocks();
})

describe('Device Status', () => {
    it('can invoke subscription to CONNECTIVITY updates', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(
            {
                "eventSubscriptionId": "89cc1355-2ff1-4091-a935-54817c821260",
                "subscriptionDetail": {
                    "device": {
                        "networkAccessIdentifier": "test-device@testcsp.net",
                        "ipv4Address": {
                            "publicAddress": "1.1.1.2",
                            "privateAddress": "1.1.1.2",
                            "publicPort": 80,
                        }
                    },
                    "eventType": "CONNECTIVITY"
                },
                "webhook": {
                    "notificationUrl": "https://example.com/notify"
                },
                "startsAt": "2024-01-11T11:53:20.293671Z"
            }
        ));

        const subscription = await client.deviceStatus.subscribe(device, "CONNECTIVITY", "https://example.com/notify");

        expect(subscription.eventType).toBe("CONNECTIVITY");
    }) 
    
    it('sends a request out on subscribe', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(
            {
                "eventSubscriptionId": "89cc1355-2ff1-4091-a935-54817c821260",
                "subscriptionDetail": {
                    "device": {
                        "networkAccessIdentifier": "test-device@testcsp.net",
                        "ipv4Address": {
                            "publicAddress": "1.1.1.2",
                            "privateAddress": "1.1.1.2",
                            "publicPort": 80,
                        }
                    },
                    "eventType": "CONNECTIVITY"
                },
                "webhook": {
                    "notificationUrl": "https://example.com/notify"
                },
                "startsAt": "2024-01-11T11:53:20.293671Z"
            }
        ));

        await client.deviceStatus.subscribe(device, "CONNECTIVITY", "https://example.com/notify");

        expect(fetchMock.mock.calls.length).toBe(1);
    }) 

    it('uses the returned response to fill the subscription object', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(
            {
                "eventSubscriptionId": "89cc1355-2ff1-4091-a935-54817c821260",
                "subscriptionDetail": {
                    "device": {
                        "networkAccessIdentifier": "test-device@testcsp.net",
                        "ipv4Address": {
                            "publicAddress": "1.1.1.2",
                            "privateAddress": "1.1.1.2",
                            "publicPort": 80,
                        }
                    },
                    "eventType": "CONNECTIVITY"
                },
                "webhook": {
                    "notificationUrl": "https://example.com/notify"
                },
                "startsAt": "2024-01-11T11:53:20.293671Z"
            }
        ));

        const subscription = await client.deviceStatus.subscribe(device, "CONNECTIVITY", "https://example.com/notify");

        expect(subscription.eventSubscriptionId).toBe("89cc1355-2ff1-4091-a935-54817c821260");
        expect(subscription.notificationUrl).toBe("https://example.com/notify");
        expect(subscription.startsAt).toBe("2024-01-11T11:53:20.293671Z");
    }) 

    it('sends the right body to the correct URL for subscription', async () => {
        fetchMock.mockOnceIf("https://device-status.p-eu.rapidapi.com/event-subscriptions", (req: any): any => {
            expect(JSON.parse(req.body.toString())).toEqual({
                subscriptionDetail: {
                    device: {
                        networkAccessIdentifier: 'test-device@testcsp.net',
                        ipv4Address: {
                            publicAddress: '1.1.1.2',
                            privateAddress: '1.1.1.2',
                            publicPort: 80
                        }
                    },
                    eventType: 'CONNECTIVITY'
                },
                webhook: {
                    notificationUrl: 'https://example.com/notify'
                }
            })

            return Promise.resolve(
                JSON.stringify(
                    {
                        "eventSubscriptionId": "89cc1355-2ff1-4091-a935-54817c821260",
                        "subscriptionDetail": {
                            "device": {
                                "networkAccessIdentifier": "test-device@testcsp.net",
                                "ipv4Address": {
                                    "publicAddress": "1.1.1.2",
                                    "privateAddress": "1.1.1.2",
                                    "publicPort": 80,
                                }
                            },
                            "eventType": "CONNECTIVITY"
                        },
                        "webhook": {
                            "notificationUrl": "https://example.com/notify"
                        },
                        "startsAt": "2024-01-11T11:53:20.293671Z"
                    }
                ));
        })

        await client.deviceStatus.subscribe(device, "CONNECTIVITY", "https://example.com/notify");
    }) 

    it('handles optional parameters in subscription', async () => {
        fetchMock.mockOnceIf("https://device-status.p-eu.rapidapi.com/event-subscriptions", (req: any): any => {
            expect(JSON.parse(req.body.toString())).toEqual({
                subscriptionDetail: {
                    device: {
                        networkAccessIdentifier: 'test-device@testcsp.net',
                        ipv4Address: {
                            publicAddress: '1.1.1.2',
                            privateAddress: '1.1.1.2',
                            publicPort: 80
                        }
                    },
                    eventType: 'CONNECTIVITY'
                },
                subscriptionExpireTime: "2024-01-11T11:53:20.293671Z",
                maxNumberOfReports: 5,
                webhook: {
                    notificationUrl: 'https://example.com/notify',
                    notificationAuthToken: "asdasd"
                }
            })

            return Promise.resolve(
                JSON.stringify(
                    {
                        "eventSubscriptionId": "89cc1355-2ff1-4091-a935-54817c821260",
                        "subscriptionDetail": {
                            "device": {
                                "networkAccessIdentifier": "test-device@testcsp.net",
                                "ipv4Address": {
                                    "publicAddress": "1.1.1.2",
                                    "privateAddress": "1.1.1.2",
                                    "publicPort": 80,
                                }
                            },
                            "eventType": "CONNECTIVITY"
                        },
                        "webhook": {
                            "notificationUrl": "https://example.com/notify",
                            "notificationAuthToken": "asdasd"
                        },
                        "startsAt": "2024-01-11T11:53:20.293671Z",
                        "expiresAt": "2024-01-11T11:53:20.293671Z"
                    }
                ));
        })

        const subscription = await client.deviceStatus.subscribe(device, "CONNECTIVITY", "https://example.com/notify", {
            subscriptionExpireTime: "2024-01-11T11:53:20.293671Z",
            maxNumberOfReports: 5,
            notificationAuthToken: "asdasd"
        });

        expect(subscription.expiresAt).toBe("2024-01-11T11:53:20.293671Z");
    })

    it('can delete a subscription', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(
            {
                "eventSubscriptionId": "89cc1355-2ff1-4091-a935-54817c821260",
                "subscriptionDetail": {
                    "device": {
                        "networkAccessIdentifier": "test-device@testcsp.net",
                        "ipv4Address": {
                            "publicAddress": "1.1.1.2",
                            "privateAddress": "1.1.1.2",
                            "publicPort": 80,
                        }
                    },
                    "eventType": "CONNECTIVITY"
                },
                "webhook": {
                    "notificationUrl": "https://example.com/notify"
                },
                "startsAt": "2024-01-11T11:53:20.293671Z"
            }
        ));

        const subscription = await client.deviceStatus.subscribe(device, "CONNECTIVITY", "https://example.com/notify");

        fetchMock.mockOnceIf("https://device-status.p-eu.rapidapi.com/event-subscriptions/89cc1355-2ff1-4091-a935-54817c821260", (req: any): any => {
            expect(req.method).toBe("DELETE");

            return Promise.resolve({
                status: 200
            })
        })

        await subscription.delete();

        expect(fetchMock.mock.calls.length).toBe(2);
    })

    it('can fetch a subscription by id', async () => {
        fetchMock.mockOnceIf("https://device-status.p-eu.rapidapi.com/event-subscriptions/89cc1355-2ff1-4091-a935-54817c821260", (req: any): any => {
            expect(req.method).toBe("GET");

            return Promise.resolve({
                status: 200,
                body: JSON.stringify({
                    "eventSubscriptionId": "89cc1355-2ff1-4091-a935-54817c821260",
                    "subscriptionDetail": {
                        "device": {
                            "networkAccessIdentifier": "test-device@testcsp.net",
                            "ipv4Address": {
                                "publicAddress": "1.1.1.2",
                                "privateAddress": "1.1.1.2",
                                "publicPort": 80,
                            }
                        },
                        "eventType": "CONNECTIVITY"
                    },
                    "webhook": {
                        "notificationUrl": "https://example.com/notify"
                    },
                    "startsAt": "2024-01-11T11:53:20.293671Z"
                })
            })
        })

        const subscription = await client.deviceStatus.get("89cc1355-2ff1-4091-a935-54817c821260");

        expect(subscription.eventSubscriptionId).toBe("89cc1355-2ff1-4091-a935-54817c821260");
        expect(subscription.device).toBeDefined();
        expect(subscription.device.networkAccessIdentifier).toBe("test-device@testcsp.net");
        expect(subscription.device.ipv4Address).toEqual({ publicAddress: "1.1.1.2", privateAddress: "1.1.1.2", publicPort: 80});
    })
})
