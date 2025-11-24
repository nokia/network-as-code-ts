import fetchMock from '@fetch-mock/jest';

import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { InvalidParameterError } from "../src/errors";

jest.mock("node-fetch", () => {
	const nodeFetch = jest.requireActual("node-fetch");
	// only needed if your application makes use of Response, Request
	// or Headers classes directly
	Object.assign(fetchMock.config, {
		fetch: nodeFetch,
		Response: nodeFetch.Response,
		Request: nodeFetch.Request,
		Headers: nodeFetch.Headers
	});
	return fetchMock.fetchHandler;
});

let client: NetworkAsCodeClient;

let device: Device;

beforeAll((): any => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get({
        phoneNumber: "+999999991000"
    });
    return client;
});

beforeEach(() => {
    fetchMock.mockReset();
});

afterEach(() => {
    fetchMock.unmockGlobal();
});


describe("Call Forwarding Signal", () => {
    it("should verify unconditional call forwarding", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/call-forwarding-signal/call-forwarding-signal/v0.3/unconditional-call-forwardings"
        fetchMock.mockGlobal().post(
            url,
            {
                body: {
                    active: true
                }
            },
            { 
                body: {
                    phoneNumber: "+999999991000"
                }
            },
        );

        const result = await device.verifyUnconditionalForwarding();
        expect(result).toBe(true);
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "+999999991000"
            }
        });
    });

    it("should get list of call forwarding services", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/call-forwarding-signal/call-forwarding-signal/v0.3/call-forwardings"
        fetchMock.mockGlobal().post(
            url,
            {
                body: JSON.stringify(["unconditional", "conditional_busy", "conditional_no_answer"]) 
                
            },
            { 
                body: {
                    phoneNumber: "+999999991000"
                }
            },
        );

        const result = await device.getCallForwarding();
        let types = ['inactive', 'unconditional', 'conditional_busy', 'conditional_not_reachable', 'conditional_no_answer']

        expect(result instanceof Array).toBeTruthy();
        expect(result.every((val) => types.includes(val)));
        expect(fetchMock).toHaveFetched(url, {
            method: "POST",
            body:  {
                phoneNumber: "+999999991000"
            }
        });
    });

    it("should raise exception if verifying forwarding without phone number", async () => {
        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.verifyUnconditionalForwarding()
        ).rejects.toThrow(InvalidParameterError);
    });

    it("should raise exception if getting forwarding services without phone number", async () => {
        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.getCallForwarding()
        ).rejects.toThrow(InvalidParameterError);
    });
});
