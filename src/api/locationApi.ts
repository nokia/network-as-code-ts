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
import { Location } from "../models/location";
import { errorHandler } from "../errors";
import { ProxyAgent } from "proxy-agent";

import fetch from "node-fetch";

class LocationVerifyAPI {
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

    async verifyLocation(
        latitude: number,
        longitude: number,
        device: Device,
        radius: number,
        maxAge = 60
    ): Promise<boolean | string> {
        const body: any = {
            device: device.toJson(),
            area: {
                areaType: "CIRCLE",
                center: { latitude: latitude, longitude: longitude },
                radius: radius,
            },
            maxAge,
        };

        const response = await fetch(`${this.baseUrl}/verify`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
            agent: this.agent,
        });

        errorHandler(response);

        const data: any = await response.json();
        return data.verificationResult === "TRUE"
            ? true
            : data.verificationResult === "FALSE"
            ? false
            : data.verificationResult;
    }
}

class LocationRetrievalAPI {
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

    async getLocation(device: Device, maxAge = 60): Promise<Location> {
        const body: any = { device: device.toJson(), maxAge };

        const response = await fetch(`${this.baseUrl}/retrieve`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
            agent: this.agent,
        });

        errorHandler(response);

        const jsonData: any = await response.json();

        return {
            latitude: jsonData.area.center.latitude,
            longitude: jsonData.area.center.longitude,
            civicAddress: jsonData.civicAddress,
        };
    }
}

export { LocationRetrievalAPI, LocationVerifyAPI };
