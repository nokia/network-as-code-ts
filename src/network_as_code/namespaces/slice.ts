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
            networkId (NetworkIdentifier): Name of the network
            sliceInfo (SliceInfo): Purpose of this slice
            areaOfService (AreaOfService): Location of the slice
            sliceDownlinkThroughput (optional): Optional throughput object
            sliceUplinkThroughput (optional): Optional throughput object
            deviceDownlinkThroughput (optional): Optional throughput object
            deviceUplinkThroughput: (optional): Optional throughput object
            name (optional): Optional short name for the slice. Must be ASCII characters, digits and dash. Like name of an event, such as "Concert-2029-Big-Arena".
            maxDataConnections (optional): Optional maximum number of data connection sessions in the slice.
            maxDevices (optional): Optional maximum number of devices using the slice.

    #### Example:
        ```typescript
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
        ```
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
            optionalArgs
        );

        const newSlice = await this.api.slicing.create(
            networkId,
            sliceInfo,
            notificationUrl,
            optionalArgs
        );

        slice.sid = newSlice["csi_id"];
        slice.state = newSlice["state"];

        return slice;
    }

    // TODO: ADD get and getAll methods
}
