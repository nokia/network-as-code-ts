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

import { Device } from "../models/device";
import { GeofencingSubscription, GeofencingSubscriptionParams } from "../models/geofencing";
import { Namespace } from "./namespace";

export class Geofencing extends Namespace {
    async subscribe(device: Device, params: GeofencingSubscriptionParams): Promise<GeofencingSubscription> {
        const jsonData = await this.api.geofencing.subscribe(device, params);

        return GeofencingSubscription.fromJson(this.api, jsonData);
    }

    async get(subscriptionId: string): Promise<GeofencingSubscription> {
        const jsonData = await this.api.geofencing.get(subscriptionId);

        return GeofencingSubscription.fromJson(this.api, jsonData);
    }

    async getAll(): Promise<GeofencingSubscription[]> {
        const jsonData: any[] = await this.api.geofencing.getSubscriptions()

        return jsonData.map((jsonObject) => GeofencingSubscription.fromJson(this.api, jsonObject))
    }
}
