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
        phoneNumber: "+3637123456",
    });
    agent = new ProxyAgent()
    notificationUrl = configureNotificationServerUrl();
});

describe("Number Verification authentication", () => {
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
        const scope = "dpv:FraudPreventionAndDetection number-verification:verify";
        const loginHint = "+3637123456";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        expect(callback)
        .toEqual(`${endpoints.authorizationEndpoint}?response_type=code&client_id=${credentials.clientId}&redirect_uri=https%3A%2F%2Fexample.com%2Fredirect&scope=dpv%3AFraudPreventionAndDetection%20number-verification%3Averify&login_hint=%2B3637123456`);
    });
});

describe("Number Verification NaC auth code and access token", () => {
    it("should get NaC auth code", async () => {
        const redirectUri= `${notificationUrl}/nv`;
        const scope = "dpv:FraudPreventionAndDetection number-verification:verify";
        const loginHint = "+3637123456";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        await fetch(callback, {
            method: "GET",
            agent: agent
        });

        const response =  await fetch(`${notificationUrl}/nv-get-code`,
                    {
                        method: "GET",
                        agent: agent
                    });
        const data = await response.json() as any;
        const code = data.code
        expect(code).toBeTruthy();
    });

    it("should get single use access token", async () => {
        const redirectUri= `${notificationUrl}/nv`;
        const scope = "dpv:FraudPreventionAndDetection number-verification:verify";
        const loginHint = "+3637123456";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        await fetch(callback, {
            method: "GET",
            agent: agent
        });

        const response =  await fetch(`${notificationUrl}/nv-get-code`,
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

describe("Number verification", () => {   
    it("should verify number", async () => {
        const redirectUri= `${notificationUrl}/nv`;
        const scope = "dpv:FraudPreventionAndDetection number-verification:verify";
        const loginHint = "+3637123456";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        await fetch(callback, {
            method: "GET",
            agent: agent
        });

        const response =  await fetch(`${notificationUrl}/nv-get-code`,
                    {
                        method: "GET",
                        agent: agent
                    });
        const data = await response.json() as any;
        const code = data.code
        const result: boolean = await device.verifyNumber(code);
        expect(result).toBeTruthy();
    });

    it("should return 400 APIError", async () => {
        try {
            await device.getSingleUseAccessToken("1234567");            
            expect(true).toBe(false);
        } catch (error){
            expect(error).toBeDefined();
            const err = error as Error;
            expect(err.message).toEqual("400 - Bad Request");
        }
    });
});
describe("Get Phone Number", () => {
    it("should get device phone number", async () => {
        const redirectUri= `${notificationUrl}/nv`;
        const scope = "dpv:FraudPreventionAndDetection number-verification:device-phone-number:read";
        const loginHint = "+3637123456";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        await fetch(callback, {
            method: "GET",
            agent: agent
        });

        const response =  await fetch(`${notificationUrl}/nv-get-code`,
                    {
                        method: "GET",
                        agent: agent
                    });
        const data = await response.json() as any;
        const code = data.code
        const result: string = await device.getPhoneNumber(code);
        expect(result).toBeDefined();
    });
});