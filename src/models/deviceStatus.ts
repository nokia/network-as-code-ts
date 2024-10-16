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

import { APIClient } from "../api";
import { Device } from "./device";

export interface SubscribeOptionalArgs {
    subscriptionExpireTime?: Date | string;
    maxNumberOfReports?: number;
    notificationAuthToken?: string;
}

/**
 *  A class representing the `ConnectivitySubscription` model.
 * #### Private Attributes:
        @param api(APIClient): An API client object.
    #### Public Attributes:
        @param eventSubscriptionId (string): IIt represents the subscription identifier.
        @param device (Device): Identifier of the device
        @param eventType (string): The status type you want to check, which can be connectivity or roaming.
        @param notificationUrl (string): Notification URL for session-related events.
        @param startsAt (optional): It represents when this subscription started.
        @param expiresAt (optional): It represents when this subscription should expire.
    #### Public Methods:
        @method delete(): Deletes device connectivity status subscription.
 */
export class Subscription {
    private api: APIClient;
    eventSubscriptionId: string;
    device: Device;
    eventType: string;
    notificationUrl: string;
    maxNumOfReports?: number;
    notificationAuthToken?: string;
    startsAt?: Date;
    expiresAt?: Date;

    constructor(
        api: APIClient,
        eventSubscriptionId: string,
        device: Device,
        eventType: string,
        notificationUrl: string,
        notificationAuthToken?: string,
        maxNumOfReports?: number,
        startsAt?: Date,
        expiresAt?: Date
    ) {
        this.api = api;
        this.eventSubscriptionId = eventSubscriptionId;
        this.device = device;
        this.eventType = eventType;
        this.notificationUrl = notificationUrl;
        this.startsAt = startsAt;
        this.expiresAt = expiresAt;
        this.maxNumOfReports = maxNumOfReports;
        this.notificationAuthToken = notificationAuthToken;
    }

    /**
     *  Delete device connectivity status
     */
    async delete() {
        this.api.deviceStatus.delete(this.eventSubscriptionId);
    }
}
