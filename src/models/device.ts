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

/**
 *  A class representing the `Device` model.
 * #### Private Attributes:
        _api(APIClient): An API client object.
        _sessions(Session[]): List of device session instances.


    #### Public Attributes:
        sid(EmailStr): Device Identifier email string.
        phoneNumber(string): Phone Number string
        ipv4Address (DeviceIpv4Addr): DeviceIpv4Addr
        ipv6Address (string): string

    #### Public Methods:
        createSession (Session): Creates a session for the device.
        sessions (Session[]): Returns all the sessions created by the device network_access_id.
        clearSessions (): Deletes all the sessions created by the device network_access_id.
        location (Location): Gets the location of the device and returns a Location client object.
        verifyLocation (bool): Verifies if a device is located in a given location point.
        getConnectivity (ConnectivityData): Retrieve device connectivity status data
        updateConnectivity (ConnectivityData): Update device connectivity status data
        deleteConnectivity (): Delete device connectivity status
 */
export class Device {
    private _api: APIClient;
    private _sessions: QoDSession[];
    networkAccessIdentifier?: string;
    phoneNumber?: string;
    ipv4Address?: string | DeviceIpv4Addr;
    ipv6Address?: string;
    constructor(
        api: APIClient,
        networkAccessIdentifier?: string,
        ipv4Address?: string | DeviceIpv4Addr,
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

    /**
 *  Creates a session for the device.
 * #### Args:
            @param profile (any): Name of the requested QoS profile.
            @param serviceIpv4 (any): IPv4 address of the service.
            @param serviceIpv6 (optional): IPv6 address of the service.
            @param devicePorts (optional): List of the device ports.
            @param servicePorts (optional): List of the application server ports.
            @param duration (optional): Session duration in seconds.
            @param notificationUrl (optional): Notification URL for session-related events.
            @param notificationToken (optional): Security bearer token to authenticate registration of session.
            @returns Promise QoDSession

        #### Example:
            session = device.createSession(profile="QOS_L", serviceIpv4="5.6.7.8", serviceIpv6="2041:0000:140F::875B:131B", notificationUrl="https://example.com/notifications, notificationToken="c8974e592c2fa383d4a3960714")
 */
    async createQodSession(
        profile: string,
        serviceIpv4: string | undefined = undefined,
        serviceIpv6: string | undefined = undefined,
        devicePorts: PortSpec | undefined = undefined,
        servicePorts: PortSpec | undefined = undefined,
        duration = undefined,
        notificationUrl = undefined,
        notificationAuthToken = undefined
    ): Promise<QoDSession> {
        // Checks if at least one parameter is set
        if (!serviceIpv4 && !serviceIpv6) {
            throw new Error(
                "ValueError: At least one of IP parameters must be provided"
            );
        }

        let session = await this._api.sessions.createSession(
            this.networkAccessIdentifier,
            profile,
            serviceIpv6,
            serviceIpv4,
            this.phoneNumber,
            this.ipv4Address,
            this.ipv6Address,
            devicePorts,
            servicePorts,
            duration,
            notificationUrl,
            notificationAuthToken
        );

        return QoDSession.convertSessionModel(
            this._api,
            this.ipv4Address,
            JSON.parse(JSON.stringify(session))
        );
    }

    /**
 *  List sessions of the device.
 *  @returns Promise QoDSession[]
 *  #### Example:
            sessions = device.sessions()
 */
    async sessions(): Promise<QoDSession[]> {
        try {
            let sessions: any = await this._api.sessions.getAllSessions(this);
            return sessions.map((session: any) =>
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
        const result = QoDSession.convertSessionModel(
            this._api,
            this.ipv4Address,
            session
        );
        return result;
    }

    /**
 *  Returns the location of the device.
 *  @param maxAge (number): Max acceptable age for location info in seconds
 *  @returns Promise Location
 *  #### Example:
            location = device.location(60)
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
 *  #### Example:
            located? = device.verifyLocation(24.07915612501993, 47.48627616952785, 10_000, 60)
 */

    async verifyLocation(
        latitude: number,
        longitude: number,
        radius: number,
        maxAge = 60
    ): Promise<boolean> {
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
     * @returns Congestion
     */
    async getCongestion(
        start?: Date | string,
        end?: Date | string
    ): Promise<Congestion> {
        const congestionInfo = await this._api.insights.getCongestion(
            this,
            start,
            end
        );

        return congestionInfo;
    }
}
