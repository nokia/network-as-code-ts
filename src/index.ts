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

import { APIClient } from "./api/client";
import { CongestionInsights } from "./namespaces/congestionInsights";
import { Devices } from "./namespaces/device";
import { DeviceStatus } from "./namespaces/deviceStatus";
import { Geofencing } from "./namespaces/geofencing";
import { Sessions } from "./namespaces/session";
import { Slices } from "./namespaces/slice";
import { Authorization } from "./namespaces/authorization";
import { KYC } from "./namespaces/kyc";

/**
 * A client for working with Network as Code.
 *  @example Example:
    import { NetworkAsCodeClient } from "network-as-code";

    client = NetworkAsCodeClient("your_api_token")
    device = client.devices.get("user@example.com")
    console.log(device.getLocation())
    
    ### Args:
        @param token - Authorization token for the Network as Code API.
 */
export class NetworkAsCodeClient {
    private _api: APIClient;
    private _devices: Devices;
    private _sessions: Sessions;
    private _deviceStatus: DeviceStatus;
    private _slices: Slices;
    private _insights: CongestionInsights;
    private _geofencing: Geofencing;
    private _authorization: Authorization;
    private _kyc: KYC;
    

    constructor(token: string, envMode?: string) {
        this._api = new APIClient(token, envMode);
        this._devices = new Devices(this._api);
        this._sessions = new Sessions(this._api);
        this._deviceStatus = new DeviceStatus(this._api);
        this._slices = new Slices(this._api);
        this._insights = new CongestionInsights(this._api);
        this._geofencing = new Geofencing(this._api);
        this._authorization = new Authorization(this._api);
        this._kyc = new KYC(this._api);
    }

    /**
     * Namespace containing functionalities related to mobile subscriptions.
     * @returns NAC Devices
     */
    get devices() {
        return this._devices;
    }

    /**
     * Namespace containing functionalities related to mobile subscriptions.
     * @returns NAC sessions
     */
    get sessions() {
        return this._sessions;
    }

    /**
     * Namespace containing functionalities related to device status.
     * @returns NAC deviceStatus
     */
    get deviceStatus() {
        return this._deviceStatus;
    }

    /**
     * Namespace containing functionalities related to network slicing.
     * @returns NAC slices
     */
    get slices() {
        return this._slices;
    }

    /**
     * Namespace containing functionalities related to congestion insights.
     * @returns NAC congestion insights
     */
    get insights() {
        return this._insights;
    }

    /**
     * Namespace containing functionalities related to geofencing.
     * @returns NAC geofencing 
     */
    get geofencing() {
        return this._geofencing;
    }

    /**
     * Namespace containing functionalities related to authorization.
     * @returns NAC authorization
     */
    get authorization() {
        return this._authorization;
    }

    /**
     * Namespace containing functionalities related to Know Your Customer.
     * @returns NAC kyc
     */
    get kyc() {
        return this._kyc;
    }

    /**
     * @returns NAC API
     */
    get api() {
        return this._api;
    }
}

export function main() {}

main();
