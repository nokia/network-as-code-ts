/**
 *  A class representing the `PortRange` model.
 * #### Public Attributes:
            start (int): the `start` of a port object.
            end (int): the `end` of a port object.
 */

import { APIClient } from '../api/client';

export class PortRange {
	constructor(start: number, end: number) {}
}

/**
 * A class representing the `PortsSpec` model.

 * #### Public Attributes:
            ranges (PortRange[]): the `ranges` of a ports spec object.
            ports (Optional[int]): the `ports` of a ports spec object.
 */
export class PortSpec {
	constructor(ranges: PortRange[] = [], ports: number[] = []) {}
}

/**
 * A class representing the `Session` model.

 * #### Private Attributes:
        _api(APIClient): An API client object.

    #### Public Attributes:
        id (str): Session identifier.
        service_ip (str): IP address of a service.
        service_ports (Union[PortsSpec, None]): List of ports for a service.
        profile (str): Name of the requested QoS profile.
        status(str): Status of the requested QoS.
        started_at (Union[int, None]): Starting time of the session.
        expires_at (Union[int, None]): Expiry time of the session.
    #### Public Methods:
        delete (None): Deletes a given session.
        duration (int | None): Returns the duration of a given session.
    #### Static Methods:
        convert_session_model (Session): Returns A `Session` instance.
 */
export class QoDSession {
	private _api: APIClient;
	id: string;
	profile: string | undefined;
	status: string | undefined;
	startedAt: number | null | undefined;
	expiresAt: number | null | undefined;

	constructor(api: APIClient, options: Record<string, any> = {}) {
		this._api = api;
		this.id = options?.id;
		this.profile = options?.profile;
		this.status = options?.status;
		this.startedAt = options?.startedAt;
		this.expiresAt = options?.expiresAt;
	}

	/**
	 *  Deletes a given session
	 *
	 */
	deleteSession() {
		this._api.sessions.deleteSession(this.id);
	}

	/**
	 *  Returns the duration of a given session.
	 *
	 */
	duration() {
		if (this.startedAt && this.expiresAt) {
			return this.expiresAt - this.startedAt;
		} else {
			null;
		}
	}

	/**
 * Returns a `Session` instance.

 * Assigns the startedAt and expiresAt attributes None if their value not found.
     #### Args:
            ip (any): IP address of the service.
            session (any): A `Session` object created by the low-level API.
 */
	static convertSessionModel(
		api: APIClient,
		ip: any,
		session: any
	): QoDSession {
		let startedAt = session['startedAt']
			? parseInt(session['startedAt'])
			: null;
		let expiresAt = session['expiresAt']
			? parseInt(session['expiresAt'])
			: null;

		return new QoDSession((api = api), {
			id: session['sessionId'],
			deviceIp: ip,
			devicePorts: undefined,
			serviceIP: '',
			servicePorts: undefined,
			profile: session['qosProfile'],
			status: session['qosStatus'],
			startedAt,
			expiresAt,
		});
	}
}
