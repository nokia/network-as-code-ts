import { errorHandler } from "../errors";
import { Device } from "../models/device";
import { Subscription } from "../models/deviceStatus";
import { SubscribeOptionalArgs } from "../namespaces/deviceStatus";

export class DeviceStatusAPI {
    private baseUrl: string;
    private headers: HeadersInit;

    constructor(base_url: string, rapid_key: string, rapid_host: string) {
        this.baseUrl = base_url;
        this.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": rapid_host,
            "X-RapidAPI-Key": rapid_key,
        };
    }

    async subscribe(
        device: Device,
        eventType: string,
        notificationUrl: string,
        optionalArgs?: SubscribeOptionalArgs
    ): Promise<Subscription> {
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
        });

        errorHandler(response);

        return response.json();
    }

    async delete(eventSubscriptionId: string) {
        const response = await fetch(
            `${this.baseUrl}/event-subscriptions/${eventSubscriptionId}`,
            {
                method: "DELETE",
                headers: this.headers,
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
            }
        );

        errorHandler(response);

        return response.json();
    }
}
