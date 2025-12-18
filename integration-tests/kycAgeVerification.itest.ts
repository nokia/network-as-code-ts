import { beforeAll, describe, expect } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { configureClient } from "./configClient";
import { KYCVerifyAgeResult } from "../src/models/kycAgeVerification";


let client: NetworkAsCodeClient;

beforeAll(() => {
    client = configureClient();
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
        const result: KYCVerifyAgeResult = await client.kyc.verifyAge(params);
        expect(result).toBeTruthy();
        expect(result.ageCheck).toBe(true)
    });

   it("should verify without optional parameters ", async () => {
       const params = {
            ageThreshold: 18,
            phoneNumber: "+99999991000",
           }
        const result: KYCVerifyAgeResult = await client.kyc.verifyAge(params);
        expect(result).toBeTruthy();
        expect(result.ageCheck).toBe(true)
    });

    it("wrong phone number should return 403 AuthenticationError", async () => {
        try {
            await client.kyc.verifyAge(
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
