import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
import { beforeAll, describe, expect, test } from '@jest/globals';
import { NetworkAsCodeClient } from '../src/network_as_code/client';
import { DeviceIpv4Addr } from '../src/network_as_code/models/device';
import fetchMock from 'jest-fetch-mock';

let client: NetworkAsCodeClient;

beforeAll((): any => {
	client = new NetworkAsCodeClient('TEST_TOKEN');
	return client;
});

describe('Qos', () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	test('should get a device', () => {
		let device = client.devices.get(
			'testuser@open5glab.net',
			new DeviceIpv4Addr('1.1.1.2', '1.1.1.2', 80)
		);
		expect(device.networkAccessIdentifier).toEqual(
			'testuser@open5glab.net'
		);
	});

	test('should get one session', async () => {
		let mockResponse = {
			sessionId: '1234',
			qosProfile: 'QOS_L',
			qosStatus: 'BLA',
			expiresAt: 1641494400,
			startedAt: 0,
		};

		fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

		const sessions = await client.sessions.get('1234');
		expect(sessions.id).toEqual('1234');
	});

	test('should get all sessions', async () => {
		let device = client.devices.get(
			'testuser@open5glab.net',
			new DeviceIpv4Addr('1.1.1.2', '1.1.1.2', 80)
		);

		let mockResponse = [
			{
				sessionId: '1234',
				qosProfile: 'QOS_L',
				qosStatus: 'BLA',
				expiresAt: 1641494400,
				startedAt: 0,
			},
		];

		fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

		const sessions = await device.sessions();
		expect(sessions[0].id).toEqual('1234');
	});
});
