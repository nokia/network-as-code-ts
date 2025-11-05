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


describe("KYC Age Verification", () => {
    it("KYC age verification", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-age-verification/kyc-age-verification/v0.1/verify",
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                }),
                expect(JSON.parse(req.body.toString())).toEqual(
                    {
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
                )
            },
            { response: 
                JSON.stringify({
                    ageCheck:"true",
                    verifiedStatus:true,
                    identityMatchScore:60,
                    contentLock:false,
                    parentalControl:false
            })});

        await client.kyc.verifyAge(
            {
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
        );
    });

    it("KYC age verification with not all attributes provided", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-age-verification/kyc-age-verification/v0.1/verify",
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                }),
                expect(JSON.parse(req.body.toString())).toEqual(
                    {
                        ageThreshold: 18,
                        phoneNumber: "+99999991000",
                        idDocument: "66666666q",
                        name: "Federica Sanchez Arjona",
                        familyNameAtBirth: "YYYY",
                        birthdate: "1978-08-22",
                        email: "federicaSanchez.Arjona@example.com",
                        includeContentLock: true,
                        includeParentalControl: true
                    }
                )
            },
            { response: 
                JSON.stringify({
                    ageCheck:"true",
                    verifiedStatus:true,
                    identityMatchScore:60,
                    contentLock:false,
                    parentalControl:false
            })});

        await client.kyc.verifyAge(
            {
                ageThreshold: 18,
                phoneNumber: "+99999991000",
                idDocument: "66666666q",
                name: "Federica Sanchez Arjona",
                familyNameAtBirth: "YYYY",
                birthdate: "1978-08-22",
                email: "federicaSanchez.Arjona@example.com",
                includeContentLock: true,
                includeParentalControl: true
            }
        );
    });

});
