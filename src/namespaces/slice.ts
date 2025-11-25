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
    NetworkIdentifier,
    Slice,
    SliceInfo,
    SliceOptionalArgs,
} from "../models/slice";
import { Namespace } from "./namespace";

/**
 *  Representation of a 5G network slice.
 * 
 * Through this class many of the parameters of a
    network slice can be configured and managed.
 */
export class Slices extends Namespace {
    /**
 *  Create a slice with its network identifier, slice info, area of service, and notification url.
 * 
    @param networkId (NetworkIdentifier): Name of the network
    @param sliceInfo (SliceInfo): Purpose of this slice
    @param notificationUrl (string): Destination URL of notifications
    @param optionalArgs (SliceOptionalArgs): optional arguments (sid, name, 
    areaOfService, maxDataConnections, maxDevices, notificationAuthToken, sliceDownlinkThroughput, ...)
    @returns Promise<Slice>
   @example ```TypeScript
            networkId = {mcc:"358ffYYT", mnc:"246fsTRE"}
            sliceInfo = {service_type:"eMBB", differentiator:"44eab5"}
            areaOfService = {poligon:[Point(lat=47.344, lon=104.349), Point(lat=35.344, lon=76.619), Point(lat=12.344, lon=142.541), Point(lat=19.43, lon=103.53)]}
            notificationUrl = "https://notify.me/here"

            newSlice = nacClient.slices.create(
                networkId,
                sliceInfo,
                notificationUrl,
                {
                    name: 'slice_one',
                    areaOfService
                }
            )
        ```
 */

    async create(
        networkId: NetworkIdentifier,
        sliceInfo: SliceInfo,
        notificationUrl: string,
        optionalArgs?: SliceOptionalArgs
    ): Promise<Slice> {
        const slice = new Slice(
            this.api,
            "NOT_SUBMITED",
            sliceInfo,
            networkId,
            notificationUrl,
            optionalArgs
        );

        const newSlice: any = await this.api.slicing.create(
            networkId,
            sliceInfo,
            notificationUrl,
            optionalArgs
        );

        slice.sid = newSlice["csi_id"];
        slice.state = newSlice["state"];

        return slice;
    }

    /**
 *  Get All slices.
 *  @param None
    @returns Promise<Slice[]>
    @example ```TypeScript
        fetchedSlices = nacClient.slices.getAll()
    ``` 
 *
 */
    async getAll(): Promise<Slice[]> {
        const data: any = await this.api.slicing.getAll();

        const slices: Slice[] = [];
        data.forEach(async (slice: any) => {
            const sliceInstance = new Slice(
                this.api,
                slice.state,
                slice.slice.slice_info,
                slice.slice.networkIdentifier,
                slice.slice.notificationUrl,
                {
                    name: slice.slice.name,
                    areaOfService: slice.slice.areaOfService,
                    maxDataConnections: slice.slice.maxDataConnections,
                    maxDevices: slice.slice.maxDevices,
                    sliceDownlinkThroughput:
                        slice.slice.sliceDownlinkThroughput,
                    sliceUplinkThroughput: slice.slice.sliceUplinkThroughput,
                    deviceDownlinkThroughput:
                        slice.slice.deviceDownlinkThroughput,
                    deviceUplinkThroughput: slice.slice.deviceUplinkThroughput,
                }
            );
            slices.push(sliceInstance);
            const attachments: any =
                await this.api.sliceAttach.getAttachments();

            if (attachments.length > 0) {
                const sliceAttachments = attachments.filter(
                    (attachment: any) =>
                        attachment.resource.sliceId == sliceInstance.name
                );
                sliceInstance.setAttachments(sliceAttachments);
            }
        });
        return slices;
    }

    /**
 *  Get network slice by id.
          @param  id (string): Resource id.
          @returns Promise<Slice>
          @example ```TypeScript
            fetchedSlice = nacClient.slices.get(id)
          ``` 
 */
    async get(id: string): Promise<Slice> {
        const data: any = await this.api.slicing.get(id);

        const slice: Slice = new Slice(
            this.api,
            data.state,
            data.slice.slice_info,
            data.slice.networkIdentifier,
            data.slice.notificationUrl,
            {
                sid: data.csi_id,
                name: data.slice.name,
                areaOfService: data.slice.areaOfService,
                maxDataConnections: data.slice.maxDataConnections,
                maxDevices: data.slice.maxDevices,
                sliceDownlinkThroughput: data.slice.sliceDownlinkThroughput,
                sliceUplinkThroughput: data.slice.sliceUplinkThroughput,
                deviceDownlinkThroughput: data.slice.deviceDownlinkThroughput,
                deviceUplinkThroughput: data.slice.deviceUplinkThroughput,
            }
        );

        const attachments: any = await this.api.sliceAttach.getAttachments();

        if (attachments.length > 0) {
            const sliceAttachments = attachments.filter(
                (attachment: any) => attachment.resource.sliceId == slice.name
            );
            slice.setAttachments(sliceAttachments);
        }

        return slice;
    }

    /**
 *  Get Application Attachment Instance
          @param  id (string): Application Attachment Id
          @example ```TypeScript
            attachment = nacClient.slices.getAttachment(id)
          ``` 
 */
    async getAttachment(id: string) {
        return await this.api.sliceAttach.get(id);
    }

    /**
 *  Get All Application Attachments
 * @param None
   @example ```TypeScript
        attachment = nacClient.slices.getAttachments()
    ``` 
 */
    async getAllAttachments() {
        return await this.api.sliceAttach.getAttachments();
    }
}
