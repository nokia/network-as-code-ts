import fetchMock from '@fetch-mock/jest';
import { NetworkAsCodeClient } from "../src";
import { Device } from "../src/models/device";
import { InvalidParameterError } from '../src/errors';

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
let device: Device;

beforeAll(() => {
    client = new NetworkAsCodeClient("TEST_TOKEN");
    device = client.devices.get({
        phoneNumber: "+999999991000"
    });
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
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                }),
                expect(JSON.parse(req.body.toString())).toEqual(
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
                )
            },
            { response: 
                JSON.stringify({
                    idDocumentMatch: 'true',
                    nameMatch: 'true',
                    givenNameMatch: 'not_available',
                    familyNameMatch: 'not_available',
                    nameKanaHankakuMatch: 'true',
                    nameKanaZenkakuMatch: 'true',
                    middleNamesMatch: 'true',
                    familyNameAtBirthMatch: 'false',
                    familyNameAtBirthMatchScore: 90,
                    addressMatch: 'true',
                    streetNameMatch: 'true',
                    streetNumberMatch: 'true',
                    postalCodeMatch: 'true',
                    regionMatch: 'true',
                    localityMatch: 'not_available',
                    countryMatch: 'true',
                    houseNumberExtensionMatch: 'not_available',
                    birthdateMatch: 'true',
                    emailMatch: 'false',
                    emailMatchScore: 87,
                    genderMatch: 'true'
            })});

        await device.matchCustomer(
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
    });

    it("KYC Match with not all attributes requested", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-match/kyc-match/v0.3/match",
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                }),
                expect(JSON.parse(req.body.toString())).toEqual(
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
                )
            },
            { response: 
                JSON.stringify({
                    idDocumentMatch: 'true',
                    nameMatch: 'true',
                    givenNameMatch: 'not_available',
                    familyNameMatch: 'not_available',
                    nameKanaHankakuMatch: 'true',
                    nameKanaZenkakuMatch: 'true',
                    middleNamesMatch: 'true',
                    familyNameAtBirthMatch: 'false',
                    familyNameAtBirthMatchScore: 90,
                    addressMatch: 'true',
                    streetNameMatch: 'true',
                    email: "true"
            })});

        await device.matchCustomer(
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
    });

    it("should add the device phone number to the body in the backend", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-match/kyc-match/v0.3/match",
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                }),
                expect(JSON.parse(req.body.toString())).toEqual(
                    {
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
                        gender: "TestGender",
                        phoneNumber: "+999999991000"
                    }
                )
            },
            { response: 
                JSON.stringify({
                    idDocumentMatch: 'true',
                    nameMatch: 'true',
                    givenNameMatch: 'not_available',
                    familyNameMatch: 'not_available',
                    nameKanaHankakuMatch: 'true',
                    nameKanaZenkakuMatch: 'true',
                    middleNamesMatch: 'true',
                    familyNameAtBirthMatch: 'false',
                    familyNameAtBirthMatchScore: 90,
                    addressMatch: 'true',
                    streetNameMatch: 'true',
                    streetNumberMatch: 'true',
                    postalCodeMatch: 'true',
                    regionMatch: 'true',
                    localityMatch: 'not_available',
                    countryMatch: 'true',
                    houseNumberExtensionMatch: 'not_available',
                    birthdateMatch: 'true',
                    emailMatch: 'false',
                    emailMatchScore: 87,
                    genderMatch: 'true'
            })});

        await device.matchCustomer(
            {
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
    });
});