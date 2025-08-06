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
        phoneNumber: "+367199991000"
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
        fetchMock.mockGlobal().post(
            "https://call-forwarding-signal.p-eu.rapidapi.com/unconditional-call-forwardings",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+367199991000"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    active: true
                })
            })
            }
        );

        const result = await device.verifyUnconditionalForwarding();
        expect(result).toBe(true);
    });

    it("should get list of call forwarding services", async () => {
        fetchMock.mockGlobal().post(
            "https://call-forwarding-signal.p-eu.rapidapi.com/call-forwardings",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+367199991000"
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify([
                        "unconditional", 
                        "conditional_busy", 
                        "conditional_no_answer"
                    ])
            })
            }
        );

        const result = await device.getCallForwarding();
        let types = ['inactive', 'unconditional', 'conditional_busy', 'conditional_not_reachable', 'conditional_no_answer']

        expect(result instanceof Array).toBeTruthy();
        expect(result.every((val) => types.includes(val)));
    });

    it("should raise exception if verifying forwarding without phone number", async () => {
        fetchMock.mockGlobal().post(
            "https://call-forwarding-signal.p-eu.rapidapi.com/unconditional-call-forwardings",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    networkAccessIdentifier: "device@testcsp.net"
                });
            }
        );

        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.verifyUnconditionalForwarding()
        ).rejects.toThrow(InvalidParameterError);
    });

    it("should raise exception if getting forwarding services without phone number", async () => {
        fetchMock.mockGlobal().post(
            "https://call-forwarding-signal.p-eu.rapidapi.com/call-forwardings",
            (_: any, req: any): any => {
                expect(JSON.parse(req.body.toString())).toEqual({
                    networkAccessIdentifier: "device@testcsp.net"
                });
            }
        );

        const deviceWithoutNumber = client.devices.get({
            networkAccessIdentifier: "device@testcsp.net"
        });

        expect(
            async () => await deviceWithoutNumber.getCallForwarding()
        ).rejects.toThrow(InvalidParameterError);
    });
});