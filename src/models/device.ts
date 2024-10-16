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

import { APIClient } from "../api/client";
import { PortSpec, QoDSession } from "./session";
import { Location } from "./location";
import { Congestion } from "./congestionInsights";
import { InvalidParameterError } from "../errors";

/**
 * An interface representing the `Event` model.
 * #### Public Attributes:
            eventTarget (string): the `eventTarget` of an event object.
            atUnix (float): the `atUnix` of an event object.
 */
interface Event {
    eventTarget: string;
    atUnix: number;
}

/**
 *  An interface representing the `DeviceIpv4Addr` model.
 * #### Public Attributes:
            publicAddress (float): the `public_address` of a device IPv4 address object.
            privateAddress (float): the `private_address` of a device IPv4 address object.
            publicPort (Optional[CivicAddress]): the `public_port` of a device IPv4 address object.
 */
export interface DeviceIpv4Addr {
    publicAddress?: string;
    privateAddress?: string;
    publicPort?: number;
}

/**
 * An interface representing roaming status
 * #### Public attributes
 *          roaming (boolean): indicates whether this device is currently roaming
 *          countryCode (number): code for the country in which the roaming is happening
 *          countryName (string[]): list of country names, if any, for this country code
 */
export interface RoamingStatus {
    roaming: boolean;
    countryCode?: number;
    countryName?: string[];
}

export interface QodOptionalArgs {
    duration: number;
    serviceIpv4?: string;
    serviceIpv6?: string;
    devicePorts?: PortSpec;
    servicePorts?: PortSpec;
    notificationUrl?: string;
    notificationAuthToken?: string;
}

/**
 *  A class representing the `Device` model.
 * #### Private Attributes:
        _api(APIClient): An API client object.
        _sessions(QoDSession[]): List of device session instances.


    #### Public Attributes:
        networkAccessIdentifier(EmailStr): Device Identifier email string.
        phoneNumber(string): Phone Number string
        ipv4Address (DeviceIpv4Addr): Ipv4 address of the device.
        ipv6Address (string): Ipv6 address of the device.

    #### Public Methods:
        createQodSession (QoDSession): Creates a session for the device.
        sessions (QoDSession[]): Returns all the sessions created by the device network_access_id.
        clearSessions (): Deletes all the sessions created by the device network_access_id.
        location (Location): Gets the location of the device and returns a Location client object.
        verifyLocation (bool): Verifies if a device is located in a given location point.
        getConnectivity (ConnectivityData): Retrieve device connectivity status data
        updateConnectivity (ConnectivityData): Update device connectivity status data
        deleteConnectivity (): Delete device connectivity status
        getSimSwapDate (): Retrieve the latest sim swap date
        verifySimSwap (): Verify if there was sim swap
 */
export class Device {
    private _api: APIClient;
    private _sessions: QoDSession[];
    networkAccessIdentifier?: string;
    phoneNumber?: string;
    ipv4Address?: DeviceIpv4Addr;
    ipv6Address?: string;
    constructor(
        api: APIClient,
        networkAccessIdentifier?: string,
        ipv4Address?: DeviceIpv4Addr,
        ipv6Address?: string,
        phoneNumber?: string
    ) {
        this._api = api;
        this._sessions = [];
        this.networkAccessIdentifier = networkAccessIdentifier;
        this.ipv4Address = ipv4Address;
        this.ipv6Address = ipv6Address;
        this.phoneNumber = phoneNumber;
    }

    get networkAccessId(): string | undefined {
        return this.networkAccessIdentifier;
    }

    // To serialize Device object to JSON
    toJSON() {
        return {
            networkAccessIdentifier: this.networkAccessIdentifier,
            phoneNumber: this.phoneNumber,
            ipv4Address: this.ipv4Address,
            ipv6Address: this.ipv6Address,
        };
    }

    /**
 *  Creates a session for the device.
 * #### Args:
            @param profile (any): Name of the requested QoS profile.
            @param optionalArgs(QodOptionalArgs): Optional Arguments, except duration
                - duration (mandatory): Session duration in seconds.
                - serviceIpv4 (any): IPv4 address of the service.
                - serviceIpv6 (optional): IPv6 address of the service.
                - devicePorts (optional): List of the device ports.
                - servicePorts (optional): List of the application server ports.
                - notificationUrl (optional): Notification URL for session-related events.
                - notificationAuthToken (optional): Security bearer token to authenticate registration of session.
            @returns Promise QoDSession

            @exmple ```TypeScript
            session = device.createSession(profile="QOS_L", 
            {serviceIpv4:"5.6.7.8", serviceIpv6:"2041:0000:140F::875B:131B", notificationUrl:"https://example.com/notifications, notificationToken: "c8974e592c2fa383d4a3960714"})
            ```
 */
    async createQodSession(
        profile: string,
        {
            duration,
            serviceIpv4,
            serviceIpv6,
            devicePorts,
            servicePorts,
            notificationUrl,
            notificationAuthToken,
        }: QodOptionalArgs
    ): Promise<QoDSession> {
        // Checks if at least one parameter is set
        if (!serviceIpv4 && !serviceIpv6) {
            throw new Error(
                "ValueError: At least one of IP parameters must be provided"
            );
        }

        let session = await this._api.sessions.createSession(
            profile,
            duration,
            this,
            serviceIpv6,
            serviceIpv4,
            devicePorts,
            servicePorts,
            notificationUrl,
            notificationAuthToken
        );

        return QoDSession.convertSessionModel(
            this._api,
            this,
            JSON.parse(JSON.stringify(session))
        );
    }

