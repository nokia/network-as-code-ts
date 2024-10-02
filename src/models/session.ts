/**
 * Copyright 2024 Nokia
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *  A class representing the `PortRange` model.
 * #### Public Attributes:
            from (int): the `from` of a port object.
            to (int): the `to` of a port object.
 */

import { APIClient } from "../api/client";
import { Device } from "./device";

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
    device: Device;
    duration?: number;
    serviceIpv4?: string = "";
    serviceIpv6?: string = "";
    servicePorts?: PortSpec;
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
        this.device = options?.device;
        this.serviceIpv4 = options?.serviceIpv4;
        this.serviceIpv6 = options?.serviceIpv6;
        this.servicePorts = options?.servicePorts;
        this.duration = options?.duration;
    }

    /**
     *  Deletes a given session
     *
     */
    async deleteSession() {
        if (this.id) {
            await this._api.sessions.deleteSession(this.id);
        }
    }

    /**
     *  Extends the duration of a given session.
     * #### Args:
            additionalDuration (number): Additional session duration in seconds.
     */
    async extendSession(additionalDuration: number) {
        if (this.id) {
            const res = await this._api.sessions.extendSession(
                this.id,
                additionalDuration
            );
            const sessionJson: any = await res.json();
            const device = new Device(
                this._api,
                sessionJson.networkAccessIdentifier,
                sessionJson.ipv4Address,
                sessionJson.ipv6Address,
                sessionJson.phoneNumber
            );
            return QoDSession.convertSessionModel(
                this._api,
                device,
                sessionJson
            );
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
        device: Device,
        session: any
    ): QoDSession {
        let startedAt = session["startedAt"]
            ? new Date(session["startedAt"])
            : null;
        let expiresAt = session["expiresAt"]
            ? new Date(session["expiresAt"])
            : null;
        const service = session["applicationServer"];
        return new QoDSession(api, {
            id: session["sessionId"],
            device: device,
            devicePorts: undefined,
            serviceIpv4: service ? service["ipv4Address"] : "",
            serviceIpv6: service ? service["ipv6Address"] : "",
            servicePorts: session["applicationServerPorts"],
            profile: session["qosProfile"],
            status: session["qosStatus"],
            duration: session["duration"],
            startedAt,
            expiresAt,
        });
    }
}
