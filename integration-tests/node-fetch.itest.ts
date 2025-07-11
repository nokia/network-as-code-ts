
import { describe, expect} from "@jest/globals";

import fetch from 'node-fetch';

import "dotenv/config";

import { ProxyAgent } from 'proxy-agent';

const proxyAgent = new ProxyAgent();

const NAC_TOKEN = process.env["NAC_TOKEN"];

describe("test that proxy works with node-fetch", () => {
    it("can execute call with node-fetch, using proxy", async () => {
        // expect(result.status).toBe(200);
        const url = 'https://network-as-code1.p-eu.rapidapi.com/location-retrieval/v0/retrieve';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': NAC_TOKEN,
                'X-RapidAPI-Host': 'network-as-code1.nokia-dev.rapidapi.com'
            },
            body: JSON.stringify({
                device: {
                    networkAccessIdentifier: "testuser@testcsp.net",
                },
                maxAge: 60
            }),
            agent: proxyAgent
        };

	    const response = await fetch(url, options as any);
	    const result = await response.json();

        expect(response.status).toBe(200);
    })
})
