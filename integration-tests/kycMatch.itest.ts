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


describe("KYC Match", () => {   
    it("should match customer", async () => {
        const params = {
            phoneNumber: "+999999991000",
            idDocument: "66666666q",
            name: "Federica Sanchez Arjona",
            givenName: "Federica",
            familyName: "Sanchez Arjona",
            nameKanaHankaku: "federica",
            nameKanaZenkaku: "Ｆｅｄｅｒｉｃａ",
            middleNames: "Sanchez",
            familyNameAtBirth: "YYYY",
            address: "Tokyo-to Chiyoda-ku Iidabashi 3-10-10",
            streetName: "Nicolas Salmeron",
            streetNumber: "4",
            postalCode: "1028460",
            region: "Tokyo",
            locality: "ZZZZ",
            country: "JP",
            houseNumberExtension: "VVVV",
            birthdate: "1978-08-22",
            email: "abc@example.com",
            gender: "OTHER"
        }
        const result: any = await device.matchCustomer(params);
        expect(result).toBeTruthy();
        expect(result.familyNameMatch).toBe("false");
        expect(result.addressMatch).toBe("false");
        expect(result.familyNameAtBirthMatch).toBe("false");
        expect(result.streetNumberMatch).toBe("false");
    });

    it("should match customer with not all params requested", async () => {
        const params = {
            phoneNumber: "+999999991000",
            idDocument: "66666666q",
            name: "Federica Sanchez Arjona",
            givenName: "Federica",
            nameKanaHankaku: "federica",
            nameKanaZenkaku: "Ｆｅｄｅｒｉｃａ",
            middleNames: "Sanchez",
            familyNameAtBirth: "YYYY",
            streetName: "Nicolas Salmeron",
            streetNumber: "4",
            postalCode: "1028460",
            region: "Tokyo"
        }
        const result: any = await device.matchCustomer(params);
        expect(result).toBeTruthy();
        expect(result.familyNameMatch).toBe(null);
        expect(result.addressMatch).toBe(null);
        expect(result.streetNumberMatch).toBe("false");
    });

   it("if missing phone number from request body, should add in the backend it and work ", async () => {
        const params = {
            idDocument: "66666666q",
            name: "Federica Sanchez Arjona",
            givenName: "Federica",
            familyName: "Sanchez Arjona",
            nameKanaHankaku: "federica",
            nameKanaZenkaku: "Ｆｅｄｅｒｉｃａ",
            middleNames: "Sanchez",
            familyNameAtBirth: "YYYY",
            address: "Tokyo-to Chiyoda-ku Iidabashi 3-10-10",
            streetName: "Nicolas Salmeron",
            streetNumber: "4",
            postalCode: "1028460",
            region: "Tokyo",
            locality: "ZZZZ",
            country: "JP",
            houseNumberExtension: "VVVV",
            birthdate: "1978-08-22",
            email: "abc@example.com",
            gender: "OTHER"
        }
        const result: any = await device.matchCustomer(params);
        expect(result).toBeTruthy();
        expect(result.familyNameMatch).toBe("false");
        expect(result.addressMatch).toBe("false");
        expect(result.familyNameAtBirthMatch).toBe("false");
        expect(result.streetNumberMatch).toBe("false");;
    });

    it("wrong phone number should return 403 AuthenticationError", async () => {
        try {
            await device.matchCustomer(
                {   phoneNumber: "+12345678",
                    idDocument: "123456",
                    name: "testName",
                    givenName: "testGivenName",
                    familyName: "TestFamilyName",
                    nameKanaHankaku: "TestNameKanaHankaku",
                    nameKanaZenkaku: "TestNameKanaZenkaku",
                    middleNames: "TestMiddleNames",
                    familyNameAtBirth: "TestFamilyNameAtBirth",
                    address: "TestAddress",
                    streetName: "TestStreetName",
                    streetNumber: "TestStreetNumber",
                    postalCode: "TestPostalCode",
                    region: "TestRegion",
                    locality: "TestLocality",
                    country: "TestCountry",
                    houseNumberExtension: "TestHouseNumberExtension",
                    birthdate: "TestBirthdate",
                    email: "TestEmail",
                    gender: "TestGender"
                }
            );
        } catch (error){
            expect(error).toBeDefined();
            const err = error as Error;
            expect(err.message).toEqual("403 - Forbidden");
        }
    });
});