import fetchMock from '@fetch-mock/jest';
import { randomUUID } from "crypto";

import { NetworkAsCodeClient } from "../src";
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


beforeAll(() => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
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
            {
               body: {
                    client_id: "123456",
                    client_secret: "secret123"
                } 
            },
            { 
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                }
            },
        )       

        fetchMock.mockGlobal().get(
        "https://network-as-code.p-eu.rapidapi.com/.well-known/openid-configuration",
            {
               body: {
                    fast_flow_csp_auth_endpoint: "https://fastFlowCspAuthTestEndpoint/oauth2/v1/retrieve_csp_auth_url",
                } 
            },
            { 
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                }
            },
        )       
    });

    it("should get the credentials", async () => {
        expect(await client.authorization.credentials()).toEqual({clientId: "123456", clientSecret: "secret123"});
        expect(fetchMock).toHaveFetched("https://network-as-code.p-eu.rapidapi.com/oauth2/v1/auth/clientcredentials",  {
            method: "GET",
            headers:  {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
            }
        });
    });

    it("should get the endpoints", async () => {
        expect(await client.authorization.endpoints())
        .toEqual({fastFlowCspAuthEndpoint: "https://fastFlowCspAuthTestEndpoint/oauth2/v1/retrieve_csp_auth_url"});
        expect(fetchMock).toHaveFetched("https://network-as-code.p-eu.rapidapi.com/.well-known/openid-configuration"  ,  {
            method: "GET",
            headers:  {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
            }
        });
    });
    
    it("should create and return an authorization link", async () => {
        expect(await client.authorization.createAuthorizationLink("testRedirectUri", "testScope", "testLoginHint123", "testState"))
        .toEqual("https://fastFlowCspAuthTestEndpoint/oauth2/v1/retrieve_csp_auth_url?response_type=code&client_id=123456&redirect_uri=testRedirectUri&scope=testScope&login_hint=testLoginHint123&state=testState");
    });

    it("should create and return an authorization link, with optional parameters and encoded text", async () => {
        expect(await client.authorization.createAuthorizationLink("testRedirectUri", "testScope", "test login hint", "stateTestÄÄä"))
        .toEqual("https://fastFlowCspAuthTestEndpoint/oauth2/v1/retrieve_csp_auth_url?response_type=code&client_id=123456&redirect_uri=testRedirectUri&scope=testScope&login_hint=test%20login%20hint&state=stateTest%C3%84%C3%84%C3%A4");
    });

    it("should create a valid UUID with randomUUID", () => {
        expect(typeof(randomUUID())).toBe("string")
    })
});


describe("Authorization errors tests", () => {
    it("credential fetching should return APIError", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/oauth2/v1/auth/clientcredentials"
        fetchMock.mockGlobal().get(
           url, 
            {
                status: 400
            },
            { 
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                }
            },
        )       
        try {
            await client.authorization.credentials();
        } catch (error) {
            expect(error).toBeInstanceOf(APIError);
            }  
        expect(fetchMock).toHaveFetched(url,  {
            method: "GET",
            headers:  {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
            }
        });
        }
    );

    it("credential fetching should return ServiceError", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/oauth2/v1/auth/clientcredentials"
        fetchMock.mockGlobal().get(
           url, 
            {
                status: 500
            },
            { 
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                }
            },
        )       
        try {
            await client.authorization.credentials();
        } catch (error) {
            expect(error).toBeInstanceOf(ServiceError);
        }
        expect(fetchMock).toHaveFetched(url,  {
            method: "GET",
            headers:  {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
            }
        });
        }
    );

    it("endpoint fetching should return ServiceError", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/.well-known/openid-configuration"
        fetchMock.mockGlobal().get(
           url, 
            {
                status: 500
            },
            { 
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                }
            },
        )       
        try {
            await client.authorization.endpoints();
        } catch (error) {
            expect(error).toBeInstanceOf(ServiceError);
        }
        expect(fetchMock).toHaveFetched(url,  {
            method: "GET",
            headers:  {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
            }
        });
        }
    );

    it("endpoint fetching should return APIError", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/.well-known/openid-configuration"
        fetchMock.mockGlobal().get(
           url, 
            {
                status: 400
            },
            { 
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                }
            },
        )       
        try {
            await client.authorization.endpoints();
        } catch (error) {
            expect(error).toBeInstanceOf(APIError);
        }
        expect(fetchMock).toHaveFetched(url,  {
            method: "GET",
            headers:  {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
            }
        });
        }
    );
});
