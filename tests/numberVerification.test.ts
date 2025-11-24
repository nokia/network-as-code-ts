import fetchMock from '@fetch-mock/jest';
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { InvalidParameterError } from "../src/errors";


jest.mock("node-fetch", () => {
    const nodeFetch = jest.requireActual("node-fetch");
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

afterEach(() => {
    fetchMock.unmockGlobal();
});

describe("Number Verification, verifying number tests", () => {
    it("should get verify number result as true with encoded state parameter in query", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/number-verification/number-verification/v0/verify?code=testCode1234&state=testSt%C3%A4%C3%A4%C3%A4%C3%A4%C3%A4" 
        fetchMock.mockGlobal().post(
            url,
            {
                body: {
                    devicePhoneNumberVerified: true
                }
            },
            {
                body: {
                    phoneNumber: "+3637123456"
                }
            },
        )

        expect(await device.verifyNumber("testCode1234", "testStäääää")).toBeTruthy();
        expect(fetchMock).toHaveFetched(url,  {
            method: "POST",
            headers:  {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
            }
        });
    });

    it("should get verify number result as false", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/number-verification/number-verification/v0/verify?code=testCode1234&state=testState" 
        fetchMock.mockGlobal().post(
            url,
            {
                body: {
                    devicePhoneNumberVerified: false
                }
            },
            {
                body: {
                    phoneNumber: "+3637123456"
                }
            },
        )

        expect(await device.verifyNumber("testCode1234", "testState")).toBeFalsy();
        expect(fetchMock).toHaveFetched(url,  {
            method: "POST",
            headers:  {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
            }
        });
    });

    it("no phonenumber provided, should get verify number result as error", async () => {
        const device = client.devices.get({
            ipv6Address: "2041:0000:140F::875B:131B:test",
        });

        try {
            await device.verifyNumber("testCode1234", "testState");
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidParameterError);
        }
    });
    
   it("should get phone number", async () => {
        const url = "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/number-verification/number-verification/v0/device-phone-number?code=testCode1234&state=testState" 
        fetchMock.mockGlobal().get(
            url,
            {
                body: {
                    devicePhoneNumber: "+123456789"
                }
            }
            );

        expect(await device.getPhoneNumber("testCode1234", "testState")).toMatch("+123456789");
        expect(fetchMock).toHaveFetched(url,  {
            method: "GET",
            headers:  {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
            }
        });
    });

});

