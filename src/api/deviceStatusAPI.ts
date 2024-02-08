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
                eventType: eventType,
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

        const response = await fetch(`${this.baseUrl}/event-subscriptions`, {
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
            `${this.baseUrl}/event-subscriptions/${eventSubscriptionId}`,
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
            `${this.baseUrl}/event-subscriptions/${eventSubscriptionId}`,
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
