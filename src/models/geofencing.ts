/**
 * Copyright 2025 Nokia
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


export enum EventType {
    AREA_ENTERED = "org.camaraproject.geofencing-subscriptions.v0.area-entered",
    AREA_LEFT = "org.camaraproject.geofencing-subscriptions.v0.area-left"
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

export interface GeofencingSubscriptionParams {
    sink: string,
    protocol?: string,
    types: EventType[] | string[],
    area: Circle | POI,
    sinkCredential?: PlainCredential | AccessTokenCredential,
    subscriptionExpireTime?: Date | string,
    subscriptionMaxEvents?: number,
    initialEvent?: boolean
}

export interface Center {
    latitude: number;
    longitude: number;
}

export interface Circle {
    areaType: string;
    center: Center;
    radius: number;
}

export interface POI {
    areaType: string;
    poiName: string;
}


export class GeofencingSubscription {
    private api: APIClient;
    eventSubscriptionId: string;
    types: string[];
    sink: string;
    startsAt: Date;
    area: Circle | POI;

    constructor(
        api: APIClient,
        eventSubscriptionId: string,
        types: string[],
        sink: string,
        startsAt: Date,
        area: Circle | POI
    ) {
        this.api = api;
        this.eventSubscriptionId = eventSubscriptionId;
        this.types = types;
        this.sink = sink;
        this.startsAt = startsAt;
        this.area = area;
    }

    /**
     *  Delete geofencing subscription
     */
    async delete() {
        await this.api.geofencing.delete(this.eventSubscriptionId);
    }

    static fromJson(api: APIClient, jsonData: any): GeofencingSubscription {
        return new GeofencingSubscription(
            api,
            jsonData.id,
            jsonData.types,
            jsonData.sink,
            jsonData.startsAt, 
            jsonData.config.subscriptionDetail.area
        );
    }
}