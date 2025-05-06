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
        "https://nac-authorization-server.p-eu.rapidapi.com/auth/clientcredentials",
        (req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "nac-authorization-server.nokia.rapidapi.com",
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
        "https://well-known-metadata.p-eu.rapidapi.com/openid-configuration",
        (req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "well-known-metadata.nokia.rapidapi.com",
                "X-RapidAPI-Key": 'TEST_TOKEN',
            })
        },
        { response: Promise.resolve({
            body: JSON.stringify({
                authorization_endpoint: "https://authorizationTestEndpoint/oauth2/v1/authorize",
                token_endpoint: "https://tokenTestEndpoint/oauth2/v1/token"
            })
        })}
    );

    fetchMock.mockGlobal().post(  
        "https://tokenTestEndpoint/oauth2/v1/token", 
        (req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            expect(req.body).toEqual({
                "client_id":"123456&client_secret=secret123&grant_type=authorization_code&code=testCode1234"
        })},
        { response: Promise.resolve({
            body: JSON.stringify({
                access_token: "testAccessToken123456",
                token_type: "testTokenTypeBearer",
                expires_in: "testExpiresIn"
            })
        })}
    );
});

afterEach(() => {
    fetchMock.unmockGlobal();
});

describe("Number Verification access token and verifying number tests", () => {
    it("should get an access token", async () => {
        expect(await device.getSingleUseAccessToken("testCode1234")).toEqual({accessToken: "testAccessToken123456", tokenType: "testTokenTypeBearer", expiresIn: "testExpiresIn"});
    });

    it("should get verify number result as true", async () => {
        fetchMock.mockGlobal().post(
            "https://number-verification.p-eu.rapidapi.com/verify", 
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Authorization": "testTokenTypeBearer testAccessToken123456",
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "number-verification.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                }),
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+3637123456"
                })},
                { response: 
                    JSON.stringify({
                        devicePhoneNumberVerified: true
                })});

        expect(await device.verifyNumber("testCode1234")).toBeTruthy();
    });


    it("should get verify number result as false", async () => {
        fetchMock.mockGlobal().post(
            "https://number-verification.p-eu.rapidapi.com/verify", 
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Authorization": "testTokenTypeBearer testAccessToken123456",
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "number-verification.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                }),
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+3637123456"
                })},
                { response: 
                    JSON.stringify({
                        devicePhoneNumberVerified: false
                })});

        expect(await device.verifyNumber("testCode1234")).toBeFalsy();
    });

    it("no phonenumber provided, should get verify number result as error", async () => {
        const device = client.devices.get({
            ipv6Address: "2041:0000:140F::875B:131B:test",
        });

        try {
            await device.verifyNumber("testCode1234");
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidParameterError);
        }
    });

    it("should get phone number", async () => {
        fetchMock.mockGlobal().get(
            "https://number-verification.p-eu.rapidapi.com/device-phone-number", 
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Authorization": "testTokenTypeBearer testAccessToken123456",
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "number-verification.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                })},
                { response: 
                    JSON.stringify({
                        devicePhoneNumber: "+123456789"
                })});

        expect(await device.getPhoneNumber("testCode1234")).toMatch("+123456789");
    });
    
});

