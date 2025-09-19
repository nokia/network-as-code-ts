import { beforeAll, describe, expect } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { configureClient } from "./configClient";


let client: NetworkAsCodeClient;
let device: Device;

beforeAll(() => {
    client = configureClient();
    device = client.devices.get({
        phoneNumber: "+99999991000",
    });
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
        const result: any = await device.verifyAge(params);
        expect(result).toBeTruthy();
        expect(result.ageCheck).toBe("true")
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
        const result: any = await device.verifyAge(params);
        expect(result).toBeTruthy();
        expect(result.ageCheck).toBe("true")
    });

    it("wrong phone number should return 403 AuthenticationError", async () => {
        try {
            await device.verifyAge(
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