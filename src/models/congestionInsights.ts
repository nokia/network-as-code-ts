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

/**
 *  An interface representing the `Congestion` model.
 * @param level (string): Congestion level experienced by the device ranging from "None", "Low", "Medium" and "High".
 * @param start (Date): Start timestamp for retrieving congestion data.
 * @param stop (Date): End timestamp for retrieving congestion data.
 * @param confidence (number): Level of confidence when dealing with a congestion level prediction, ranging from 0 to 100.
 *
 */
export interface Congestion {
    level: string;
    start: Date;
    stop: Date;
    confidence: number;
}

/**
 *  A class representing the `CongestionSubscription` model.
 * #### Private Attributes:
        @param api(APIClient): An API client object.
    #### Public Attributes:
        @param subscriptionId(string): It represents the subscription identifier.
        @param starts_at(Date): It represents when this subscription started.
        @param expires_at (Date): It represents when this subscription should expire.

    #### Public Methods:
        @method delete(): Delete congestion insights subscription
 */

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
