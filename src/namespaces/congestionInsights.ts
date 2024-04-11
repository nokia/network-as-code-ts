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

import { Device } from "../models/device";
import { CongestionInsightsSubscription } from "../models/congestionInsights";
import { Namespace } from "./namespace";

export class CongestionInsights extends Namespace {
    /**
     *  Create subscription for congestion insights.
     * 
            @param device (Device): Identifier of the device.
            @param subscriptionExpireTime (Date): Subscription expire time
            @param notificationUrl (string): Notification URL for congestion insights.
            @param notificationAuthToken (string): Notification Auth Token 
            @returns Promise Subscription
    */

    async subscribe_to_congestion_info(
        device: Device,
        subscriptionExpireTime: Date,
        notificationUrl: string,
        notificationAuthToken?: string
    ): Promise<CongestionInsightsSubscription> {
        
    }
}
