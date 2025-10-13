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


export interface Delete {
    delete(): any;
}


/**
 *  A class representing the `DeviceStatusSubscription` model.
 * #### Private Attributes:
        @param api(APIClient): An API client object.
    #### Public Attributes:
        @param eventSubscriptionId (string): IIt represents the subscription identifier.
        @param device (Device): Identifier of the device
        @param sink (string): The URL where events shall be delivered.
        @param eventType (string[]): The status type(s) you want to check, which can be reachability or roaming.
        @param subscriptionExpireTime (string): Date when the subscription will expire.
        @param subscriptionMaxEvents (string): The maximum amount of event reports that can be created.
        @param startsAt (optional): It represents when this subscription started.
        @param expiresAt (optional): It represents when this subscription should expire.
    #### Public Methods:
        @method deleteRoaming(): Deletes device roaming status subscription.
        @method deleteReachability(): Deletes device reachability status subscription.
 */
export class DeviceStatusSubscription {
    private _api: APIClient;
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
        _api: APIClient,
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
        this._api = _api;
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

    async delete() {
        if (this.eventType[0].includes("roaming")){
            let deleteSub = new DeleteRoaming()
            deleteSub.delete(this._api, this.eventSubscriptionId)
        }
        else {
            let deleteSub = new DeleteReachability()
            deleteSub.delete(this._api, this.eventSubscriptionId)
        }
    }
}


export interface Delete {
    delete(api: APIClient, id: string): any;
}

/**
 *  Delete device roaming status subscription
 */
class DeleteRoaming implements Delete {
    delete(api?: APIClient, id?: string): any {
        if (api && id) { 
        api.deviceRoamingStatus.delete(id)
        }
    };
}

/**
 *  Delete device reachability status subscription
 */
class DeleteReachability implements Delete {
    delete(api?: APIClient, id?: string): any {
        if (api && id) { 
            api.deviceReachabilityStatus.delete(id)
        }
    };
}









// TESTING 2:


export interface DeviceStatusSubscription2 {
    _api: APIClient;
    eventSubscriptionId: string;
    device: Device;
    sink: string;
    eventType: string[];
    subscriptionExpireTime?: string;
    subscriptionMaxEvents?: number;
    startsAt?: Date;
    expiresAt?: Date;
    status?: string;
    delete(): void;
}



class DeleteRoaming2 implements DeviceStatusSubscription2 {
    delete(api?: APIClient, id?: string): any {
        if (api && id) { 
        api.deviceRoamingStatus.delete(id)
        }
    };
}

/**
 *  Delete device reachability status subscription
 */
class DeleteReachability2 implements Delete {
    delete(api?: APIClient, id?: string): any {
        if (api && id) { 
            api.deviceReachabilityStatus.delete(id)
        }
    };
}


