import { beforeAll, describe, expect, test } from '@jest/globals';
import { NetworkAsCodeClient } from '../src/network_as_code/client';
import { DeviceIpv4Addr } from '../src/network_as_code/models/device';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

let client: NetworkAsCodeClient;

beforeAll((): any => {
	client = new NetworkAsCodeClient('TEST_TOKEN');
	return client;
});

describe('Qos', () => {
	let mock: MockAdapter;

	beforeEach(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.restore();
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
});
