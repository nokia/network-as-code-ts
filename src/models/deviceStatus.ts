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


export enum EventType {
    REACHABILITY_DATA = "org.camaraproject.device-reachability-status-subscriptions.v0.reachability-data",
    REACHABILITY_SMS = "org.camaraproject.device-reachability-status-subscriptions.v0.reachability-sms",
    REACHABILITY_DISCONNECTED = "org.camaraproject.device-reachability-status-subscriptions.v0.reachability-disconnected",
    ROAMING_STATUS = "org.camaraproject.device-roaming-status-subscriptions.v0.roaming-status",
    ROAMING_ON = "org.camaraproject.device-roaming-status-subscriptions.v0.roaming-on",
    ROAMING_OFF = "org.camaraproject.device-roaming-status-subscriptions.v0.roaming-off",
    ROAMING_CHANGE_COUNTRY = "org.camaraproject.device-roaming-status-subscriptions.v0.roaming-change-country"
}


export interface SubscribeOptionalArgs {
    subscriptionExpireTime?: Date | string,
    subscriptionMaxEvents?: number,
    sinkCredential?: PlainCredential | AccessTokenCredential,
    initialEvent?: boolean
}

export interface PlainCredential {
    credentialType: "PLAIN",
    identifier: string,
    secret: string

}

export interface AccessTokenCredential {
    credentialType: "ACCESSTOKEN",
    accessToken: string,
    accessTokenType?: string,
    accessTokenExpiresUtc: Date | string
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
        @param maxNumOfReports (string): Number of notifications until the subscription is available.
        @param startsAt (optional): It represents when this subscription started.
        @param expiresAt (optional): It represents when this subscription should expire.
    #### Public Methods:
        @method delete(): Deletes device connectivity status subscription.
 */
export class Subscription {
    private api: APIClient;
    eventSubscriptionId: string;
    device: Device;
    eventType: string[];
    sink: string;
    sinkCredential?: PlainCredential | AccessTokenCredential;
    subscriptionMaxEvents?: number;
    startsAt?: Date;
    expiresAt?: Date;

    constructor(
        api: APIClient,
        eventSubscriptionId: string,
        device: Device,
        eventType: string[],
        sink: string,
        sinkCredential?: PlainCredential | AccessTokenCredential,
        subscriptionMaxEvents?: number,
        startsAt?: Date,
        expiresAt?: Date
    ) {
        this.api = api;
        this.eventSubscriptionId = eventSubscriptionId;
        this.device = device;
        this.eventType = eventType;
        this.sink = sink;
        this.sinkCredential = sinkCredential;
        this.startsAt = startsAt;
        this.expiresAt = expiresAt;
        this.subscriptionMaxEvents = subscriptionMaxEvents;
    }

    /**
     *  Delete device connectivity status
     */
    async delete() {
        let url: string = "/device-reachability-status-subscriptions/v0.7"
        if (this.eventType.includes("roaming")){
            url = "/device-roaming-status-subscriptions/v0.7"
        }
        this.api.deviceStatus.delete(this.eventSubscriptionId, url);
    }

    /*
    async deleteRoaming() {
        const url: string = "/device-roaming-status-subscriptions/v0.7";
        this.api.deviceStatus.delete(this.eventSubscriptionId, url);
    }

    async deleteReachability() {
        const url: string = "/device-reachability-status-subscriptions/v0.7";
        this.api.deviceStatus.delete(this.eventSubscriptionId, url);
    }
        */
}