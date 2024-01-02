import { beforeAll, describe, expect, test } from '@jest/globals';
import { NetworkAsCodeClient } from '../src/network_as_code/client';
import { DeviceIpv4Addr } from '../src/network_as_code/models/device';
import 'dotenv/config';

let client: NetworkAsCodeClient;

beforeAll((): any => {
	const NAC_TOKEN = process.env['NAC_TOKEN'];
	client = new NetworkAsCodeClient(NAC_TOKEN ? NAC_TOKEN : 'TEST_TOKEN');
	return client;
});

describe('Qos', () => {
	test('should get a device', () => {
		let device = client.devices.get(
			'testuser@open5glab.net',
			new DeviceIpv4Addr('1.1.1.2', '1.1.1.2', 80)
		);
		expect(device.networkAccessIdentifier).toEqual(
			'testuser@open5glab.net'
		);
	});

	test('should create a session', async () => {
		let device = client.devices.get(
			'testuser@open5glab.net',
			new DeviceIpv4Addr('1.1.1.2', '1.1.1.2', 80),
			undefined,
			'9382948473'
		);

		const session = await device.createQodSession(
			'QOS_L',
			'5.6.7.8',
			'2041:0000:140F::875B:131B'
		);
		expect(session.status).toEqual('REQUESTED');
		expect(session.profile).toEqual('QOS_L');
		await session.deleteSession();
	});

	test('should get one session', async () => {
		let device = client.devices.get(
			'testuser@open5glab.net',
			new DeviceIpv4Addr('1.1.1.2', '1.1.1.2', 80),
			undefined,
			'9382948473'
		);

		const newSession = await device.createQodSession(
			'QOS_L',
			'5.6.7.8',
			'2041:0000:140F::875B:131B'
		);

		const session = await client.sessions.get(newSession.id);
		expect(session.id).toEqual(newSession.id);
		await session.deleteSession();
		// Test with not found case, when the error handler is added
	});
});
