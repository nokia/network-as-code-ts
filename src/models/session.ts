/**
 *  A class representing the `PortRange` model.
 * #### Public Attributes:
            from (int): the `from` of a port object.
            to (int): the `to` of a port object.
 */

import { APIClient } from "../api/client";

export interface PortRange {
    // Aliasing Functionality is not implemented here but the python version has it
    from: number;
    to: number;
}

/**
 * An interface representing the `PortsSpec` model.

 * #### Public Attributes:
            ranges (PortRange[]): the `ranges` of a ports spec object.
            ports (Optional[int]): the `ports` of a ports spec object.
 */
export interface PortSpec {
    ranges?: PortRange[];
    ports?: number[];
}

/**
 * A class representing the `Session` model.

 * #### Private Attributes:
        _api(APIClient): An API client object.

    #### Public Attributes:
        id (string): Session identifier.
        serviceIp (string): IP address of a service.
        servicePorts (Union[PortsSpec, None]): List of ports for a service.
        profile (string): Name of the requested QoS profile.
        status(string): Status of the requested QoS.
        startedAt (Union[int, None]): Starting time of the session.
        expiresAt (Union[int, None]): Expiry time of the session.
    #### Public Methods:
        delete (None): Deletes a given session.
        duration (int | None): Returns the duration of a given session.
    #### Static Methods:
        convertSessionModel (Session): Returns A `Session` instance.
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
    async deleteSession() {
        await this._api.sessions.deleteSession(this.id);
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
        let startedAt = session["startedAt"]
            ? parseInt(session["startedAt"])
            : null;
        let expiresAt = session["expiresAt"]
            ? parseInt(session["expiresAt"])
            : null;

        return new QoDSession((api = api), {
            id: session["sessionId"],
            deviceIp: ip,
            devicePorts: undefined,
            serviceIP: "",
            servicePorts: undefined,
            profile: session["qosProfile"],
            status: session["qosStatus"],
            startedAt,
            expiresAt,
        });
    }
}
