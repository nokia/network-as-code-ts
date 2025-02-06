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


export interface PlainCredential {
    identifier: string,
    secret: string
}

export interface AccessTokenCredential {
    accessToken: string,
    accessTokenType?: string,
    accessTokenExpiresUtc: Date | string
}

export interface GeofencingSubscriptionParams {
    sink: string,
    protocol?: string,
    types: string[],
    latitude: number,
    longitude: number,
    radius: number,
    sinkCredential?: PlainCredential | AccessTokenCredential,
    subscriptionExpireTime?: Date | string,
    subscriptionMaxEvents?: number,
    initialEvent?: boolean
}


export class GeofencingSubscription {
    private api: APIClient;
    eventSubscriptionId: string;
    types: string[];
    sink: string;
    latitude: number;
    longitude: number;
    radius: number;

    constructor(
        api: APIClient,
        eventSubscriptionId: string,
        types: string[],
        sink: string,
        latitude: number,
        longitude: number,
        radius: number,
    ) {
        this.api = api;
        this.eventSubscriptionId = eventSubscriptionId;
        this.types = types;
        this.sink = sink;
        this.latitude = latitude;
        this.longitude = longitude;
        this.radius = radius;
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
            jsonData.config.subscriptionDetail.area.center.latitude,
            jsonData.config.subscriptionDetail.area.center.longitude,
            jsonData.config.subscriptionDetail.area.radius,
        );
    }
}
