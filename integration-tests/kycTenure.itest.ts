
import { beforeAll, describe, expect } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { configureClient } from "./configClient";


let client: NetworkAsCodeClient;

beforeAll(() => {
    client = configureClient();
});

describe("KYC Check Tenure", () => {   
    it("check tenure should return true", async () => {
        const result: any = await client.kyc.checkTenure(
            "+99999991000",
            "2023-07-17"
        );
        expect(result).toBeTruthy();
        expect(result.tenureDateCheck).toBe(true)
    });

   it("check tenure should return false", async () => {
        const result: any = await client.kyc.checkTenure(
            "+99999991005",
            "2023-07-17"
        );
        expect(result).toBeTruthy();
        expect(result.tenureDateCheck).toBe(false)
    });

   it("should return string value for contract type", async () => {
        const result: any = await client.kyc.checkTenure(
            "+99999991005",
            "2023-07-17"
        );
        expect(result).toBeTruthy();
        if (result.contractType) {
            ["PAYG", "PAYM", "Business"].includes(result.contractType)
        }
    });

    it("wrong phone number should return 403 AuthenticationError", async () => {
        try {
            await client.kyc.checkTenure(
                "+1234567",
                "1978-08-22"
            );
        } catch (error){
            expect(error).toBeDefined();
            const err = error as Error;
            expect(err.message).toEqual("403 - Forbidden");
        }
    });
});
