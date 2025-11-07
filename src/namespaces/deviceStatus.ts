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

import { DeviceReachabilityStatusAPI, DeviceRoamingStatusAPI } from "../api/deviceStatusAPI";
import { Device } from "../models/device";
import { SubscribeOptionalArgs, ReachabilityStatusSubscription, RoamingStatusSubscription, DeviceStatusSubscription, EventType } from "../models/deviceStatus";
import { Namespace } from "./namespace";



export class DeviceStatus extends Namespace {
    /**
     *  Create subscription for device reachability or roaming status.
     * 
            @param device (Device): Identifier of the device.
            @param types (EventType[] | string[]): Event types of the subscription.
            @param sink (string): The URL where events shall be delivered.
            @param optionalArgs (SubscribeOptionalArgs): optional arguments(subscriptionExpireTime, subscriptionMaxEvents, sinkCredential, initialEvent)
            @returns Promise<DeviceStatusSubscription>
    */

    async subscribe(
        device: Device,
        types: EventType[] | string[],
        sink: string,
        optionalArgs?: SubscribeOptionalArgs
    ): Promise<ReachabilityStatusSubscription | RoamingStatusSubscription> {
        const subscriptionExpireTime = optionalArgs?.subscriptionExpireTime;

        let apiCall: DeviceReachabilityStatusAPI | DeviceRoamingStatusAPI = this.api.deviceReachabilityStatus;

        const roamingTypes = [EventType.ROAMING_CHANGE_COUNTRY, EventType.ROAMING_OFF, EventType.ROAMING_ON, EventType.ROAMING_STATUS]

        if (Object.values(roamingTypes).includes(types[0] as any)){
            apiCall = this.api.deviceRoamingStatus
        }
        const jsonData = await apiCall.subscribe(
            device,
            types,
            sink,
            {
                subscriptionExpireTime:
                    subscriptionExpireTime instanceof Date
                        ? subscriptionExpireTime.toISOString()
                        : subscriptionExpireTime,
                ...optionalArgs,
            }
        );
        if (Object.values(roamingTypes).includes(types[0] as any)){
            return new RoamingStatusSubscription(
                this.api,
                jsonData.id,
                device,
                jsonData.sink,
                jsonData.types,
                jsonData.config.subscriptionMaxEvents,
                jsonData.config.subscriptionExpireTime,
                jsonData.startsAt ? new Date(jsonData.startsAt) : undefined,
                jsonData.expiresAt ? new Date(jsonData.expiresAt) : undefined,
                jsonData.status
            );
        } else {
            return new ReachabilityStatusSubscription(
                this.api,
                jsonData.id,
                device,
                jsonData.sink,
                jsonData.types,
                jsonData.config.subscriptionMaxEvents,
                jsonData.config.subscriptionExpireTime,
                jsonData.startsAt ? new Date(jsonData.startsAt) : undefined,
                jsonData.expiresAt ? new Date(jsonData.expiresAt) : undefined,
                jsonData.status
            );            
        }
    }


    /**
     *  Get a roaming subscription by its external ID.
     * 
            @param eventSubscriptionId (string): Resource ID
            @example ```TypeScript 
            const subscription = await client.deviceStatus.getRoamingSubscription(subscription.eventSubscriptionId);
            ```
            @returns Promise<DeviceStatusSubscription>
    */
    async getRoamingSubscription(eventSubscriptionId: string): Promise<RoamingStatusSubscription> {
        const jsonData = await this.api.deviceRoamingStatus.get(eventSubscriptionId,);

        const deviceDetails = jsonData.config.subscriptionDetail.device;

        const device = new Device(
            this.api,
            deviceDetails.networkAccessIdentifier,
            deviceDetails.ipv4Address,
            deviceDetails.ipv6Address,
            deviceDetails.phoneNumber
        );

        return new RoamingStatusSubscription(
            this.api,
            eventSubscriptionId,
            device,
            jsonData.sink,
            jsonData.types,
            jsonData.config.subscriptionMaxEvents,
            jsonData.config.subscriptionExpireTime,
            jsonData.startsAt ? new Date(jsonData.startsAt) : undefined,
            jsonData.expiresAt ? new Date(jsonData.expiresAt) : undefined,
            jsonData.status
        );
    }
    /**
     *  Get a reachability subscription by its external ID.
     * 
            @param eventSubscriptionId (string): Resource ID
            @example ```TypeScript 
            const subscription = await client.deviceStatus.getReachabilitySubscription(subscription.eventSubscriptionId);
            ```
            @returns Promise<DeviceStatusSubscription>
    */

    async getReachabilitySubscription(eventSubscriptionId: string): Promise<ReachabilityStatusSubscription> {
        const jsonData = await this.api.deviceReachabilityStatus.get(eventSubscriptionId,);

        const deviceDetails = jsonData.config.subscriptionDetail.device;

        const device = new Device(
            this.api,
            deviceDetails.networkAccessIdentifier,
            deviceDetails.ipv4Address,
            deviceDetails.ipv6Address,
            deviceDetails.phoneNumber
        );

        return new ReachabilityStatusSubscription(
            this.api,
            eventSubscriptionId,
            device,
            jsonData.sink,
            jsonData.types,
            jsonData.config.subscriptionMaxEvents,
            jsonData.config.subscriptionExpireTime,
            jsonData.startsAt ? new Date(jsonData.startsAt) : undefined,
            jsonData.expiresAt ? new Date(jsonData.expiresAt) : undefined,
            jsonData.status
        );
    }
    /**
     *  Get a list of active subscriptions
     * 
     *      @example ```TypeScript 
            const subscriptions = await client.deviceStatus.getSubscriptions();
            ```
            @returns Promise<DeviceStatusSubscription[]>
    */
   async getSubscriptions(): Promise<DeviceStatusSubscription[]> {
        const reachabilityJsonData = await this.api.deviceReachabilityStatus.getSubscriptions();
        const roamingJsonData = await this.api.deviceRoamingStatus.getSubscriptions();
        const jsonData = [...reachabilityJsonData, ...roamingJsonData]

        return jsonData.map((entry: any) => {
            const deviceDetails = entry.config.subscriptionDetail.device;

            const device = new Device(
                this.api,
                deviceDetails.networkAccessIdentifier,
                deviceDetails.ipv4Address,
                deviceDetails.ipv6Address,
                deviceDetails.phoneNumber
            );

            return new DeviceStatusSubscription(
                entry.id,
                device,
                entry.sink,
                entry.types,
                entry.config.subscriptionMaxEvents,
                entry.config.subscriptionExpireTime,
                entry.startsAt ? new Date(entry.startsAt) : undefined,
                entry.expiresAt ? new Date(entry.expiresAt) : undefined,
                entry.status
            );
        });
    }
}
