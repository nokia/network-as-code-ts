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
import { errorHandler } from "../errors";
import { PortSpec } from "../models/session";
import { AccessTokenCredential } from "../models/authorization";
import { ProxyAgent } from "proxy-agent";
import fetch from "node-fetch";

/**
 *  Qod API, that sends requests to the API via httpx calls
 */
export class QodAPI {
    /**
 *  Methods takes rapidHost, rapidKey, and baseUrl.
 * Args:
            rapidHost (str): RapidAPI Host
            rapidKey (str): RapidAPI Key
            baseUrl (str): URL for
    */
    private headers: HeadersInit;
    private baseUrl: string;
    private agent: ProxyAgent;

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

    /**
 *  Function that hits the create session endpoint with the data
 * 
 * #### Args:
 *          profile (string): Name of the requested QoS profile.
            duration (optional): Session duration in seconds.
            device (Device): Device object for the session.        
            serviceIpv4 (string): IPv4 address of the service.
            serviceIpv6 (optional): IPv6 address of the service.
            devicePorts (optional): List of the device ports.
            servicePorts (optional): List of the application server ports.
            sink (optional): URL for session-related events.
            sinkCredential (optional): Authorization information to protect the notification endpoint. 

        Returns:
            Promise<Session>: response of the endpoint, ideally a Session
 */
    async createSession(
        profile: string,
        duration: number,
        device: Device,
        serviceIpv6?: string,
        serviceIpv4?: string,
        devicePorts?: PortSpec,
        servicePorts?: PortSpec,
        sink?: string,
        sinkCredential?: AccessTokenCredential
    ) {
        const sessionPayload: any = {
            qosProfile: profile,
            device: device,
            applicationServer: { ipv4Address: serviceIpv4 },
            devicePorts: devicePorts ? devicePorts : undefined,
            applicationServerPorts: servicePorts ? servicePorts : undefined,
            duration: duration,
        };

        if (serviceIpv6) {
            sessionPayload["applicationServer"]["ipv6Address"] = serviceIpv6;
        }

        if (sink) {
            sessionPayload["sink"] = sink ;
            if (sinkCredential) {
                sessionPayload["sinkCredential"] = sinkCredential;
            }
        }

        const response = await fetch(this.baseUrl + "/sessions", {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(sessionPayload),
            agent: this.agent,
        });

        errorHandler(response);

        return response.json() as Promise<any>;
    }

    /**
 *  This function retrieves all sessions given a device_id
 * Args:
           @param device (Device): The device whose sessions to retrieve
           @returns Promise<any>
 */
    async getAllSessions(device: Device) {
        const response = await fetch(this.baseUrl + "/retrieve-sessions", {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                device,
            }),
            agent: this.agent,
        });

        errorHandler(response);

        return await response.json();
    }

    /**
 *  Returns a session given session ID
 * Args:
            sessionId (str): A string session ID

        Returns:
            Session: the session object
 */
    async getSession(sessionId: string) {
        const url = `/sessions/${sessionId}`;
        const response = await fetch(this.baseUrl + url, {
            method: "GET",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(response);

        return response.json() as Promise<any>;
    }

    /**
 *  Deletes a session given session ID
 * Args:
            sessionId (string): session ID
 */
    async deleteSession(sessionId: string) {
        const url = `/sessions/${sessionId}`;
        const response = await fetch(this.baseUrl + url, {
            method: "DELETE",
            headers: this.headers,
            agent: this.agent,
        });

        errorHandler(response);

        return response;
    }

    /**
         *  Extends session's duration
         * Args:
                    id (string): session ID
                    additionalDuration (number): Additional session duration in seconds.
        */
    async extendSession(sessionId: string, additionalDuration: number) {
        const url = `/sessions/${sessionId}/extend`;
        const response = await fetch(this.baseUrl + url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                requestedAdditionalDuration: additionalDuration,
            }),
            agent: this.agent,
        });

        errorHandler(response);

        return response;
    }
}
