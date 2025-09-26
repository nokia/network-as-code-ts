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
import { SubscribeOptionalArgs, Subscription, EventType } from "../models/deviceStatus";
import { Namespace } from "./namespace";



export class DeviceStatus extends Namespace {
    /**
     *  Create subscription for device connectivity status.
     * 
            @param device (Device): Identifier of the device.
            @param eventType (EventType | string): Event type of the subscription.
            @param notificationUrl (string): Notification URL for session-related events.
            @param optionalArgs (SubscribeOptionalArgs): optional arguments(subscriptionExpireTime, maxNumberOfReports, notificationAuthToken)
            @returns Promise<Subscription>
    */

    async subscribe(
        device: Device,
        types: EventType[] | string[],
        sink: string,
        optionalArgs?: SubscribeOptionalArgs
    ): Promise<any> {
        const subscriptionExpireTime = optionalArgs?.subscriptionExpireTime;

        let api_call: DeviceReachabilityStatusAPI | DeviceRoamingStatusAPI = this.api.deviceReachabilityStatus;
        if (types[0].includes("roaming")){
            api_call = this.api.deviceRoamingStatus
        }

        const jsonData = await api_call.subscribe(
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

        return new Subscription(
            this.api,
            jsonData.subscriptionId,
            device,
            types,
            sink,
            optionalArgs?.sinkCredential,
            optionalArgs?.subscriptionMaxEvents,
            jsonData.startsAt ? new Date(jsonData.startsAt) : undefined,
            jsonData.expiresAt ? new Date(jsonData.expiresAt) : undefined
        );
    }


    /**
     *  Get a subscription by its external ID.
     * 
            @param eventSubscriptionId (string): Resource ID
            @example ```TypeScript 
            const subscription = await client.deviceStatus.get(subscription.eventSubscriptionId);
            ```
            @returns Promise<Subscription>
    */
    async getRoamingSubscription(eventSubscriptionId: string): Promise<Subscription> {
        const jsonData = await this.api.deviceRoamingStatus.get(eventSubscriptionId,);

        const deviceDetails = jsonData.subscriptionDetail.device;

        const device = new Device(
            this.api,
            deviceDetails.networkAccessIdentifier,
            deviceDetails.ipv4Address,
            deviceDetails.ipv6Address,
            deviceDetails.phoneNumber
        );

        return new Subscription(
            this.api,
            eventSubscriptionId,
            device,
            jsonData.subscriptionDetail["type"],
            jsonData.webhook.notificationUrl,
            jsonData.webhook.notificationAuthToken,
            jsonData.maxNumberOfReports,
            jsonData.startsAt ? new Date(jsonData.startsAt) : undefined,
            jsonData.expiresAt ? new Date(jsonData.expiresAt) : undefined
        );
    }
    /**
     *  Get a subscription by its external ID.
     * 
            @param eventSubscriptionId (string): Resource ID
            @example ```TypeScript 
            const subscription = await client.deviceStatus.get(subscription.eventSubscriptionId);
            ```
            @returns Promise<Subscription>
    */

    async getReachabilitySubscription(eventSubscriptionId: string): Promise<Subscription> {
        const jsonData = await this.api.deviceReachabilityStatus.get(eventSubscriptionId,);

        const deviceDetails = jsonData.subscriptionDetail.device;

        const device = new Device(
            this.api,
            deviceDetails.networkAccessIdentifier,
            deviceDetails.ipv4Address,
            deviceDetails.ipv6Address,
            deviceDetails.phoneNumber
        );

        return new Subscription(
            this.api,
            eventSubscriptionId,
            device,
            jsonData.subscriptionDetail["type"],
            jsonData.webhook.notificationUrl,
            jsonData.webhook.notificationAuthToken,
            jsonData.maxNumberOfReports,
            jsonData.startsAt ? new Date(jsonData.startsAt) : undefined,
            jsonData.expiresAt ? new Date(jsonData.expiresAt) : undefined
        );
    }
    /**
     *  Get a list of active subscriptions
     * 
     *      @example ```TypeScript 
            const subscriptions = await client.deviceStatus.getSubscriptions();
            ```
            @returns Promise<Subscription[]>
    */
   async getSubscriptions(): Promise<Subscription[]> {
        const reachabilityJsonData = await this.api.deviceReachabilityStatus.getSubscriptions();
        const roamingJsonData = await this.api.deviceRoamingStatus.getSubscriptions();
        const jsonData = [...reachabilityJsonData, ...roamingJsonData]

        return jsonData.map((entry: any) => {
            const deviceDetails = entry.subscriptionDetail.device;

            const device = new Device(
                this.api,
                deviceDetails.networkAccessIdentifier,
                deviceDetails.ipv4Address,
                deviceDetails.ipv6Address,
                deviceDetails.phoneNumber
            );

            return new Subscription(
                this.api,
                entry.subscriptionId,
                device,
                entry.subscriptionDetail["type"],
                entry.webhook.notificationUrl,
                entry.webhook.notificationAuthToken,
                entry.maxNumberOfReports,
                entry.startsAt ? new Date(entry.startsAt) : undefined,
                entry.expiresAt ? new Date(entry.expiresAt) : undefined
            );
        });
    }
}
