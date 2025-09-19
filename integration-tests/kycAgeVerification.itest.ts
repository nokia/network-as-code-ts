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

describe("KYC Age Verification", () => {   
    it("should verify age", async () => {
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
        expect(result.ageCheck).toBeTruthy()
    });

   it("if missing phone number from request body, ahould add in the backend it and work ", async () => {
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
        const result: any = await device.verifyCustomerAge(params);
        expect(result).toBeTruthy();
        expect(result.ageCheck).toBeTruthy()
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