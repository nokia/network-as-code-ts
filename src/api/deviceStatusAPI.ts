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

import { ProxyAgent } from "proxy-agent";
import fetch from 'node-fetch';

import { errorHandler } from "../errors";
import { Device } from "../models/device";
import { Subscription } from "../models/deviceStatus";
import { SubscribeOptionalArgs } from "../namespaces/deviceStatus";

export class DeviceStatusAPI {
    private baseUrl: string;
    private headers: HeadersInit;
    private agent: ProxyAgent;

    constructor(baseUrl: string, rapidKey: string, rapidHost: string, agent: ProxyAgent) {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey,
        };
        this.agent = agent;
    }

    async subscribe(
        device: Device,
        eventType: string,
        notificationUrl: string,
        optionalArgs?: SubscribeOptionalArgs
    ): Promise<any> {
        const body: any = {
            subscriptionDetail: {
                device: device.toJson(),
                "type": eventType,
            },
            webhook: {
                notificationUrl: notificationUrl,
            },
        };

        if (optionalArgs) {
            if (optionalArgs.maxNumberOfReports) {
                body.maxNumberOfReports = optionalArgs.maxNumberOfReports;
            }

            if (optionalArgs.subscriptionExpireTime) {
                body.subscriptionExpireTime =
                    optionalArgs.subscriptionExpireTime;
            }

            if (optionalArgs.notificationAuthToken) {
                body.webhook.notificationAuthToken =
                    optionalArgs.notificationAuthToken;
            }
        }

        const response = await fetch(`${this.baseUrl}/subscriptions`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
            agent: this.agent
        });

        errorHandler(response);

        return response.json() as Promise<any>;
    }

    async delete(eventSubscriptionId: string) {
        const response = await fetch(
            `${this.baseUrl}/subscriptions/${eventSubscriptionId}`,
            {
                method: "DELETE",
                headers: this.headers,
                agent: this.agent
            }
        );

        errorHandler(response);
    }

    async get(eventSubscriptionId: string) {
        const response = await fetch(
            `${this.baseUrl}/subscriptions/${eventSubscriptionId}`,
            {
                method: "GET",
                headers: this.headers,
                agent: this.agent
            }
        );

        errorHandler(response);

        return response.json() as Promise<any>;
    }

    async getSubscriptions() {
        const response = await fetch(
            `${this.baseUrl}/subscriptions`,
            {
                method: "GET",
                headers: this.headers,
                agent: this.agent
            }
        );

        errorHandler(response);

        return response.json() as Promise<any>;
    }
}
