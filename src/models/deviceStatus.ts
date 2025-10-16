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
import { AccessTokenCredential, PlainCredential } from "./authorization";


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


/**
 *  A class representing the `DeviceStatusSubscription` model.
    #### Public Attributes:
        @param eventSubscriptionId (string): It represents the subscription identifier.
        @param device (Device): Identifier of the device
        @param sink (string): The URL where events shall be delivered.
        @param eventType (string[]): The status type(s) you want to check, which can be reachability or roaming.
        @param subscriptionExpireTime (string): Date when the subscription will expire.
        @param subscriptionMaxEvents (string): The maximum amount of event reports that can be created.
        @param startsAt (optional): It represents when this subscription started.
        @param expiresAt (optional): It represents when this subscription should expire.
    #### Public Methods:
        @method delete(): Deletes device roaming or reachability status subscription.
 */
export class DeviceStatusSubscription {
    eventSubscriptionId: string;
    device: Device;
    sink: string;
    eventType: string[];
    subscriptionExpireTime?: string;
    subscriptionMaxEvents?: number;
    startsAt?: Date;
    expiresAt?: Date;
    status?: string;

    constructor(
        eventSubscriptionId: string,
        device: Device,
        sink: string,
        eventType: string[],
        subscriptionExpireTime?: string,
        subscriptionMaxEvents?: number,
        startsAt?: Date,
        expiresAt?: Date,
        status?: string,
    ) {
        this.eventSubscriptionId = eventSubscriptionId;
        this.device = device;
        this.sink = sink;
        this.eventType = eventType;
        this.startsAt = startsAt;
        this.expiresAt = expiresAt;
        this.subscriptionExpireTime = subscriptionExpireTime;
        this.subscriptionMaxEvents = subscriptionMaxEvents;
        this.status = status;
    }
    async delete(){};
}


/**
 *  A class representing the `RoamingStatusSubscription` model.
 * #### Private Attributes:
        @param api(APIClient): An API client object.
    #### Public Attributes:
        @param eventSubscriptionId (string): It represents the subscription identifier.
        @param device (Device): Identifier of the device
        @param sink (string): The URL where events shall be delivered.
        @param eventType (string[]): The status type(s) you want to check.
        @param subscriptionExpireTime (string): Date when the subscription will expire.
        @param subscriptionMaxEvents (string): The maximum amount of event reports that can be created.
        @param startsAt (optional): It represents when this subscription started.
        @param expiresAt (optional): It represents when this subscription should expire.
    #### Public Methods:
        @method delete(): Deletes device roaming status subscription.
 */
export class RoamingStatusSubscription extends DeviceStatusSubscription{
    #api: APIClient;
    constructor(
        api: APIClient,
        eventSubscriptionId: string,
        device: Device,
        sink: string,
        eventType: string[],
        subscriptionExpireTime?: string,
        subscriptionMaxEvents?: number,
        startsAt?: Date,
        expiresAt?: Date,
        status?: string,
    ) {
        super(
        eventSubscriptionId,
        device,
        sink,
        eventType,
        subscriptionExpireTime,
        subscriptionMaxEvents,
        startsAt,
        expiresAt,
        status);
        this.#api = api;
    }


    /**
     *  Delete device roaming status subscription
     */
    async delete() {        
        this.#api.deviceRoamingStatus.delete(this.eventSubscriptionId);
    }
}


/**
 *  A class representing the `ReachabilityStatusSubscription` model.
 * #### Private Attributes:
        @param api(APIClient): An API client object.
    #### Public Attributes:
        @param eventSubscriptionId (string): It represents the subscription identifier.
        @param device (Device): Identifier of the device
        @param sink (string): The URL where events shall be delivered.
        @param eventType (string[]): The status type(s) you want to check.
        @param subscriptionExpireTime (string): Date when the subscription will expire.
        @param subscriptionMaxEvents (string): The maximum amount of event reports that can be created.
        @param startsAt (optional): It represents when this subscription started.
        @param expiresAt (optional): It represents when this subscription should expire.
    #### Public Methods:
        @method delete(): Deletes device reachability status subscription.
 */
export class ReachabilityStatusSubscription extends DeviceStatusSubscription{
    #api: APIClient;
    constructor(
        api: APIClient,
        eventSubscriptionId: string,
        device: Device,
        sink: string,
        eventType: string[],
        subscriptionExpireTime?: string,
        subscriptionMaxEvents?: number,
        startsAt?: Date,
        expiresAt?: Date,
        status?: string,
    ) {
        super(
        eventSubscriptionId,
        device,
        sink,
        eventType,
        subscriptionExpireTime,
        subscriptionMaxEvents,
        startsAt,
        expiresAt,
        status);
        this.#api = api;
    }

    /**
     *  Delete device reachability status subscription
     */
    async delete() {
        this.#api.deviceReachabilityStatus.delete(this.eventSubscriptionId);
    }
}

