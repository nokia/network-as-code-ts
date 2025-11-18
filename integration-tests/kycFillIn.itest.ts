import { beforeAll, describe, expect } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { configureClient } from "./configClient";


let client: NetworkAsCodeClient;

beforeAll(() => {
    client = configureClient();
});


describe("KYC Fill In", () => {   
    it("should get customer information", async () => { 
        const result: any = await client.kyc.requestCustomerInfo("+99999991000");
        expect(result.idDocument).toEqual("66666666q");
        expect(result.name).toEqual("Federica Sanchez Arjona");
        expect(result.gender).toEqual("Male");
        expect(result.familyName).toEqual("Sanchez Arjona1");
    });


    it("should get null values, other than birthdate", async () => { 
        const result: any = await client.kyc.requestCustomerInfo("+99999991002");
        expect(result.idDocument).toBeNull()
        expect(result.name).toBeNull();
        expect(result.gender).toBeNull();
        expect(result.middleNames).toBeNull();
        expect(result.streetNumber).toBeNull();
        expect(result.birthdate).toEqual("1978-08-22");
    });

    
    it("should get null values, other than gender", async () => { 
        const result: any = await client.kyc.requestCustomerInfo("+99999991003");
        expect(result.idDocument).toBeNull()
        expect(result.name).toBeNull();
        expect(result.birthdate).toBeNull();
        expect(result.middleNames).toBeNull();
        expect(result.streetNumber).toBeNull();
        expect(result.gender).toEqual("Male");
    });


    it("wrong phone number should return 403 Forbidden", async () => {
        try {
            await client.kyc.requestCustomerInfo("+12334566");
        } catch (error){
            expect(error).toBeDefined();
            const err = error as Error;
            expect(err.message).toEqual("403 - Forbidden");
        }
    });

    
    it("phone number not associated with a CSP customer account should return 404 - Not Found", async () => {
        try {
            await client.kyc.requestCustomerInfo("+99999991004");
        } catch (error){
            expect(error).toBeDefined();
            const err = error as Error;
            expect(err.message).toEqual("404 - Not Found");
        }
    });
});
