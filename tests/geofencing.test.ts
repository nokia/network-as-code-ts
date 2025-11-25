
import fetchMock from '@fetch-mock/jest';
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { EventType } from '../src/models/geofencing';

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
    fetchMock.mockReset();
});

afterEach(() => {
    fetchMock.unmockGlobal();
});

describe("Geofencing", () => {
    it("should allow subscribing to geofencing information", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions",
            { 
                body: {
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
                }
            },
            { 
                body: {
                    "protocol":"HTTP",
                    "sink":"https://example.com/",
                    "types":["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
                    "config":{
                        "subscriptionDetail":{
                            "device":{
                                "networkAccessIdentifier":"testuser@open5glab.net",
                                "ipv4Address":{
                                    "publicAddress":"1.1.1.2",
                                    "publicPort":80
                                }
                            },
                            "area":{
                                "areaType":"CIRCLE,"
                                ,"center":{
                                    "latitude":-90,
                                    "longitude":-180
                                },
                                "radius":2001
                            }
                        },
                        "subscriptionExpireTime":"2025-01-23T10:40:30.616Z",
                        "subscriptionMaxEvents":1
                    }
                }
            }
        );

        const geofencingSubscription = await client.geofencing.subscribe(
            device,
            {
                sink: "https://example.com/",
                types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
                area: {areaType: "CIRCLE,", center: {latitude: -90, longitude: -180}, radius: 2001},
                subscriptionExpireTime: new Date("2025-01-23T10:40:30.616Z"),
                subscriptionMaxEvents: 1,
                initialEvent: false
            }
        )

        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions",
            {
                method: "POST",
                body: {
                    "protocol":"HTTP",
                    "sink":"https://example.com/",
                    "types":["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
                    "config":{
                        "subscriptionDetail":{
                            "device":{
                                "networkAccessIdentifier":"testuser@open5glab.net",
                                "ipv4Address":{
                                    "publicAddress":"1.1.1.2",
                                    "publicPort":80
                                }
                            },
                            "area":{
                                "areaType":"CIRCLE,"
                                ,"center":{
                                    "latitude":-90,
                                    "longitude":-180
                                },
                                "radius":2001
                            }
                        },
                        "subscriptionExpireTime":"2025-01-23T10:40:30.616Z",
                        "subscriptionMaxEvents":1
                    }
                }
            }
        );

        expect(geofencingSubscription.eventSubscriptionId).toBe("de87e438-58b4-42c3-9d49-0fbfbd878305")
        expect(geofencingSubscription.types).toEqual(["org.camaraproject.geofencing-subscriptions.v0.area-entered"])
        expect(geofencingSubscription.sink).toBe("https://example.com/")
        expect(geofencingSubscription.area).toEqual({"areaType": "CIRCLE", "center": {"latitude": -90, "longitude": -180}, "radius": 2001})
    });

    it("should allow subscribing to geofencing information with EventType", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions",
            {
                body: {
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
                                "areaType": "POI",
                                "poiName": "Testing"
                            }
                        },
                        "subscriptionExpireTime": "2025-01-23T10:40:30.616Z",
                        "subscriptionMaxEvents": 1,
                        "initialEvent": false
                    },
                    "id": "de87e438-58b4-42c3-9d49-0fbfbd878305",
                    "startsAt": "2025-01-23T10:40:30.616Z"
                }
            },
            {
                body: {
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
                                "areaType": "POI",
                                "poiName": "Testing"
                            }
                        },
                        "subscriptionExpireTime": "2025-01-23T10:40:30.616Z",
                        "subscriptionMaxEvents": 1,
                    }
                }
            }
        );
            
        const geofencingSubscription = await client.geofencing.subscribe(
            device,
            {
                sink: "https://example.com/",
                types: [EventType.AREA_ENTERED],
                area: {areaType: "POI", poiName: "Testing"},
                subscriptionExpireTime: new Date("2025-01-23T10:40:30.616Z"),
                subscriptionMaxEvents: 1,
                initialEvent: false
            }
        )
        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions",
            {
                method: "POST",
                body: {
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
                                "areaType": "POI",
                                "poiName": "Testing"
                            }
                        },
                        "subscriptionExpireTime": "2025-01-23T10:40:30.616Z",
                        "subscriptionMaxEvents": 1,
                    }
                }
            }
        );

        expect(geofencingSubscription.eventSubscriptionId).toBe("de87e438-58b4-42c3-9d49-0fbfbd878305")
        expect(geofencingSubscription.types).toEqual(["org.camaraproject.geofencing-subscriptions.v0.area-entered"])
        expect(geofencingSubscription.sink).toBe("https://example.com/")
        expect(geofencingSubscription.area).toEqual({"areaType": "POI", "poiName": "Testing"})
    })

    // TODO: Test subscription with/without optional params

    it("should allow subscriptions to be deleted", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions",
            { 
                body: {
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
                }
            }
        )

        const geofencingSubscription = await client.geofencing.subscribe(
            device,
            {
                sink: "https://example.com/",
                types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
                area: {areaType: "CIRCLE", center: {latitude: -90, longitude: -180}, radius: 2001},
                subscriptionExpireTime: new Date("2025-01-23T10:40:30.616Z"),
                subscriptionMaxEvents: 1,
                initialEvent: false
            }
        );
        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions",
            {
                method: "POST",
                body: {
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
                }
            }
        );

        fetchMock.mockGlobal().delete(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions/de87e438-58b4-42c3-9d49-0fbfbd878305",
            {
                status: 200
            }
        );

        await geofencingSubscription.delete();
            
        expect(fetchMock.callHistory.calls().length).toBe(2);
    })

    it("should allow getting one subscription that was already created", async () => {
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions/de87e438-58b4-42c3-9d49-0fbfbd878305",
            { 
                body: {
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
                }
            }
        );
        

        const geofencingSubscription = await client.geofencing.get("de87e438-58b4-42c3-9d49-0fbfbd878305")
        
        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions/de87e438-58b4-42c3-9d49-0fbfbd878305",
            {
                method: "GET"
            }
        );
        expect(geofencingSubscription.eventSubscriptionId).toBe("de87e438-58b4-42c3-9d49-0fbfbd878305")
    })

    it("should allow getting list of all subscriptions", async () => {
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions",
            { body: [
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
                        "id": "de87e438-58b4-42c3-9d49-0fbfbd878306",
                        "startsAt": "2025-01-23T10:40:30.616Z"
                    },
            ]}
        );

        const subscriptions = await client.geofencing.getAll();

        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions",
            {
                method: "GET"
            }
        );        

        expect(subscriptions.length).toBe(2)
    })

    it.failing("Should fail for request body", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions",
            { 
                body: {
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
                }
            },
            { 
                body: {
                    "protocol":"HTTP",
                    "sink":"https://example.com/",
                    "types":["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
                    "config":{
                        "subscriptionDetail":{
                            "device":{
                                "networkAccessIdentifier":"testuser@open5glab.net",
                                "ipv4Address":{
                                    "publicAddress":"1.1.1.2",
                                    "publicPort":80
                                }
                            },
                            "area":{
                                "areaType":"CIRCLE,"
                                ,"center":{
                                    "latitude":-90,
                                    "longitude":-180
                                },
                                "radius":2001
                            }
                        },
                        "subscriptionExpireTime":"2025-01-23T10:40:30.616Z",
                        "subscriptionMaxEvents":1
                    }
                }
            }
        );

        const geofencingSubscription = await client.geofencing.subscribe(
            device,
            {
                sink: "https://example.com/",
                types: ["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
                area: {areaType: "CIRCLE,", center: {latitude: -90, longitude: -180}, radius: 2001},
                subscriptionExpireTime: new Date("2025-01-23T10:40:30.616Z"),
                subscriptionMaxEvents: 1,
                initialEvent: false
            }
        )

        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3/subscriptions",
            {
                method: "POST",
                body: {
                    "protocol":"wrong",
                    "sink":"wrong",
                    "types":["org.camaraproject.geofencing-subscriptions.v0.area-entered"],
                    "config":{
                        "subscriptionDetail":{
                            "device":{
                                "networkAccessIdentifier":"testuser@open5glab.net",
                                "ipv4Address":{
                                    "publicAddress":"0.0.0.0",
                                    "publicPort":80
                                }
                            },
                            "area":{
                                "areaType":"WRONG,"
                                ,"center":{
                                    "latitude":-90,
                                    "longitude":-180
                                },
                                "radius":2001
                            }
                        },
                        "subscriptionExpireTime":"2025-01-23T10:40:30.616Z",
                        "subscriptionMaxEvents":1
                    }
                }
            }
        );
    });
});