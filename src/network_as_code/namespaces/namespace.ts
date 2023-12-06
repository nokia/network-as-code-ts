import { APIClient } from '../api/client';

/**
 *  A base class for representing a single resource instance.
 */
export abstract class Namespace {
	api: APIClient;
	constructor(api: APIClient) {
		this.api = api;
	}
}
