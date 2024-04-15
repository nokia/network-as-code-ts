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
import fetch from "node-fetch";

import { errorHandler } from "../errors";
import { Device, DeviceIpv4Addr } from "../models/device";

export class CongestionInsightsAPI {
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
        subscriptionExpireTime: Date | string,
        notificationUrl: string,
        notificationAuthToken: string
    ): Promise<any> {
        const body: any = {
            device: {
                phoneNumber: device.phoneNumber,
                networkAccessIdentifier: device.networkAccessIdentifier,
                ipv4Address: {
                    publicAddress: (device.ipv4Address as DeviceIpv4Addr)
                        .publicAddress,
                    privateAddress: (device.ipv4Address as DeviceIpv4Addr)
                        .privateAddress,
                    publicPort: (device.ipv4Address as DeviceIpv4Addr)
                        .publicPort,
                },
                ipv6Address: device.ipv6Address,
            },
            webhook: {
                notificationUrl: notificationUrl,
                notificationAuthToken: notificationAuthToken,
            },
            subscriptionExpireTime,
        };

        const response = await fetch(`${this.baseUrl}/subscriptions`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
            agent: this.agent,
        });

        errorHandler(response);

        return response.json() as Promise<any>;
    }

    async delete(id: string) {
        const response = await fetch(`${this.baseUrl}/subscriptions/${id}`, {
            method: "DELETE",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(response);
    }

    async get(id: string) {
        const response = await fetch(`${this.baseUrl}/subscriptions/${id}`, {
            method: "GET",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(response);

        return response.json() as Promise<any>;
    }

    async getAll() {
        const response = await fetch(`${this.baseUrl}/subscriptions`, {
            method: "GET",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(response);

        return response.json() as Promise<any>;
    }

    async getCongestion(
        device: Device,
        start?: Date | string,
        end?: Date | string
    ) {
        
        const response = await fetch(`${this.baseUrl}/device`, {
            method: "POST",
            body: JSON.stringify({
                device: {
                    phoneNumber: device.phoneNumber,
                    networkAccessIdentifier: device.networkAccessIdentifier,
                    ipv4Address: device.ipv4Address,
                    ipv6Address: device.ipv6Address,
                },
                start,
                end,
            }),
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(response);

        return response.json() as Promise<any>;
    }
}
