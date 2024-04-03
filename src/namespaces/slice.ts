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
 * #### Args:
            @param networkId (NetworkIdentifier): Name of the network
            @param sliceInfo (SliceInfo): Purpose of this slice
            @param areaOfService (AreaOfService): Location of the slice
            @param sliceDownlinkThroughput (optional): Optional throughput object
            @param sliceUplinkThroughput (optional): Optional throughput object
            @param deviceDownlinkThroughput (optional): Optional throughput object
            @param deviceUplinkThroughput: (optional): Optional throughput object
            @param name (optional): Optional short name for the slice. Must be ASCII characters, digits and dash. Like name of an event, such as "Concert-2029-Big-Arena".
            @param maxDataConnections (optional): Optional maximum number of data connection sessions in the slice.
            @param maxDevices (optional): Optional maximum number of devices using the slice.
            @returns Slice
    #### Example:
        import NetworkIdentifier, SliceInfo, AreaOfService, Point from models.slice
        

        networkId = {mcc:"358ffYYT", mnc:"246fsTRE"}
        sliceInfo = {service_type:"eMBB", differentiator:"44eab5"}
        areaOfService = {poligon:[Point(lat=47.344, lon=104.349), Point(lat=35.344, lon=76.619), Point(lat=12.344, lon=142.541), Point(lat=19.43, lon=103.53)]}
        notificationUrl = "https://notify.me/here"

        newSlice = nacClient.slices.create(
            network_id = network_id,
            slice_info = slice_info,
            area_of_service = area_of_service,
            notification_url = notification_url
        )
 */

    async create(
        networkId: NetworkIdentifier,
        sliceInfo: SliceInfo,
        notificationUrl: string,
        optionalArgs?: SliceOptionalArgs
    ): Promise<Slice> {
        let slice = new Slice(
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
 *  Get All slices by id.
 * 
 * #### Args:
            None
        @returns Promise Slice[]

    #### Example:
            fetchedSlices = nac_client.slices.getAll()
 */
    async getAll(): Promise<Slice[]> {
        const data: any = await this.api.slicing.getAll();

        let slices: Slice[] = [];
        data.forEach(async (slice: any) => {
            const slice_instance = new Slice(
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
            slices.push(slice_instance);
            const attachments: any =
                await this.api.sliceAttach.getAttachments();

            if (attachments.length > 0) {
                const sliceAttachments = attachments.filter(
                    (attachment: any) =>
                        attachment.resource.sliceId == slice_instance.name
                );
                slice_instance.setAttachments(sliceAttachments);
            }
        });
        return slices;
    }

    /**
 *  Get network slice by id.
 * 
 * #### Args:
          @param  id (string): Resource id.
          @returns Promise Slice

    #### Example:
           fetchedSlice = nac_client.slices.get(id)
 */
    async get(id: string): Promise<Slice> {
        const data: any = await this.api.slicing.get(id);

        let slice: Slice = new Slice(
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
 * #### Args:
            id (string): Application Attachment Id

    #### Example:
            attachment = nac_client.slices.get_attachment(id)
 */
    async getAttachment(id: string) {
        return await this.api.sliceAttach.get(id);
    }

    /**
 *  Get All Application Attachments
 * #### Args:
            None

    #### Example:
            attachment = nac_client.slices.get_attachment(id)
 */
    async getAllAttachments() {
        return await this.api.sliceAttach.getAttachments();
    }
}
