import { describe, expect, test } from '@jest/globals';
import { NetworkAsCodeClient } from '../src/network_as_code/client';

describe('NetworkAsCodeClient', () => {
	test('should create an instance of NetworkAsCodeClient', () => {
		const nac = new NetworkAsCodeClient('TEST_TOKEN');
		expect(nac).toBeInstanceOf(NetworkAsCodeClient);
	});

	test('should create an instance of NetworkAsCodeClient with optional arguments', () => {
		const nac = new NetworkAsCodeClient('TEST_TOKEN', {
			'key 1': 'value 1',
		});
		expect(nac).toBeInstanceOf(NetworkAsCodeClient);
	});
});
