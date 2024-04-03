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

export class Subscription {
    private api: APIClient;
    eventSubscriptionId: string;
    device: Device;
    eventType: string;
    notificationUrl: string;
    startsAt: string;
    expiresAt?: string;

    constructor(
        api: APIClient,
        eventSubscriptionId: string,
        device: Device,
        eventType: string,
        notificationUrl: string,
        startsAt: string,
        expiresAt?: string
    ) {
        this.api = api;
        this.eventSubscriptionId = eventSubscriptionId;
        this.device = device;
        this.eventType = eventType;
        this.notificationUrl = notificationUrl;
        this.startsAt = startsAt;
        this.expiresAt = expiresAt;
    }

    /**
     *  Delete device connectivity status
     */
    async delete() {
        this.api.deviceStatus.delete(this.eventSubscriptionId);
    }
}
