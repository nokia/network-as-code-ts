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

import { APIClient } from "../api/client";
import { NotFoundError } from "../errors";
import { Device } from "./device";
import { QoDSession } from "./session";

/**
 * An interface representing the `NetworkIdentifier` model.
 * #### Public Attributes:
            @param mnc (string): the `mnc` of a network identifier object.
            @param mcc (Optional[string]): the `mcc` of a network identifier object.
 */
export interface NetworkIdentifier {
    mnc: string;
    mcc: string;
}

/**
 *  An interface representing the `SliceInfo` model.
 * #### Public Attributes:
            @param service_type (string): the service type of a slice object, Example: `eMBB`
            @param differentiator (Optional[string]): the differentiator of a slice object.
 */
export interface SliceInfo {
    serviceType: string;
    differentiator?: string;
}

/**
 *  An interface representing the `Throughput` model.
 * #### Public Attributes:
           @param guaranteed (number): the guaranteed throughput amount in integer
           @param maximum (number): the maximum throughput amount in integer
 */
interface Throughput {
    guaranteed?: number;
    maximum?: number;
}

/**
 *  An interface representing the `Point` model.
 * #### Public Attributes:
           @param longitude (number): the `longitude` of a point object.
           @param latitude (number): the `latitude` of a point object.
 */
export interface Point {
    longitude?: number;
    latitude?: number;
}

/**
 *  An interface representing the `AreaOfService` model.
 * #### Public Attributes:
           @param polygon (Point[]): the `polygon` value of an area of service object.
 */
export interface AreaOfService {
    polygon: Point[];
}

export interface SliceOptionalArgs {
    sid?: string;
    name?: string;
    areaOfService?: AreaOfService;
    maxDataConnections?: number;
    maxDevices?: number;
    notificationAuthToken?: string;
    sliceDownlinkThroughput?: Throughput;
    sliceUplinkThroughput?: Throughput;
    deviceDownlinkThroughput?: Throughput;
    deviceUplinkThroughput?: Throughput;
}

export interface SliceModifyOptionalArgs {
    sliceDownlinkThroughput?: Throughput;
    sliceUplinkThroughput?: Throughput;
    deviceDownlinkThroughput?: Throughput;
    deviceUplinkThroughput?: Throughput;
    maxDataConnections?: number;
    maxDevices?: number;
}

export interface Apps {
    os: string;
    apps: string[];
}

export interface TrafficCategories {
    apps: Apps;
}

export interface DeviceAttachment {
    devicePhoneNumber: string;
    attachmentId: string;
}

function fetchAndRemove(
    sliceAttachments: DeviceAttachment[],
    device: Device
): string | null {
    for (let i = 0; i < sliceAttachments.length; i++) {
        const attachment = sliceAttachments[i];
        if (attachment.devicePhoneNumber === device.phoneNumber) {
            const attachmentId = attachment.attachmentId;
            sliceAttachments.splice(i, 1);
            return attachmentId;
        }
    }
    return null;
}

/**
 *  A class representing the `Slice` model.
 * #### Private Attributes:
       @param _api(APIClient): An API client object.
       @param _sessions(List[Session]): List of device session instances.
       @param _attachments(DeviceAttachment[]): List of device attachments

    #### Public Attributes:
       @param sid (optional): String ID of the slice
       @param state (str): State of the slice (ie. NOT_SUBMITTED)
       @param name (optional): Optional short name for the slice. Must be ASCII characters, digits and dash. Like name of an event, such as "Concert-2029-Big-Arena".
       @param networkIdentifier (NetworkIdentifier): Name of the network
       @param sliceInfo (SliceInfo): Purpose of this slice
       @param areaOfService (AreaOfService): Location of the slice
       @param maxDataConnections (optional): Optional maximum number of data connection sessions in the slice.
       @param maxDevices (optional): Optional maximum number of devices using the slice.
       @param sliceDownlinkThroughput (optional): Optional throughput object
       @param sliceUplinkThroughput (optional): Optional throughput object
       @param deviceDownlinkThroughput (optional): Optional throughput object
       @param deviceUplinkThroughput: (optional): Optional throughput object


    #### Public Methods:
        activate (None): Activate a network slice.
        attach (): Attach a network slice to a device.
        deactivate (None): Deactivate a network slice. The slice state must be active to be able to perform this operation.
        delete (None): Delete network slice. The slice state must not be active to perform this operation.
        refresh (None): Refresh the state of the network slice.

    #### Callback Functions:
        on_creation ():
        on_event ():
 */
export class Slice {
    private _api: APIClient;
    private _sessions: QoDSession[];
    private _attachments: DeviceAttachment[];
    state: string;
    sliceInfo: SliceInfo;
    networkIdentifier: NetworkIdentifier;
    sid?: string;
    name?: string;
    areaOfService?: AreaOfService;
    maxDataConnections?: number;
    maxDevices?: number;
    sliceDownlinkThroughput?: Throughput;
    sliceUplinkThroughput?: Throughput;
    deviceDownlinkThroughput?: Throughput;
    deviceUplinkThroughput?: Throughput;
    notificationUrl: string;
    notificationAuthToken?: string;

