import fetch from 'node-fetch';
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
    it('should get location', async () => {
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

    it('should verify location', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({
            verificationResult: 'TRUE',
        }));

        const result = await device.verifyLocation(0, 0, 5000, 60);

        expect(result).toBe(true);
    });
});
