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
	let baseUrl = 'https://quality-of-service-on-demand.p-eu.rapidapi.com';
	let headers = {
		'X-RapidAPI-Host': 'quality-of-service-on-demand.nokia.rapidapi.com',
		'X-RapidAPI-Key': 'TEST_TOKEN',
	};
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

	// test('should create a session', async () => {
	// 	let device = client.devices.get(
	// 		'testuser@open5glab.net',
	// 		new DeviceIpv4Addr('1.1.1.2', '1.1.1.2', 80)
	// 	);
	// 	let mockResponse = {
	// 		"sessionId": "08305343-7ed2-43b7-8eda-4c5ae9805bd0",
	// 		"qosProfile": "QOS_L",
	// 		"qosStatus": "REQUESTED",
	// 		"startedAt": 1691671102,
	// 		"expiresAt": 1691757502
	// 	}

	// 	fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

	// 	const sessions = await client.sessions.get('1234');
	// 	expect(sessions.id).toEqual('1234');
	// });

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
		expect(fetchMock).toHaveBeenCalledWith(baseUrl + '/sessions/1234', {
			method: 'GET',
			headers,
		});
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
		expect(fetchMock).toHaveBeenCalledWith(
			baseUrl +
				'/sessions?networkAccessIdentifier=testuser@open5glab.net',
			{
				method: 'GET',
				headers,
			}
		);
	});
});
