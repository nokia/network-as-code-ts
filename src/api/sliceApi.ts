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

import {
    AreaOfService,
    NetworkIdentifier,
    Point,
    SliceInfo,
    SliceOptionalArgs,
    TrafficCategories,
} from "../models/slice";
import { errorHandler } from "../errors";
import { Device, DeviceIpv4Addr } from "../models/device";
import { ProxyAgent } from "proxy-agent";

import fetch, { Response as FetchResponse } from "node-fetch";

export class SliceAPI {
    private baseUrl: string;
    private headers: HeadersInit;
    private agent: ProxyAgent;

    /**
 *  Methods takes rapidHost, rapidKey, and baseUrl.
 * Args:
            rapidHost (str): RapidAPI Host
            rapidKey (str): RapidAPI Key
            baseUrl (str): URL for
    */

    constructor(
        baseURL: string,
        rapidKey: string,
        rapidHost: string,
        agent: ProxyAgent
    ) {
        this.baseUrl = baseURL;
        this.headers = {
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey,
            "content-type": "application/json",
        };
        this.agent = agent;
    }

    async create(
        networkId: NetworkIdentifier,
        sliceInfo: SliceInfo,
        notificationUrl: string,
        optionalArgs?: SliceOptionalArgs,
        modify = false
    ) {
        const body: any = {
            networkIdentifier: networkId,
            sliceInfo: sliceInfo,
            notificationUrl: notificationUrl,
        };

        if (optionalArgs) {
            if (optionalArgs.sid) {
                body.sid = optionalArgs.sid;
            }

            if (optionalArgs.name) {
                body.name = optionalArgs.name;
            }

            if (optionalArgs.areaOfService) {
                body.areaOfService = this.convertAreaOfServiceObj(
                    optionalArgs.areaOfService
                );
            }

            if (optionalArgs.maxDataConnections) {
                body.maxDataConnections = optionalArgs.maxDataConnections;
            }

            if (optionalArgs.maxDevices) {
                body.maxDevices = optionalArgs.maxDevices;
            }

            if (optionalArgs.sliceDownlinkThroughput) {
                body.sliceDownlinkThroughput =
                    optionalArgs.sliceDownlinkThroughput;
            }

            if (optionalArgs.sliceUplinkThroughput) {
                body.sliceUplinkThroughput = optionalArgs.sliceUplinkThroughput;
            }

            if (optionalArgs.deviceDownlinkThroughput) {
                body.deviceDownlinkThroughput =
                    optionalArgs.deviceDownlinkThroughput;
            }

            if (optionalArgs.deviceUplinkThroughput) {
                body.deviceUplinkThroughput =
                    optionalArgs.deviceUplinkThroughput;
            }
        }
        let response: FetchResponse;

        if (modify) {
            if (!optionalArgs?.name) {
                throw new Error("Name is mandatory for modify");
            }

            response = await fetch(
                `${this.baseUrl}/slices/${optionalArgs.name}`,
                {
                    method: "PUT",
                    headers: this.headers,
                    body: JSON.stringify(body),
                    agent: this.agent,
                }
            );

            errorHandler(response);

            return await response.json();
        } else {
            response = await fetch(`${this.baseUrl}/slices`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(body),
                agent: this.agent,
            });

            errorHandler(response);

            return await response.json();
        }
    }

    async getAll() {
        const response = await fetch(`${this.baseUrl}/slices`, {
            method: "GET",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(response);

        return response.json();
    }

    async get(sliceId: string) {
        const response = await fetch(`${this.baseUrl}/slices/${sliceId}`, {
            method: "GET",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(response);

        return response.json();
    }

    async activate(sliceId: string) {
        const response = await fetch(
            `${this.baseUrl}/slices/${sliceId}/activate`,
            {
                method: "POST",
                headers: this.headers,
                agent: this.agent,
            }
        );

        errorHandler(response);

        return response;
    }

    async deactivate(sliceId: string) {
        const response = await fetch(
            `${this.baseUrl}/slices/${sliceId}/deactivate`,
            {
                method: "POST",
                headers: this.headers,
                agent: this.agent,
            }
        );

        errorHandler(response);

        return response;
    }

    async delete(sliceId: string) {
        const response = await fetch(`${this.baseUrl}/slices/${sliceId}`, {
            method: "DELETE",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(response);

        return response;
    }

    convertAreaOfServiceObj(areaOfService: AreaOfService) {
        let polygon: Array<{ lat?: number; lon?: number }> = [];
        areaOfService.polygon.forEach((point: Point) => {
            polygon.push({ lat: point.latitude, lon: point.longitude });
        });
        return { polygon };
    }
}

export class AttachAPI {
    private baseUrl: string;
    private headers: HeadersInit;
    private agent: ProxyAgent;

    /**
 *  The class takes rapidHost, rapidKey, and baseUrl.
 * Args:
            rapidHost (str): RapidAPI Host
            rapidKey (str): RapidAPI Key
            baseUrl (str): URL for
    */

    constructor(
        baseURL: string,
        rapidKey: string,
        rapidHost: string,
        agent: ProxyAgent
    ) {
        this.baseUrl = baseURL;
        this.headers = {
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey,
            "content-type": "application/json",
        };
        this.agent = agent;
    }

    async attach(
        device: Device,
        sliceId: string,
        notificationAuthToken: string,
        notificationUrl?: string,
        trafficCategories?: TrafficCategories
    ) {
        let payload = {
            device: {
                phoneNumber: device.phoneNumber,
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
            sliceId,
            trafficCategories,
            webhook: {
                notificationUrl: notificationUrl,
                notificationAuthToken: notificationAuthToken,
            },
        };

        const res = await fetch(
            `https://device-application-attach.p-eu.rapidapi.com/attachments`,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(payload),
                agent: this.agent,
            }
        );

        errorHandler(res);
        return await res.json();
    }

    async detach(id: string) {
        const res = await fetch(`${this.baseUrl}/attachments/${id}`, {
            method: "DELETE",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(res);
    }

    async get(id: string) {
        const res = await fetch(`${this.baseUrl}/attachments/${id}`, {
            method: "GET",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(res);

        return await res.json();
    }

    async getAttachments() {
        const res = await fetch(`${this.baseUrl}/attachments`, {
            method: "GET",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(res);

        return await res.json();
    }
}