    filterSessionsByDevice(session: QoDSession): boolean {
        return (
            session.device.networkAccessIdentifier ===
                this.networkAccessIdentifier &&
            (session.device.phoneNumber == null ||
                session.device.phoneNumber === this.phoneNumber)
        );
    }

    /**
 *  List sessions of the device.
 *  @returns Promise QoDSession[]
 *  @example ```TypeScript
 *    sessions = device.sessions()
 *   ```
            
 */
    async sessions(): Promise<QoDSession[]> {
        try {
            let sessions: any = await this._api.sessions.getAllSessions(this);
            const filteredSessions = sessions.filter((session: QoDSession) =>
                this.filterSessionsByDevice(session)
            );

            return filteredSessions.map((session: any) =>
                this.__convertSessionModel(session)
            );
        } catch (error) {
            return [];
        }
    }

    /**
     *  Clears sessions of the device.
     *
     */
    async clearSessions(): Promise<void> {
        const sessions = await this.sessions();
        sessions.forEach(async (session: any) => {
            await session.deleteSession();
        });
    }

    __convertSessionModel(session: any): QoDSession {
        const result = QoDSession.convertSessionModel(this._api, this, session);
        return result;
    }

    /**
     *  Returns the location of the device.
     *  @param maxAge (number): Max acceptable age for location info in seconds
     *  @returns Promise Location
     *  @example ```TypeScript
     *     location = device.location(60)
     *   ```
     */
    async getLocation(maxAge: number = 60): Promise<Location> {
        const location = await this._api.locationRetrieval.getLocation(
            this,
            maxAge
        );

        return location;
    }

    /**
     *  Verifies the location of the device(Returns boolean value).
     *  @param latitude (number):latitude of the device.
     *  @param longitude (number):longitude of the device.
     *  @param radius (number):radius of the device.
     *  @param maxAge (number):maxAge of the device.
     *  @returns Promise boolean
     *  @example```TypeScript
     *      located? = device.verifyLocation(24.07915612501993, 47.48627616952785, 10_000, 60)
     *   ```
     */
    async verifyLocation(
        latitude: number,
        longitude: number,
        radius: number,
        maxAge = 60
    ): Promise<boolean | string> {
        return this._api.locationVerify.verifyLocation(
            latitude,
            longitude,
            this,
            radius,
            maxAge
        );
    }

    /**
     * Retrieves the current connectivity status of the device
     * @returns Promise<string>: The connectivity status, e.g. "CONNECTED_DATA"
     */
    async getConnectivity(): Promise<string> {
        const json = await this._api.deviceStatus.getConnectivity(this);

        return json["connectivityStatus"];
    }

    /**
     * Retrieves the current connectivity status of the device
     * @returns Promise<RoamingStatus>: The roaming status for whether the device is roaming and in what network
     */
    async getRoaming(): Promise<RoamingStatus> {
        return this._api.deviceStatus.getRoaming(this);
    }

    toJson(): any {
        return {
            networkAccessIdentifier: this.networkAccessId,
            phoneNumber: this.phoneNumber,
            ipv4Address: this.ipv4Address,
            ipv6Address: this.ipv6Address,
        };
    }

    /**
     * Retrieves the current congestion insight of a device
     * @param start (Date|string]): Beginning of the time range to access historical or predicted congestion
     * @param end (Date|string]): End of the time range to access historical or predicted congestion
     * @returns Congestion
     * TODO: This will only be possible to call after a Subscription has been set up.
     *       We should either need to migrate this method under CongestionSubscription,
     *       take a CongestionSubscription as a parameter or ensure via docs that a
     *       CongestionSubscription gets created first.
     */
    async getCongestion(
        start?: Date | string,
        end?: Date | string
    ): Promise<Congestion[]> {
        const congestionInfo = await this._api.insights.getCongestion(
            this,
            start,
            end
        );

        return congestionInfo.map((congestionJson: any) => ({
            level: congestionJson.congestionLevel,
            confidence: congestionJson.confidenceLevel,
            start: new Date(congestionJson.timeIntervalStart),
            stop: new Date(congestionJson.timeIntervalStop),
        }));
    }

    /**
     * Get the latest simswap date.
     * @returns latest sim swap date-time(string)
     */
    async getSimSwapDate(): Promise<Date | null> {
        if (!this.phoneNumber) {
            throw new InvalidParameterError("Device phone number is required.");
        }

        const response: any = await this._api.simSwap.fetchSimSwapDate(
            this.phoneNumber
        );

        if (response["latestSimChange"]) {
            return new Date(Date.parse(response["latestSimChange"]));
        } else {
            return null;
        }
    }

    /**
     * Verify if there was sim swap.
     * @param max_age (Optional[number]): Max acceptable age for sim swap verification info in seconds
     * @returns true/false
     */
    async verifySimSwap(maxAge?: number): Promise<boolean> {
        if (!this.phoneNumber) {
            throw new InvalidParameterError("Device phone number is required.");
        }

        const response: any = await this._api.simSwap.verifySimSwap(
            this.phoneNumber,
            maxAge
        );
        return response["swapped"];
    }
}
