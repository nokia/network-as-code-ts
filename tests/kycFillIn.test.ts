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


describe("KYC Fill-In", () => {
    it("KYC Fill-In results return values and null", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-fill-in/kyc-fill-in/v0.4/fill-in ",
            {
                body: {
                    phoneNumber:"+99999991001",
                    idDocument:"12345678l",
                    name:"Arjona",
                    givenName:"Aerica",
                    familyName:"Sanchez1",
                    nameKanaHankaku:"sanchez",
                    nameKanaZenkaku:"S a n c h e z",
                    middleNames:"Sanchez1",
                    familyNameAtBirth:"YYYY",
                    address:"Tokyo-to Chiyoda-ku Iidabashi 3-10-1",
                    streetName:"Nicolas Salmeron",
                    streetNumber:"4",
                    postalCode:"1028460",
                    region:"Tokyo",
                    locality:"ZZZZ",
                    country:"JP",
                    houseNumberExtension:"36",
                    birthdate:null,
                    email:null,
                    gender:null,
                    cityOfBirth:null,
                    countryOfBirth:null,
                    nationality:null,
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                },
                body: {
                        phoneNumber: "+99999991001",
                    }
            });

        const result = await client.kyc.requestCustomerInfo(
            "+99999991001"
        );

        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-fill-in/kyc-fill-in/v0.4/fill-in ",
            {
                method: "POST",
                body: {
                        phoneNumber: "+99999991001",
                    }
            }
        );
        
        expect(result.phoneNumber).toEqual("+99999991001");
        expect(result.idDocument).toEqual("12345678l");
        expect(result.name).toEqual("Arjona");
        expect(result.givenName).toEqual("Aerica");
        expect(result.middleNames).toEqual("Sanchez1");
        expect(result.email).toBeNull();
        expect(result.nationality).toBeNull();

    });

    it("KYC Fill-In results return nulls and values", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-fill-in/kyc-fill-in/v0.4/fill-in ",
            {
                body: {
                    phoneNumber:null,
                    idDocument:null,
                    name:null,
                    givenName:null,
                    familyName:null,
                    nameKanaHankaku:null,
                    nameKanaZenkaku:null,
                    middleNames:null,
                    familyNameAtBirth:null,
                    address:null,
                    streetName:null,
                    streetNumber:null,
                    postalCode:null,
                    region:null,
                    locality:null,
                    country:null,
                    houseNumberExtension:null,
                    birthdate:null,
                    email:null,
                    gender:"Male",
                    cityOfBirth:null,
                    countryOfBirth:null,
                    nationality:null
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                },
                body: {
                        phoneNumber: "+99999991003",
                    }
            });

        const result = await client.kyc.requestCustomerInfo(
            "+99999991003",
        );

        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-fill-in/kyc-fill-in/v0.4/fill-in ",
            {
                method: "POST",
                body: {
                        phoneNumber: "+99999991003",
                    }
            }
        );

        expect(result.phoneNumber).toBeNull();
        expect(result.idDocument).toBeNull();
        expect(result.name).toBeNull();
        expect(result.givenName).toBeNull();
        expect(result.middleNames).toBeNull();
        expect(result.email).toBeNull();
        expect(result.nationality).toBeNull();
        expect(result.gender).toEqual("Male");
    });

    it.failing("Should fail for request body", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-fill-in/kyc-fill-in/v0.4/fill-in ",
            {
                body: {
                    phoneNumber:"+99999991001",
                    idDocument:"12345678l",
                    name:"Arjona",
                    givenName:"Aerica",
                    familyName:"Sanchez1",
                    nameKanaHankaku:"sanchez",
                    nameKanaZenkaku:"S a n c h e z",
                    middleNames:"Sanchez1",
                    familyNameAtBirth:"YYYY",
                    address:"Tokyo-to Chiyoda-ku Iidabashi 3-10-1",
                    streetName:"Nicolas Salmeron",
                    streetNumber:"4",
                    postalCode:"1028460",
                    region:"Tokyo",
                    locality:"ZZZZ",
                    country:"JP",
                    houseNumberExtension:"36",
                    birthdate:null,
                    email:null,
                    gender:null,
                    cityOfBirth:null,
                    countryOfBirth:null,
                    nationality:null,
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                },
                body: {
                        phoneNumber: "+99999991001",
                    }
            });

        const result = await client.kyc.requestCustomerInfo(
            "+99999991001"
        );

        expect(fetchMock).toHaveFetched(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-fill-in/kyc-fill-in/v0.4/fill-in ",
            {
                method: "POST",
                body: {
                        phoneNumber: "+1234567",
                    }
            }
        );
    });
});