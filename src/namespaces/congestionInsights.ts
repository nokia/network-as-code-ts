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

/**
 *  Gain insights from network analytics.
 *
 */
export class CongestionInsights extends Namespace {
    /**
     *  Create subscription for congestion insights.
     * 
            @param device (Device): Identifier of the device.
            @param subscriptionExpireTime (Date|string): Subscription expire time
            @param notificationUrl (string): Notification URL for congestion insights.
            @param notificationAuthToken (string): Notification Auth Token 
            @returns Promise Subscription
    */

    async subscribeToCongestionInfo(
        device: Device,
        subscriptionExpireTime: Date | string,
        notificationUrl: string,
        notificationAuthToken?: string
    ): Promise<CongestionInsightsSubscription> {
        const res = await this.api.insights.subscribe(
            device,
            subscriptionExpireTime instanceof Date
                ? subscriptionExpireTime.toISOString()
                : subscriptionExpireTime,
            notificationUrl,
            notificationAuthToken
        );

        return new CongestionInsightsSubscription(
            this.api,
            res.subscriptionId,
            res.startsAt ? new Date(res.startsAt) : undefined,
            res.expiresAt ? new Date(res.expiresAt) : undefined
        );
    }

    /**
     *  Get a subscription by its ID.
     * 
            @param subscriptionId (string): Resource ID
            @returns Promise CongestionInsightsSubscription
    */
    async get(subscriptionId: string): Promise<CongestionInsightsSubscription> {
        const res = await this.api.insights.get(subscriptionId);

        return new CongestionInsightsSubscription(
            this.api,
            res.subscriptionId,
            res.startsAt ? new Date(res.startsAt) : undefined,
            res.expiresAt ? new Date(res.expiresAt) : undefined
        );
    }

    /**
     *  Get all active subscriptions of Congestion Insights
     *
     * @returns Promise CongestionInsightsSubscription[]
     */
    async getSubscriptions(): Promise<CongestionInsightsSubscription[]> {
        const res = await this.api.insights.getAll();

        return res.map((subscription: any) => {
            return new CongestionInsightsSubscription(
                this.api,
                subscription.subscriptionId,
                subscription.startsAt,
                subscription.expiresAt
            );
        });
    }
}
