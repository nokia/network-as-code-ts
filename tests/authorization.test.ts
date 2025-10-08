import fetchMock from '@fetch-mock/jest';
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import {
    APIError,
    ServiceError
} from "../src/errors"


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
        phoneNumber: "+3637123456"
    });
});

beforeEach(() => {
    fetchMock.mockReset();
});

afterEach(() => {
    fetchMock.unmockGlobal();
});


describe("Number Verification successfull authorization tests", () => {
    beforeEach(() => {
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/oauth2/v1/auth/clientcredentials",
            (_: any, req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    client_id: "123456",
                    client_secret: "secret123"
                })
            })}       
        );

        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/.well-known/openid-configuration",
            (_: any, req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                });
            },
            { response: Promise.resolve({
                body: JSON.stringify({
                    fast_flow_csp_auth_endpoint: "https://fastFlowCspAuthTestEndpoint/oauth2/v1/retrieve_csp_auth_url"
                }),
            })
            }       
        );
 
    });

    it("should get the credentials", async () => {
        expect(await client.authorization.credentials()).toEqual({clientId: "123456", clientSecret: "secret123"});
    });

    it("should get the endpoints", async () => {
        expect(await client.authorization.endpoints())
        .toEqual({fastFlowCspAuthEndpoint: "https://fastFlowCspAuthTestEndpoint/oauth2/v1/retrieve_csp_auth_url"});
    });
    
    it("should create and return an authorization link", async () => {
        expect(await client.authorization.createAuthorizationLink("testRedirectUri", "testScope", "testLoginHint123", "testState"))
        .toEqual("https://fastFlowCspAuthTestEndpoint/oauth2/v1/retrieve_csp_auth_url?response_type=code&client_id=123456&redirect_uri=testRedirectUri&scope=testScope&login_hint=testLoginHint123&state=testState");
    });

    it("should create and return an authorization link, with optional parameters and encoded text", async () => {
        expect(await client.authorization.createAuthorizationLink("testRedirectUri", "testScope", "test login hint", "stateTestÄÄä"))
        .toEqual("https://fastFlowCspAuthTestEndpoint/oauth2/v1/retrieve_csp_auth_url?response_type=code&client_id=123456&redirect_uri=testRedirectUri&scope=testScope&login_hint=test%20login%20hint&state=stateTest%C3%84%C3%84%C3%A4");
    });
});


describe("Authorization errors tests", () => {
    it("credential fetching should return APIError", async () => {
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/oauth2/v1/auth/clientcredentials",
            (_: any, req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": "TEST_TOKEN",
                });
            },
            { response: Promise.resolve({
                status: 400
                })
            });
        try {
            await client.authorization.credentials();
        } catch (error) {
            expect(error).toBeInstanceOf(APIError);
        }  
        }
    );

    it("credential fetching should return ServiceError", async () => {
        fetchMock.mockGlobal().get(
        "https://network-as-code.p-eu.rapidapi.com/oauth2/v1/auth/clientcredentials",
        (_: any, req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                "X-RapidAPI-Key": "TEST_TOKEN",
            });
        },
        { response: Promise.resolve({
            status: 500
            })
        });
        try {
            await client.authorization.credentials();
        } catch (error) {
            expect(error).toBeInstanceOf(ServiceError);
        }
        }
    );

    it("endpoint fetching should return ServiceError", async () => {
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/.well-known/openid-configuration",
            (_: any, req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                });
            },
            { response: Promise.resolve({
                status: 500
                })
            });
        try {
            await client.authorization.endpoints();
        } catch (error) {
            expect(error).toBeInstanceOf(ServiceError);
        }
        }
    );

    it("endpoint fetching should return APIError", async () => {
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/.well-known/openid-configuration",
            (_: any, req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                });
            },
            { response: Promise.resolve({
                status: 400
                })
            });
        try {
            await client.authorization.endpoints();
        } catch (error) {
            expect(error).toBeInstanceOf(APIError);
        }
        }
    );
});