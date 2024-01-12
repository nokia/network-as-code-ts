
import { Device } from '../models/device';
import { Subscription } from '../models/deviceStatus';
import { Namespace } from './namespace';

export interface SubscribeOptionalArgs {
    subscriptionExpireTime?: string,
    maxNumberOfReports?: number,
    notificationAuthToken?: string
}

export class DeviceStatus extends Namespace {
    async subscribe(device: Device, eventType: string, notificationUrl: string, optionalArgs?: SubscribeOptionalArgs): Promise<Subscription> {
        const jsonData = await this.api.deviceStatus.subscribe(device, eventType, notificationUrl, optionalArgs);

        return new Subscription(this.api, jsonData.eventSubscriptionId, device, eventType, notificationUrl, jsonData.startsAt, jsonData.expiresAt)
    }

    async get(eventSubscriptionId: string): Promise<Subscription> {
        const jsonData = await this.api.deviceStatus.get(eventSubscriptionId);

        const deviceDetails = jsonData.subscriptionDetail.device;

        const device = new Device(this.api, deviceDetails.networkAccessIdentifier, deviceDetails.ipv4Address, deviceDetails.ipv6Address, deviceDetails.phoneNumber);

        return new Subscription(this.api, eventSubscriptionId, device, jsonData.subscriptionDetail.eventType, jsonData.webhook.notificationUrl, jsonData.startsAt, jsonData.expiresAt);
    }
}
