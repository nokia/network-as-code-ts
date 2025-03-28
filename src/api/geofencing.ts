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

import { ProxyAgent } from "proxy-agent";
import fetch from "node-fetch";

import { errorHandler } from "../errors";
import { Device } from "../models/device";
import { GeofencingSubscriptionParams } from "../models/geofencing";

export class GeofencingAPI {
    private baseUrl: string;
    private headers: HeadersInit;
    private agent: ProxyAgent;

    constructor(
        baseUrl: string,
        rapidKey: string,
        rapidHost: string,
        agent: ProxyAgent
    ) {
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
        params: GeofencingSubscriptionParams
    ): Promise<any> {
        const body: any = {
            protocol: "HTTP",
            sink: params.sink,
            types: params.types,
            config: {
                subscriptionDetail: {
                    device: device.toJson(),
                    area: {
                        areaType: "CIRCLE",
                        center: {
                            latitude: params.latitude,
                            longitude: params.longitude
                        },
                        radius: params.radius
                    }
                }
            }
        };

        if (params.sinkCredential) {
            body.sinkCredential = params.sinkCredential ? Object.fromEntries(Object.entries(params.sinkCredential as {[key:string]: any}).filter(([, value]) => value !== null && value !== undefined)) : undefined;
        }

        if (params.subscriptionExpireTime) {
            body.config.subscriptionExpireTime = params.subscriptionExpireTime;
        }

        if (params.subscriptionMaxEvents) {
            body.config.subscriptionMaxEvents = params.subscriptionMaxEvents;
        }

        if (params.initialEvent) {
            body.config.initialEvent = params.initialEvent;
        }

        const response = await fetch(`${this.baseUrl}/subscriptions`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
            agent: this.agent,
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
                agent: this.agent,
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
                agent: this.agent,
            }
        );

        errorHandler(response);

        return response.json() as Promise<any>;
    }

    async getSubscriptions() {
        const response = await fetch(`${this.baseUrl}/subscriptions`, {
            method: "GET",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(response);

        return response.json() as Promise<any>;
    }
}
