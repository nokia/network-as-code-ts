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


describe("KYC Check Tenure", () => {
    it("KYC checkTenure results true", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-tenure/kyc-tenure/v0.1/check-tenure",
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                }),
                expect(JSON.parse(req.body.toString())).toEqual(
                    {
                        phoneNumber: "+99999991000",
                        tenureDate: "2023-08-22",
                    }
                )
            },
            { response: 
                JSON.stringify({
                    tenureDateCheck: true,
                    contractType: "Business"
            })});

        const result = await client.kyc.checkTenure(
            "+99999991000",
            "2023-08-22"

        );

        expect(result.tenureDateCheck).toBe(true)
        expect(result.contractType).toEqual("Business")
    });

    it("KYC checkTenure results false", async () => {
        fetchMock.mockGlobal().post(
            "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/kyc-tenure/kyc-tenure/v0.1/check-tenure",
            (req: any): any => {
                expect(req.headers).toEqual({
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "network-as-code.nokia.rapidapi.com",
                    "X-RapidAPI-Key": 'TEST_TOKEN'
                }),
                expect(JSON.parse(req.body.toString())).toEqual(
                    {
                        phoneNumber: "+99999991000",
                        tenureDate: "2023-08-22",
                    }
                )
            },
            { response: 
                JSON.stringify({
                    tenureDateCheck: false,
                    contractType: "Business"
            })});

        const result = await client.kyc.checkTenure(
            "+99999991000",
            "2023-08-22"

        );

        expect(result.tenureDateCheck).toBe(false)
    });
});
