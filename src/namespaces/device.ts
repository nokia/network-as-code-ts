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

import { Device, DeviceIpv4Addr } from "../models/device";
import { Namespace } from "./namespace";

export interface DeviceGetArgs {
    networkAccessIdentifier?: string;
    ipv4Address?: string | DeviceIpv4Addr;
    ipv6Address?: string;
    phoneNumber?: string;
}

/**
 *  Representation of a mobile subscription.
 * 
 * Through this class many of the parameters of a
    subscription can be configured on the network.
 */
export class Devices extends Namespace {
    /**
     *  Get a device by its external ID.
     *      @param DeviceGetArgs (object): 
                - networkAccessIdentifier (string | undefined): External ID of the subscription. Email-like.
                - ipv4Address (string | undefined): ipv4 address of the subscription.
                - ipv6Address (string | undefined): ipv6 address of the subscription.
                - phoneNumber (string | undefined): phone number of the subscription.
            @returns Device
    */
    get({
        networkAccessIdentifier,
        ipv4Address,
        ipv6Address,
        phoneNumber,
    }: DeviceGetArgs): Device {
        if (
            !networkAccessIdentifier &&
            !ipv4Address &&
            !ipv6Address &&
            !phoneNumber
        ) {
            throw new Error("At least one parameter must be set.");
        }

        if (typeof ipv4Address === "string") {
            ipv4Address = { publicAddress: ipv4Address };
        }

        let retDevice = new Device(
            this.api,
            networkAccessIdentifier,
            ipv4Address,
            ipv6Address,
            phoneNumber
        );
        return retDevice;
    }
}
