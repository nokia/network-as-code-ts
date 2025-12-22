
import { beforeAll, describe, expect } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { configureClient } from "./configClient";


let client: NetworkAsCodeClient;

beforeAll(() => {
    client = configureClient();
});

describe("KYC Check Tenure", () => {   
    it.skip("check tenure should return true", async () => {
        const result = await client.kyc.checkTenure(
            {
                phoneNumber: "+99999991000",
                tenureDate: "2023-07-17"
            }
        );
        expect(result).toBeTruthy();
        expect(result.tenureDateCheck).toBe(true)
    });

   it.skip("check tenure should return false", async () => {
        const result = await client.kyc.checkTenure(
            {
                phoneNumber: "+99999991005",
                tenureDate: "2023-07-17"
            }
        );
        expect(result).toBeTruthy();
        expect(result.tenureDateCheck).toBe(false)
    });

   it.skip("should handle date object", async () => {
        const result = await client.kyc.checkTenure(
            {
                phoneNumber: "+99999991000",
                tenureDate: new Date(2023, 7, 17)
            }
        );
        expect(result).toBeTruthy();
        expect(result.tenureDateCheck).toBe(true)
    });

   it.skip("should return string value for contract type", async () => {
        const result = await client.kyc.checkTenure(
            {
                phoneNumber: "+99999991005",
                tenureDate: "2023-07-17"
            }
        );
        expect(result).toBeTruthy();
        if (result.contractType) {
            ["PAYG", "PAYM", "Business"].includes(result.contractType)
        }
    });

    it.skip("wrong phone number should return 403 AuthenticationError", async () => {
        try {
            await client.kyc.checkTenure(
            {
                phoneNumber: "+1234567",
                tenureDate: "2023-07-17"
            }
            );
        } catch (error){
            expect(error).toBeDefined();
            const err = error as Error;
            expect(err.message).toEqual("403 - Forbidden");
        }
    });
});
