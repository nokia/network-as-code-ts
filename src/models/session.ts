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
            @param ranges (PortRange[]): the `ranges` of a ports spec object.
            @param ports (Optional[number]): the `ports` of a ports spec object.
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
        @param id (string): Session identifier.
        @param serviceIp (string): IP address of a service.
        @param servicePorts (Union[PortsSpec, undefined]): List of ports for a service.
        @param profile (string): Name of the requested QoS profile.
        @param status(string): Status of the requested QoS.
        @param startedAt (Union[number, undefined]): Starting time of the session.
        @param expiresAt (Union[number, undefined]): Expiry time of the session.
    #### Public Methods:
        delete (undefined): Deletes a given session.
        duration (number | undefined): Returns the duration of a given session.
    #### Static Methods:
        convertSessionModel (Session): Returns A `Session` instance.
 */
export class QoDSession {
    private _api: APIClient;
    id: string;
    profile: string | undefined;
    status: string | undefined;
    startedAt: Date | null | undefined;
    expiresAt: Date | null | undefined;

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
     *  Returns the duration of a given session in seconds.
     *
     */
    duration() {
        if (this.startedAt && this.expiresAt) {
            return (this.expiresAt.getTime() - this.startedAt.getTime()) / 1000;
        } else {
            null;
        }
    }

    /**
 * Returns a `Session` instance.

 * Assigns the startedAt and expiresAt attributes None if their value not found.
     #### Args:
            @param ip (any): IP address of the service.
            @param session (any): A `Session` object created by the low-level API.
            @returns QoDSession
 */
    static convertSessionModel(
        api: APIClient,
        ip: any,
        session: any
    ): QoDSession {
        let startedAt = session["startedAt"]
            ? new Date(session["startedAt"])
            : null;
        let expiresAt = session["expiresAt"]
            ? new Date(session["expiresAt"])
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
