import fetchMock from '@fetch-mock/jest';
import { NetworkAsCodeClient } from "../src";

jest.mock("node-fetch", () => {
	const nodeFetch = jest.requireActual("node-fetch");
	// only needed if your application makes use of Response, Request
	// or Headers classes directly
	Object.assign(fetchMock.config, {
		fetch: nodeFetch,
		Response: nodeFetch.Response,
		Request: nodeFetch.Request,
		Headers: nodeFetch.Headers,
	});
	return fetchMock.fetchHandler;
});

let client: NetworkAsCodeClient;

beforeAll(() => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
});


beforeEach(() => {
    fetchMock.mockReset();
});

afterEach(() => {
    fetchMock.unmockGlobal();
});


describe("KYC Match", () => {
    it("KYC Match should match customer", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-match/kyc-match/v0.3/match",
            {
                body: {
                    idDocumentMatch: true,
                    nameMatch: true,
                    givenNameMatch: null,
                    familyNameMatch: null,
                    nameKanaHankakuMatch: true,
                    nameKanaZenkakuMatch: true,
                    middleNamesMatch: true,
                    familyNameAtBirthMatch: false,
                    familyNameAtBirthMatchScore: 90,
                    addressMatch: true,
                    streetNameMatch: true,
                    streetNumberMatch: true,
                    postalCodeMatch: true,
                    regionMatch: true,
                    localityMatch: null,
                    countryMatch: true,
                    houseNumberExtensionMatch: null,
                    birthdateMatch: true,
                    emailMatch: false,
                    emailMatchScore: 87,
                    genderMatch: true
                }
            },{
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                },
                body: {
                        phoneNumber: "+999999991000",
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
            }
        );

        await client.kyc.matchCustomer(
            {
                phoneNumber: "+999999991000",
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

        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-match/kyc-match/v0.3/match",
            {
                method: "POST",
                body: {
                    phoneNumber: "+999999991000",
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
            }
        );
    });

    it("KYC Match with not all attributes requested", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-match/kyc-match/v0.3/match",
            { 
                body: {
                    idDocumentMatch: true,
                    nameMatch: true,
                    givenNameMatch: null,
                    familyNameMatch: null,
                    nameKanaHankakuMatch: true,
                    nameKanaZenkakuMatch: true,
                    middleNamesMatch: true,
                    familynameatbirthmatch: false,
                    familyNameAtBirthMatchScore: 90,
                    addressMatch: true,
                    streetNameMatch: true,
                    emailMatch: true
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                },
                body: {
                        phoneNumber: "+999999991000",
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
                        email: "TestEmail"
                    }
            });

        await client.kyc.matchCustomer(
            {
                phoneNumber: "+999999991000",
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
                email: "TestEmail"
            }
        );
        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-match/kyc-match/v0.3/match",
            {
                method: "POST",
                body: {
                    phoneNumber: "+999999991000",
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
                    email: "TestEmail"
                }
            }
        );
    });

    it.failing("Should fail for request body", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-match/kyc-match/v0.3/match",
            {
                body: {
                    idDocumentMatch: true,
                    nameMatch: true,
                    givenNameMatch: null,
                    familyNameMatch: null,
                    nameKanaHankakuMatch: true,
                    nameKanaZenkakuMatch: true,
                    middleNamesMatch: true,
                    familyNameAtBirthMatch: false,
                    familyNameAtBirthMatchScore: 90,
                    addressMatch: true,
                    streetNameMatch: true,
                    streetNumberMatch: true,
                    postalCodeMatch: true,
                    regionMatch: true,
                    localityMatch: null,
                    countryMatch: true,
                    houseNumberExtensionMatch: null,
                    birthdateMatch: true,
                    emailMatch: false,
                    emailMatchScore: 87,
                    genderMatch: true
                }
            },{
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                },
                body: {
                        phoneNumber: "+999999991000",
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
            }
        );

        await client.kyc.matchCustomer(
            {
                phoneNumber: "+999999991000",
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

        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-match/kyc-match/v0.3/match",
            {
                method: "POST",
                body: {
                    phoneNumber: "+1234567",
                    idDocument: "wrong",
                    name: "wrong",
                    givenName: "wrong",
                    familyName: "wrong",
                    nameKanaHankaku: "wrong",
                    nameKanaZenkaku: "wrong",
                    middleNames: "wrong",
                    familyNameAtBirth: "wrong",
                    address: "wrong",
                    streetName: "wrong",
                    streetNumber: "wrong",
                    postalCode: "wrong",
                    region: "wrong",
                    locality: "wrong",
                    country: "wrong",
                    houseNumberExtension: "wrong",
                    birthdate: "wrong",
                    email: "wrong",
                    gender: "wrong"
                }
            }
        );
    });
});