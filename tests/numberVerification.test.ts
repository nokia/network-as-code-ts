import type { FetchMockStatic } from "fetch-mock";
import fetch from "node-fetch";

import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { InvalidParameterError } from "../src/errors";


jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = fetch as unknown as FetchMockStatic;

let client: NetworkAsCodeClient;
let device: Device;

beforeAll(() => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get({
        phoneNumber: "+3637123456"
    });
});

beforeEach(() => {
    fetchMock.reset();
    fetchMock.get(
        "https://nac-authorization-server.p-eu.rapidapi.com/auth/clientcredentials",
        (_: any, req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "nac-authorization-server.nokia.rapidapi.com",
                "X-RapidAPI-Key": 'TEST_TOKEN',
            });
            return Promise.resolve({
                body: JSON.stringify({
                    client_id: "123456",
                    client_secret: "secret123"
                })
            });
        }
    );

    fetchMock.get(
        "https://well-known-metadata.p-eu.rapidapi.com/openid-configuration",
        (_: any, req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "well-known-metadata.nokia.rapidapi.com",
                "X-RapidAPI-Key": 'TEST_TOKEN',
            });
            return Promise.resolve({
                body: JSON.stringify({
                    authorization_endpoint: "https://authorizationTestEndpoint/oauth2/v1/authorize",
                    token_endpoint: "https://tokenTestEndpoint/oauth2/v1/token"
                })
            });
        }
    );

    fetchMock.post(
        "https://tokenTestEndpoint/oauth2/v1/token",
        (_: any, req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/x-www-form-urlencoded",
            });
            expect(req.body).toEqual(
                "client_id=123456&client_secret=secret123&grant_type=authorization_code&code=testCode1234"
            );
            return Promise.resolve({
                body: JSON.stringify({
                    access_token: "testAccessToken123456",
                    token_type: "testTokenTypeBearer",
                    expires_in: "testExpiresIn"
                })
            });
        }
    );
});

describe("Number Verification access token and verifying number tests", () => {

    it("should get an access token", async () => {
        expect(await device.getSingleUseAccessToken("testCode1234")).toEqual({ accessToken: "testAccessToken123456", tokenType: "testTokenTypeBearer", expiresIn: "testExpiresIn"});
    });

    it("should get verify number result as true", async () => {
        fetchMock.post(
            "https://number-verification.p-eu.rapidapi.com/verify",
            (_: any, req: any): any => {
                expect(req.headers).toEqual({
                    "Authorization": "testTokenTypeBearer testAccessToken123456",
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "number-verification.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                });
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+3637123456"
                });
                return Promise.resolve({
                    body: JSON.stringify({
                        devicePhoneNumberVerified: true
                    })
                });
            }
        );

        expect(await device.verifyNumber("testCode1234")).toBeTruthy();
    });


    it("should get verify number result as false", async () => {
        fetchMock.post(
            "https://number-verification.p-eu.rapidapi.com/verify",
            (_: any, req: any): any => {
                expect(req.headers).toEqual({
                    "Authorization": "testTokenTypeBearer testAccessToken123456",
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "number-verification.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN',
                });
                expect(JSON.parse(req.body.toString())).toEqual({
                    phoneNumber: "+3637123456"
                });
                return Promise.resolve({
                    body: JSON.stringify({
                        devicePhoneNumberVerified: false
                    })
                });
            }
        );

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
});

