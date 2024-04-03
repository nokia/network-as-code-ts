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

import { Device } from "../models/device";
import { Subscription } from "../models/deviceStatus";
import { Namespace } from "./namespace";

export interface SubscribeOptionalArgs {
    subscriptionExpireTime?: string;
    maxNumberOfReports?: number;
    notificationAuthToken?: string;
}

export class DeviceStatus extends Namespace {
    /**
     *  Create subscription for device connectivity status.
     * 
            @param device (Device): Identifier of the device.
            @param eventType (string): Event type of the subscription.
            @param notificationUrl (string): Notification URL for session-related events.
            @param optionalArgs (SubscribeOptionalArgs): optional arguments(subscriptionExpireTime, maxNumberOfReports, notificationAuthToken)
            @returns Promise Subscription
    */

    async subscribe(
        device: Device,
        eventType: string,
        notificationUrl: string,
        optionalArgs?: SubscribeOptionalArgs
    ): Promise<Subscription> {
        const jsonData = await this.api.deviceStatus.subscribe(
            device,
            eventType,
            notificationUrl,
            optionalArgs
        );

        return new Subscription(
            this.api,
            jsonData.eventSubscriptionId,
            device,
            eventType,
            notificationUrl,
            jsonData.startsAt,
            jsonData.expiresAt
        );
    }

    /**
     *  Get a subscription by its external ID.
     * 
            @param eventSubscriptionId (string): Resource ID
            @returns Promise Subscription
    */
    async get(eventSubscriptionId: string): Promise<Subscription> {
        const jsonData = await this.api.deviceStatus.get(eventSubscriptionId);

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
            jsonData.subscriptionDetail.eventType,
            jsonData.webhook.notificationUrl,
            jsonData.startsAt,
            jsonData.expiresAt
        );
    }
}
