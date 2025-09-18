import { beforeAll, describe, expect } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { configureClient, configureNotificationServerUrl } from "./configClient";
import { ProxyAgent } from "proxy-agent";
import fetch from "node-fetch";


let client: NetworkAsCodeClient;
let device: Device;
let agent: ProxyAgent;
let notificationUrl: string;

beforeAll(() => {
    client = configureClient();
    device = client.devices.get({
        phoneNumber: "+99999991000",
    });
    agent = new ProxyAgent()
    notificationUrl = configureNotificationServerUrl();
});

describe("KYC Age Verification authentication", () => {
    it("should retrieve credentials", async () => {
        const credentials: any = await client.authentication.credentials();
        expect(credentials.clientId).toBeTruthy();
        expect(credentials.clientSecret).toBeTruthy();
    });

    it("should retrieve endpoints", async () => {
        const endpoints: any = await client.authentication.endpoints();
        expect(endpoints.authorizationEndpoint).toBeTruthy();
        expect(endpoints.tokenEndpoint).toBeTruthy();
    });

    it("should create authentication link", async () => {
        const credentials: any = await client.authentication.credentials();
        const endpoints: any = await client.authentication.endpoints();
        const redirectUri= "https://example.com/redirect";
        const scope = "dpv:FraudPreventionAndDetection kyc-age-verification:verify";
        const loginHint = "+99999991000";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        expect(callback)
        .toEqual(`${endpoints.authorizationEndpoint}?response_type=code&client_id=${credentials.clientId}&redirect_uri=https%3A%2F%2Fexample.com%2Fredirect&scope=dpv%3AFraudPreventionAndDetection%20kyc-age-verification%3Averify&login_hint=%2B99999991000`);
    });
});

describe("KYC Age Verification with access token", () => { 
    it("should get auth code", async () => {
        const redirectUri= `${notificationUrl}/kyc`;
        const scope = "dpv:FraudPreventionAndDetection kyc-age-verification:verify";
        const loginHint = "+99999991000";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        await fetch(callback, {
            method: "GET",
            agent: agent
        });
        const response =  await fetch(`${notificationUrl}/kyc-get-code`,
            {
                method: "GET",
                agent: agent
            });
        const data = await response.json() as any;
        const code = data.code
        expect(code).toBeTruthy();
    });

    it("should get single use access token", async () => {
        const redirectUri= `${notificationUrl}/kyc`;
        const scope = "dpv:FraudPreventionAndDetection kyc-age-verification:verify";
        const loginHint = "+99999991000";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        await fetch(callback, {
            method: "GET",
            agent: agent
        });

        const response =  await fetch(`${notificationUrl}/kyc-get-code`,
            {
                method: "GET",
                agent: agent
            });
        const data = await response.json() as any;
        const code = data.code
        const accessToken: any = await device.getSingleUseAccessToken(code);
        expect(accessToken.accessToken).toBeTruthy();
        expect(accessToken.tokenType).toBeTruthy();
        expect(accessToken.expiresIn).toBeTruthy();
    });
});

describe("KYC Age Verification", () => {   
    it("should verify age with phone number but no authorization code", async () => {
        const params = {
            ageThreshold: 18,
            phoneNumber: "+99999991000",
            idDocument: "66666666q",
            name: "Federica Sanchez Arjona",
            givenName: "Federica",
            familyName: "Sanchez Arjona",
            middleNames: "Sanchez",
            familyNameAtBirth: "YYYY",
            birthdate: "1978-08-22",
            email: "federicaSanchez.Arjona@example.com",
            includeContentLock: true,
            includeParentalControl: true
        }
        const result: any = await device.verifyCustomerAge(params);
        expect(result).toBeTruthy();
        expect(result.ageCheck === "true")
        // MORE TESTS HERE
    });

    it("should verify age with authorization code but no phone number", async () => {
        const redirectUri= `${notificationUrl}/kyc`;
        const scope = "dpv:FraudPreventionAndDetection kyc-age-verification:verify";
        const loginHint = "+99999991000";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        await fetch(callback, {
            method: "GET",
            agent: agent
        });

        const response =  await fetch(`${notificationUrl}/kyc-get-code`,
            {
                method: "GET",
                agent: agent
            });
        const data = await response.json() as any;
        const code = data.code
        const params = {
            ageThreshold: 18,
            idDocument: "66666666q",
            name: "Federica Sanchez Arjona",
            givenName: "Federica",
            familyName: "Sanchez Arjona",
            middleNames: "Sanchez",
            familyNameAtBirth: "YYYY",
            birthdate: "1978-08-22",
            email: "federicaSanchez.Arjona@example.com",
            includeContentLock: true,
            includeParentalControl: true
        }
        const result: any = await device.verifyCustomerAge(params, code);
        expect(result).toBeTruthy();
    });

    it("wrong authorization code should return 400 APIError", async () => {
        try {
            await device.verifyCustomerAge(
                {
                    ageThreshold: 18,
                    idDocument: "66666666q",
                    name: "Federica Sanchez Arjona",
                    givenName: "Federica",
                    familyName: "Sanchez Arjona",
                    middleNames: "Sanchez",
                    familyNameAtBirth: "YYYY",
                    birthdate: "1978-08-22",
                    email: "federicaSanchez.Arjona@example.com",
                    includeContentLock: true,
                    includeParentalControl: true
                },
                "123456"
            );
        } catch (error){
            expect(error).toBeDefined();
            const err = error as Error;
            expect(err.message).toEqual("400 - Bad Request");
        }
    });

    it("wrong phone number should return 403 AuthenticationError", async () => {
        try {
            await device.verifyCustomerAge(
                {   
                    ageThreshold: 18,
                    phoneNumber: "+1234567",
                    idDocument: "66666666q",
                    name: "Federica Sanchez Arjona",
                    givenName: "Federica",
                    familyName: "Sanchez Arjona",
                    middleNames: "Sanchez",
                    familyNameAtBirth: "YYYY",
                    birthdate: "1978-08-22",
                    email: "federicaSanchez.Arjona@example.com",
                    includeContentLock: true,
                    includeParentalControl: true
                }
            );
        } catch (error){
            expect(error).toBeDefined();
            const err = error as Error;
            expect(err.message).toEqual("403 - Forbidden");
        }
    });
});