    constructor(
        api: APIClient,
        state: string,
        sliceInfo: SliceInfo,
        networkIdentifier: NetworkIdentifier,
        notificationUrl: string,
        sliceOptionalArgs?: SliceOptionalArgs
    ) {
        this._api = api;
        this._sessions = [];
        this._attachments = [];
        this.state = state;
        this.sliceInfo = sliceInfo;
        this.networkIdentifier = networkIdentifier;
        this.notificationUrl = notificationUrl;
        if (sliceOptionalArgs) {
            const {
                sid,
                name,
                areaOfService,
                maxDataConnections,
                maxDevices,
                sliceDownlinkThroughput,
                sliceUplinkThroughput,
                deviceDownlinkThroughput,
                deviceUplinkThroughput,
            } = sliceOptionalArgs;
            this.sid = sid;
            this.name = name;
            this.areaOfService = areaOfService;
            this.maxDataConnections = maxDataConnections;
            this.maxDevices = maxDevices;
            this.sliceDownlinkThroughput = sliceDownlinkThroughput;
            this.sliceUplinkThroughput = sliceUplinkThroughput;
            this.deviceDownlinkThroughput = deviceDownlinkThroughput;
            this.deviceUplinkThroughput = deviceUplinkThroughput;
        }
    }

    /**
 *  Activate network slice.
 * #### Args:
            None

    #### Example:
    slice.activate()
 */
    async activate() {
        if (this.name) {
            return await this._api.slicing.activate(this.name);
        }
    }

    /**
 *  Deactivate network slice.
 * #### Args:
            None

    #### Example:
    slice.deactivate()
 */
    async deactivate() {
        if (this.name) {
            return await this._api.slicing.deactivate(this.name);
        }
    }

    async modify({
        sliceDownlinkThroughput,
        sliceUplinkThroughput,
        deviceDownlinkThroughput,
        deviceUplinkThroughput,
        maxDataConnections,
        maxDevices,
    }: SliceModifyOptionalArgs) {
        await this._api.slicing.create(
            this.networkIdentifier,
            this.sliceInfo,
            this.notificationUrl,
            {
                notificationAuthToken: this.notificationAuthToken,
                name: this.name,
                areaOfService: this.areaOfService,
                sliceDownlinkThroughput: sliceDownlinkThroughput,
                sliceUplinkThroughput: sliceUplinkThroughput,
                deviceDownlinkThroughput: deviceDownlinkThroughput,
                deviceUplinkThroughput: deviceUplinkThroughput,
                maxDataConnections: maxDataConnections,
                maxDevices: maxDevices,
            },
            true
        );

        // Update model (if no exception on modify)
        this.sliceDownlinkThroughput = sliceDownlinkThroughput;
        this.sliceUplinkThroughput = sliceUplinkThroughput;
        this.deviceDownlinkThroughput = deviceDownlinkThroughput;
        this.deviceUplinkThroughput = deviceUplinkThroughput;
        this.maxDataConnections = maxDataConnections;
        this.maxDevices = maxDevices;
    }

    /**
 *  Delete network slice.
 * #### Args:
            None

    #### Example:
    slice.delete()
 */
    async delete() {
        if (this.name) {
            return await this._api.slicing.delete(this.name);
        }
    }

    /**
 *  Refresh state of the network slice.
 * #### Args:
            None

    #### Example:
    slice.refresh()
 */
    async refresh() {
        const sliceData: any = await this._api.slicing.get(this.name as string);
        this.state = sliceData["state"];
    }

    setAttachments(attachments: any): any {
        if (attachments.length > 0) {
            this._attachments = [];
            attachments.forEach((attachment: any) => {
                this._attachments.push({
                    devicePhoneNumber: attachment.resource.device.phoneNumber,
                    attachmentId: attachment.nac_resource_id,
                });
            });
        }
    }

    /**
 *  Attach network slice.
 * #### Args:
            device (Device): Device object that the slice is being attached to

    #### Example:
            device = client.devices.get("testuser@open5glab.net", {public_address="1.1.1.2", private_address="1.1.1.2", public_port=80})
            slice.attach(device)
 */
    async attach(
        device: Device,
        notificationAuthToken: string,
        notificationUrl?: string,
        trafficCategories?: TrafficCategories
    ) {
        const newAttachment: any = await this._api.sliceAttach.attach(
            device,
            this.name as string,
            notificationAuthToken,
            notificationUrl,
            trafficCategories
        );

        this._attachments.push({
            attachmentId: newAttachment.nac_resource_id,
            devicePhoneNumber: device.phoneNumber as string,
        });

        return newAttachment;
    }

    /**
 *  Detach network slice.
 * #### Args:
            device (Device): Device object that the slice is being attached to

    #### Example:
            device = client.devices.get("testuser@open5glab.net", {public_address="1.1.1.2", private_address="1.1.1.2", public_port=80})
            slice.attach(device)
            slice.detach(device)
 */
    async detach(device: Device) {
        const attachmentId = fetchAndRemove(this._attachments, device);
        if (attachmentId) {
            this._api.sliceAttach.detach(attachmentId);
        } else {
            throw new NotFoundError("Attachment not found");
        }
    }
}
