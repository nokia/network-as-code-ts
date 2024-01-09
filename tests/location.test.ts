import fetchMock from 'jest-fetch-mock';

import { NetworkAsCodeClient } from "../src/network_as_code/client"
import { Device, DeviceIpv4Addr } from '../src/network_as_code/models/device';

fetchMock.enableMocks();

let client: NetworkAsCodeClient;

let device: Device;

beforeAll((): any => {
	client = new NetworkAsCodeClient('TEST_TOKEN');
    device = client.devices.get("test-device@testcsp.net", new DeviceIpv4Addr("1.1.1.2", "1.1.1.2", 80));
	return client;
});

// Tests
beforeEach(() => {
  fetchMock.resetMocks();
});

describe('Device', () => {
    it('should send location request to the right URL with right parameters', async () => {
        fetchMock.mockIf("https://location-retrieval.p-eu.rapidapi.com/retrieve", (req: any): any => {
            expect(JSON.parse(req.body.toString())).toEqual({
                device: {
                    networkAccessIdentifier: "test-device@testcsp.net",
                    ipv4Address: {
                        publicAddress: "1.1.1.2",
                        privateAddress: "1.1.1.2",
                        publicPort: 80
                    }
                },
                maxAge: 60
            })

            return Promise.resolve({
                body: JSON.stringify(
                    {
                        longitude: 0.0,
                        latitude: 0.0,
                        civicAddress: {
                            country: 'Finland',
                            A1: '',
                            A2: '',
                            A3: '',
                            A4: '',
                            A5: '',
                            A6: '',
                        },
                    })
            })  
        });

        const location = await device.getLocation(60);
    });

    it('should get location from a valid response', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({
            longitude: 0.0,
            latitude: 0.0,
            civicAddress: {
                country: 'Finland',
                A1: '',
                A2: '',
                A3: '',
                A4: '',
                A5: '',
                A6: '',
            },
        }));

        const location = await device.getLocation(60);

        expect(location.longitude).toBe(0.0);
        expect(location.latitude).toBe(0.0);
        expect(location.civicAddress).toBeDefined();
    });

    it('can omit maxAge if 60 seconds is fine', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({
            longitude: 0.0,
            latitude: 0.0,
            civicAddress: {
                country: 'Finland',
                A1: '',
                A2: '',
                A3: '',
                A4: '',
                A5: '',
                A6: '',
            },
        }));

        const location = await device.getLocation();

        expect(location.longitude).toBe(0.0);
        expect(location.latitude).toBe(0.0);
        expect(location.civicAddress).toBeDefined();
    });

    it('should return true if location verification response is TRUE', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({
            verificationResult: 'TRUE',
        }));

        const result = await device.verifyLocation(0, 0, 5000, 60);

        expect(result).toBe(true);
    });

    it('should verify location with possibility to omit maxAge if 60 seconds is fine', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({
            verificationResult: 'TRUE',
        }));

        const result = await device.verifyLocation(0, 0, 5000);

        expect(result).toBe(true);
    });

    it('should return false if location verification response is FALSE', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({
            verificationResult: 'FALSE',
        }));

        const result = await device.verifyLocation(0, 0, 5000, 60);

        expect(result).toBe(false);
    });
});
