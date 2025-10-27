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

describe("Number Verification authorization", () => {
    it("should retrieve credentials", async () => {
        const credentials: any = await client.authorization.credentials();
        expect(credentials.clientId).toBeTruthy();
        expect(credentials.clientSecret).toBeTruthy();
    });

    it("should retrieve endpoints", async () => {
        const endpoints: any = await client.authorization.endpoints();
        expect(endpoints.fastFlowCspAuthEndpoint).toBeTruthy();
    });

    it("should create authorization link", async () => {
        const credentials: any = await client.authorization.credentials();
        const endpoints: any = await client.authorization.endpoints();
        const redirectUri= "https://example.com/redirect";
        const scope = "dpv:FraudPreventionAndDetection number-verification:verify";
        const loginHint = "+99999991000";
        const state = "testState";
        const callback = await client.authorization.createAuthorizationLink(
            redirectUri,
            scope,
            loginHint,
            state
        );
        expect(callback)
        .toEqual(`${endpoints.fastFlowCspAuthEndpoint}?response_type=code&client_id=${credentials.clientId}&redirect_uri=https%3A%2F%2Fexample.com%2Fredirect&scope=dpv%3AFraudPreventionAndDetection%20number-verification%3Averify&login_hint=%2B99999991000&state=testState`);
    });
});

describe("Number Verification NaC auth code", () => {
    it("should get NaC auth code and state", async () => {
        const redirectUri= `${notificationUrl}/nv`;
        const scope = "dpv:FraudPreventionAndDetection number-verification:verify";
        const loginHint = "+99999991000";
        const state = "testState";
        const callback = await client.authorization.createAuthorizationLink(
            redirectUri,
            scope,
            loginHint,
            state
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
        expect(data.code).toBeTruthy();
        expect(data.state).toBeTruthy();
    });
});

describe("Number verification", () => {
    it("should verify number - True", async () => {
        const redirectUri= `${notificationUrl}/nv`;
        const scope = "dpv:FraudPreventionAndDetection number-verification:verify";
        const loginHint = "+99999991000";
        const state = "testState";
        const callback = await client.authorization.createAuthorizationLink(
            redirectUri,
            scope,
            loginHint,
            state
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
        const result: boolean = await device.verifyNumber(data.code, data.state);
        expect(result).toBeTruthy();
    });

    it("should verify number - False", async () => {
        device = client.devices.get({
            phoneNumber: "+99999991001"
        });
        const redirectUri= `${notificationUrl}/nv`;
        const scope = "dpv:FraudPreventionAndDetection number-verification:verify";
        const loginHint = "+99999991001";
        const state = "testState";
        const callback = await client.authorization.createAuthorizationLink(
            redirectUri,
            scope,
            loginHint,
            state
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
        const result: boolean = await device.verifyNumber(data.code, data.state);
        expect(result).toBeFalsy();
    });

});
describe("Get Phone Number", () => {
    it("should get device phone number", async () => {
        const redirectUri= `${notificationUrl}/nv`;
        const scope = "dpv:FraudPreventionAndDetection number-verification:device-phone-number:read";
        const loginHint = "+99999991000";
        const state = "testState"
        const callback = await client.authorization.createAuthorizationLink(
            redirectUri,
            scope,
            loginHint,
            state
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
        const result: string = await device.getPhoneNumber(data.code, data.state);
        expect(result).toBeDefined();
    });
});