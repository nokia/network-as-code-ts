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
    ipv4Address?: DeviceIpv4Addr;
    ipv6Address?: string;
    phoneNumber?: string;
    imsi?: number;
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
                - ipv4Address (DeviceIpv4Addr | undefined): ipv4 address of the subscription.
                - ipv6Address (string | undefined): ipv6 address of the subscription.
                - phoneNumber (string | undefined): phone number of the subscription.
                - imsi (number | undefined): IMSI of the subscription.

            @example ```TypeScript
            const device = client.devices.get({
                    networkAccessIdentifier: "test-device@testcsp.net",
                    ipv4Address: {
                        publicAddress: "1.1.1.2",
                        privateAddress: "1.1.1.2",
                        publicPort: 80,
                    },
                    phoneNumber: "+36705345345",
                    imsi: 1223334444,
        });
            ```
            @returns Device
    */
    get({
        networkAccessIdentifier,
        ipv4Address,
        ipv6Address,
        phoneNumber,
        imsi,
    }: DeviceGetArgs): Device {
        if (
            !networkAccessIdentifier &&
            !ipv4Address &&
            !ipv6Address &&
            !phoneNumber
        ) {
            throw new Error("At least one parameter must be set.");
        }

        if (ipv4Address?.publicAddress && (!ipv4Address?.privateAddress && !ipv4Address?.publicPort)) {
            ipv4Address.privateAddress = ipv4Address.publicAddress;
        }

        const retDevice = new Device(
            this.api,
            networkAccessIdentifier,
            ipv4Address,
            ipv6Address,
            phoneNumber,
            imsi,
        );
        return retDevice;
    }
}
