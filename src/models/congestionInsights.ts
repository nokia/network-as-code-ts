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

export interface Congestion {
    level: string;
    start: Date;
    stop: Date;
    confidence: number;
}

export class CongestionInsightsSubscription {
    private api: APIClient;
    subscriptionId: string;
    startsAt?: Date;
    expiresAt?: Date;

    constructor(
        api: APIClient,
        subscriptionId: string,
        startsAt?: Date,
        expiresAt?: Date
    ) {
        this.api = api;
        this.subscriptionId = subscriptionId;
        this.startsAt = startsAt;
        this.expiresAt = expiresAt;
    }

    /**
     *  Delete congestion insights subscription
     */
    async delete() {
        this.api.insights.delete(this.subscriptionId);
    }
}
