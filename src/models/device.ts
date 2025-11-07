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
import { Location, VerificationResult } from "./location";
import { Congestion } from "./congestionInsights";
import { InvalidParameterError } from "../errors";
import { MatchCustomerParams } from "./kycMatch";
import { VerifyAgeParams } from "./kycAgeVerification";
import { AccessTokenCredential } from "./authorization";

/**
 *  An interface representing the `DeviceIpv4Addr` model.
 * #### Public Attributes:
            publicAddress (string): the `public_address` of a device IPv4 address object.
            privateAddress (string): the `private_address` of a device IPv4 address object.
            publicPort (number): the `public_port` of a device IPv4 address object.
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
    sink?: string;
    sinkCredential?: AccessTokenCredential
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
        imsi (number): IMSI of the device.

    #### Public Methods:
        createQodSession (QoDSession): Creates a session for the device.
        sessions (QoDSession[]): Returns all the sessions created by the device network_access_id.
        clearSessions (): Deletes all the sessions created by the device network_access_id.
        location (Location): Gets the location of the device and returns a Location client object.
        verifyLocation (VerificationResult): Verifies if a device is located in a given location point.
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
    imsi?: number;
    constructor(
        api: APIClient,
        networkAccessIdentifier?: string,
        ipv4Address?: DeviceIpv4Addr,
        ipv6Address?: string,
        phoneNumber?: string,
        imsi?: number
    ) {
        this._api = api;
        this._sessions = [];
        this.networkAccessIdentifier = networkAccessIdentifier;
        this.ipv4Address = ipv4Address;
        this.ipv6Address = ipv6Address;
        this.phoneNumber = phoneNumber;
        this.imsi = imsi;
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
            imsi: this.imsi,
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
                - sink (optional): URL for session-related events.
                - sinkCredential (optional): Authorization information to protect the notification endpoint. 
            @returns Promise<QoDSession>

            @example ```TypeScript
            const session = device.createSession("QOS_L", {
                    duration: 3600,
                    serviceIpv4: "5.6.7.8",
                    serviceIpv6: "2041:0000:140F::875B:131B"
                })
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
            sink,
            sinkCredential,
        }: QodOptionalArgs
    ): Promise<QoDSession> {
        // Checks if at least one parameter is set
        if (!serviceIpv4 && !serviceIpv6) {
            throw new Error(
                "ValueError: At least one of IP parameters must be provided"
            );
        }

        const session = await this._api.sessions.createSession(
            profile,
            duration,
            this,
            serviceIpv6,
            serviceIpv4,
            devicePorts,
            servicePorts,
            sink,
            sinkCredential
        );

        return QoDSession.convertSessionModel(
            this._api,
            this,
            JSON.parse(JSON.stringify(session))
        );
    }

    /**
 *  List sessions of the device.
 *  @returns Promise<QoDSession[]>
 *  @example ```TypeScript
 *    sessions = device.sessions()
 *   ```
            
 */
    async sessions(): Promise<QoDSession[]> {
        try {
            const sessions: any = await this._api.sessions.getAllSessions(this);

            return sessions.map((session: any) =>
                this.__convertSessionModel(session)
            );
        } catch {

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
     *  @returns Promise<Location>
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
     *  Verifies the location of the device(Returns VerificationResult object).
     *  @param latitude (number):latitude of the device.
     *  @param longitude (number):longitude of the device.
     *  @param radius (number):radius of the device.
     *  @param maxAge (number):maxAge of the device.
     *  @returns Promise<VerificationResult>
     *  @example```TypeScript
     *      located? = device.verifyLocation(24.07915612501993, 47.48627616952785, 10_000, 60).resultType
     *   ```
     */
    async verifyLocation(
        latitude: number,
        longitude: number,
        radius: number,
        maxAge = 60
    ): Promise<VerificationResult> {
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
     * @param max_age (Optional[number]): Max acceptable age for sim swap verification info in hours
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
    

    /**
     * Get the latest device swap date.
     * @returns latest device swap date-time(string)
     */
    async getDeviceSwapDate(): Promise<Date | null> {
        if (!this.phoneNumber) {
            throw new InvalidParameterError("Device phone number is required.");
        }

        const response: any = await this._api.deviceSwap.fetchDeviceSwapDate(
            this.phoneNumber
        );

        if (response["latestDeviceChange"]) {
            return new Date(Date.parse(response["latestDeviceChange"]));
        } else {
            return null;
        }
    }

    /**
     * Verify if there was device swap.
     * @param max_age (Optional[number]): Max acceptable age for device swap verification info in hours
     * @returns true/false
     */
    async verifyDeviceSwap(maxAge?: number): Promise<boolean> {
        if (!this.phoneNumber) {
            throw new InvalidParameterError("Device phone number is required.");
        }

        const response: any = await this._api.deviceSwap.verifyDeviceSwap(
            this.phoneNumber,
            maxAge
        );
        return response["swapped"];
    }

    /**
     * Verify if the device uses the phone number.
     * @param code (string): The previously obtained authorization code.
     * @param state (string): Value transfered back and forth in the flow, used to check for a CSRF attack.
     * @returns true/false
     */
    async verifyNumber(code: string, state: string): Promise<boolean> {
        if (!this.phoneNumber) {
            throw new InvalidParameterError("Device phone number is required.");
        };

        const payload = {
            phoneNumber: this.phoneNumber
        };
        const params = new URLSearchParams({code: code, state: state});


        const response: any = await this._api.verification.verifyNumber(
            payload,
            params
        );

        return response["devicePhoneNumberVerified"];
    }

    /**
     * Get the phone number of the used Device.
     * @param code (string): The previously obtained authorization code.
     * @param state (string): Value transfered back and forth in the flow, used to check for a CSRF attack.
     * @returns (string): The phone number
     */
    async getPhoneNumber(code: string, state: string): Promise<string> {
        const params = new URLSearchParams({code: code, state: state});
        const response: any = await this._api.verification.getPhoneNumber(
            params
        );
        return response["devicePhoneNumber"];
    }

    /**
     * Get the information about Call Forwarding Services active for the given device.
     * @returns string[]: Active Call Forwarding Service types for the given device.
     */
    async getCallForwarding(): Promise<string[]> {
        if (!this.phoneNumber) {
            throw new InvalidParameterError("Device phone number is required.");
        }
        
        const response: any = await this._api.callForwarding.retrieveCallForwarding(
            this.phoneNumber
        );

        return response;
    }

    /**
     * Verify if device has unconditional call forwarding active.
     * @returns true/false
     */
    async verifyUnconditionalForwarding(): Promise<boolean> {
        if (!this.phoneNumber) {
            throw new InvalidParameterError("Device phone number is required.");
        }
        
        const response: any = await this._api.callForwarding.verifyUnconditionalForwarding(
            this.phoneNumber
        );

        return response['active'];
    }

    /**
     * Match a customer identity against the account data bound to their phone number.
     * @param params (MatchCustomerParams): A customers data that will be compared to data bound to their phone number in the operator systems.
     * @returns Promise<any>: Contains the result of matching the provided parameter values to the data in the operator system.
     */
    async matchCustomer(
        params: MatchCustomerParams
    ): Promise<any> {
        if (!params.phoneNumber) {
            params.phoneNumber = this.phoneNumber;
        }
        const response: any = await this._api.kycMatch.matchCustomer(
            params
        );

        return await response;
    }

    /**
     * Check if the user of the line is older than a provided age.
     * @param params (VerifyAgeParams): Contains age threshold which to compare user age to, subscription phone number and other optional subscriber info.
     * @returns Promise<any>: true/false/not_available for if the age of the user is the same or older than the age threshold provided. Also results for other optional request params. 
     */   
    async verifyAge(
        params: VerifyAgeParams
    ): Promise<any> {
        if (!params.phoneNumber) {
            params.phoneNumber = this.phoneNumber;
        }
        const response: any = await this._api.kycAgeVerification.verifyAge(
            params
        );

        return await response;
    }
}
