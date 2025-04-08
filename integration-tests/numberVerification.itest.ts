import { beforeAll, describe, expect } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { configureClient } from "./configClient";
import { ProxyAgent } from "proxy-agent";
import fetch from "node-fetch";


let client: NetworkAsCodeClient;
let device: Device;
let httpsAgent: ProxyAgent;
let httpAgent: ProxyAgent;

beforeAll(() => {
    client = configureClient();
    device = client.devices.get({
        phoneNumber: "+3637123456",
    });
    httpsAgent = httpsAgent;
    httpAgent = new ProxyAgent();
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
        const scope = "number-verification:verify";
        const loginHint = "+3637123456";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        expect(callback)
        .toEqual(`${endpoints.authorizationEndpoint}?response_type=code&client_id=${credentials.clientId}&redirect_uri=https%3A%2F%2Fexample.com%2Fredirect&scope=number-verification%3Averify&login_hint=%2B3637123456`);
    });
});

describe("Number Verification NaC auth code and access token", () => {
    it("should get NaC auth code", async () => {
        const redirectUri= "https://example.com/redirect";
        const scope = "number-verification:verify";
        const loginHint = "+3637123456";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        const callbackResponse: any = await fetch(callback, {
            redirect: "manual",
            method: "GET",
            agent: httpsAgent
        });
        const firstRedirect = callbackResponse.headers.get("location");
        const firstResponse: any = await fetch(firstRedirect, {
            redirect: "manual",
            method: "GET",
            agent: httpAgent
        });
        const secondRedirect = firstResponse.headers.get("location");
        const secondResponse: any = await fetch(secondRedirect, {
            redirect: "manual",
            method: "GET",
            agent: httpsAgent
        });
        const location = secondResponse.headers.get("location");
        const codeIndex = location.search("code=");
        const code = location.slice(codeIndex + 5);
        expect(code).toBeTruthy();
    });

    it("should get single use access token", async () => {
        const redirectUri= "https://example.com/redirect";
        const scope = "number-verification:verify";
        const loginHint = "+3637123456";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        const callbackResponse: any = await fetch(callback, {
            redirect: "manual",
            method: "GET",
            agent: httpsAgent
        });
        const firstRedirect = callbackResponse.headers.get("location");
        const firstResponse: any = await fetch(firstRedirect, {
            redirect: "manual",
            method: "GET",
            agent: httpAgent
        });
        const secondRedirect = firstResponse.headers.get("location");
        const secondResponse: any = await fetch(secondRedirect, {
            redirect: "manual",
            method: "GET",
            agent: httpsAgent
        });
        const location = secondResponse.headers.get("location");
        const codeIndex = location.search("code=");
        const code = location.slice(codeIndex + 5);
        const accessToken: any = await device.getSingleUseAccessToken(code);
        expect(accessToken.accessToken).toBeTruthy();
        expect(accessToken.tokenType).toBeTruthy();
        expect(accessToken.expiresIn).toBeTruthy();
    });
});

describe("Number verification", () => {   
    it("should verify number", async () => {
        const redirectUri= "https://example.com/redirect";
        const scope = "number-verification:verify";
        const loginHint = "+3637123456";
        const callback = await client.authentication.createAuthenticationLink(
            redirectUri,
            scope,
            loginHint
        );
        const callbackResponse: any = await fetch(callback, {
            redirect: "manual",
            method: "GET",
            agent: httpsAgent
        });
        const firstRedirect = callbackResponse.headers.get("location");
        const firstResponse: any = await fetch(firstRedirect, {
            redirect: "manual",
            method: "GET",
            agent: httpAgent
        });
        const secondRedirect = firstResponse.headers.get("location");
        const secondResponse: any = await fetch(secondRedirect, {
            redirect: "manual",
            method: "GET",
            agent: httpsAgent
        });
        const location = secondResponse.headers.get("location");
        const codeIndex = location.search("code=");
        const code = location.slice(codeIndex + 5);
        const result: boolean = await device.verifyNumber(code);
        expect(result).toBeTruthy();
    }, 7000);

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