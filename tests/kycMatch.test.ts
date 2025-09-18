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
    fetchMock.mockGlobal().get(
        "https://network-as-code.p-eu.rapidapi.com/oauth2/v1/auth/clientcredentials",
        (req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                "X-RapidAPI-Key": 'TEST_TOKEN',
            })
        },
        { response: Promise.resolve({
            body: JSON.stringify({
                client_id: "123456",
                client_secret: "secret123"
            })
        })}  
    );

    fetchMock.mockGlobal().get(
        "https://network-as-code.p-eu.rapidapi.com/.well-known/openid-configuration",
        (req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                "X-RapidAPI-Key": 'TEST_TOKEN',
            })
        },
        { response: Promise.resolve({
            body: JSON.stringify({
                authorization_endpoint: "https://authorizationTestEndpoint/oauth2/v1/authorize",
                token_endpoint: "https://tokenTestEndpoint/oauth2/v1/token"
            })
        })}
    );

    fetchMock.mockGlobal().post(  
        "https://tokenTestEndpoint/oauth2/v1/token", 
        (req: any): any => {
            expect(req.headers).toEqual({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            expect(req.body).toEqual({
                "client_id":"123456&client_secret=secret123&grant_type=authorization_code&code=testCode1234"
        })},
        { response: Promise.resolve({
            body: JSON.stringify({
                access_token: "testAccessToken123456",
                token_type: "testTokenTypeBearer",
                expires_in: "testExpiresIn"
            })
        })}
    );
});

afterEach(() => {
    fetchMock.unmockGlobal();
});


describe("Know Your Customer", () => {
    it("know your customer without access token", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/passthrough/kyc-match/v0.3/match",
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

    it("know your customer with not all attributes requested", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/passthrough/kyc-match/v0.3/match",
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

    it("should get access token with provided code and use token in matchCustomer call", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/passthrough/kyc-match/v0.3/match",
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Authorization": "testTokenTypeBearer testAccessToken123456",
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
                    nameKanaZenkakuMatch: 'false',
                    nameKanaZenkakuMatchScore: 70,
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
                    birthdateMatch: 'false',
                    emailMatch: 'false',
                    emailMatchScore: 87,
                    genderMatch: 'false',
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
            },
            "testCode1234"
        );
    });

    it("missing both phone number and authorization code throws error", async () => {
        try {
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
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidParameterError);
        }
    });
});