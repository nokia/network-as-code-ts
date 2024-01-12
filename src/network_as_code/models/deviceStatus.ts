import { APIClient } from "../api";
import { Device } from "./device";

export class Subscription {
    private api: APIClient
    eventSubscriptionId: string
    device: Device
    eventType: string
    notificationUrl: string
    startsAt: string
    expiresAt?: string

    constructor(api: APIClient, eventSubscriptionId: string, device: Device, eventType: string, notificationUrl: string, startsAt: string, expiresAt?: string) {
        this.api = api;
        this.eventSubscriptionId = eventSubscriptionId;
        this.device = device;
        this.eventType = eventType;
        this.notificationUrl = notificationUrl;
        this.startsAt = startsAt;
        this.expiresAt = expiresAt;
    }

    async delete() {
        this.api.deviceStatus.delete(this.eventSubscriptionId);
    }
}
