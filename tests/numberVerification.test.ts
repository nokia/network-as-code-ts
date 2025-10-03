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
        (req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                "X-RapidAPI-Key": 'TEST_TOKEN',
            })
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
        (req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                "X-RapidAPI-Key": 'TEST_TOKEN',
            })
        },
        { response: Promise.resolve({
            body: JSON.stringify({
                fast_flow_csp_auth_endpoint: "https://fastFlowCspAuthTestEndpoint/oauth2/v1/retrieve_csp_auth_url"
            })
        })}
    );
});

afterEach(() => {
    fetchMock.unmockGlobal();
});

describe("Number Verification, verifying number tests", () => {
    it("should get verify number result as true with encoded state parameter in query", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/number-verification/number-verification/v0/verify?code=testCode1234&state=testSt%C3%A4%C3%A4%C3%A4%C3%A4%C3%A4", 
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                }),
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+3637123456"
                })},
                { response: 
                    JSON.stringify({
                        devicePhoneNumberVerified: true
                })});

        expect(await device.verifyNumber("testCode1234", "testStäääää")).toBeTruthy();
    });

    it("should get verify number result as false", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/number-verification/number-verification/v0/verify?code=testCode1234&state=testState", 
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                }),
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+3637123456"
                })},
                { response: 
                    JSON.stringify({
                        devicePhoneNumberVerified: false
                })});

        expect(await device.verifyNumber("testCode1234", "testState")).toBeFalsy();
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
        fetchMock.mockGlobal().get(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/number-verification/number-verification/v0/device-phone-number?code=testCode1234&state=testState", 
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                })},
                { response: 
                    JSON.stringify({
                        devicePhoneNumber: "+123456789"
                })});

        expect(await device.getPhoneNumber("testCode1234", "testState")).toMatch("+123456789");
    });

});

