import { APIClient } from "../api/client";
import { QoDSession } from "./session";

/**
 * An interface representing the `NetworkIdentifier` model.
 * #### Public Attributes:
            mnc (string): the `mnc` of a network identifier object.
            mcc (Optional[string]): the `mcc` of a network identifier object.
 */
export interface NetworkIdentifier {
    mnc: string;
    mcc: string;
}

/**
 *  An interface representing the `SliceInfo` model.
 * #### Public Attributes:
            service_type (string): the service type of a slice object, Example: `eMBB`
            differentiator (Optional[string]): the differentiator of a slice object.
 */
export interface SliceInfo {
    service_type: string;
    differentiator?: string;
}

/**
 *  An interface representing the `Throughput` model.
 * #### Public Attributes:
            guaranteed (number): the guaranteed throughput amount in integer
            maximum (number): the maximum throughput amount in integer
 */
interface Throughput {
    guaranteed?: number;
    maximum?: number;
}

/**
 *  An interface representing the `Point` model.
 * #### Public Attributes:
            longitude (Union[float, int]): the `longitude` of a point object.
            latitude (Union[float, int]): the `latitude` of a point object.
 */
export interface Point {
    longitude?: number;
    latitude?: number;
}

/**
 *  An interface representing the `AreaOfService` model.
 * #### Public Attributes:
            polygon (List[Point]): the `polygon` value of an area of service object.
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

/**
 *  A class representing the `Slice` model.
 * #### Private Attributes:
        _api(APIClient): An API client object.
        _sessions(List[Session]): List of device session instances.

    #### Public Attributes:
        sid (optional): String ID of the slice
        state (str): State of the slice (ie. NOT_SUBMITTED)
        name (optional): Optional short name for the slice. Must be ASCII characters, digits and dash. Like name of an event, such as "Concert-2029-Big-Arena".
        networkIdentifier (NetworkIdentifier): Name of the network
        sliceInfo (SliceInfo): Purpose of this slice
        areaOfService (AreaOfService): Location of the slice
        maxDataConnections (optional): Optional maximum number of data connection sessions in the slice.
        maxDevices (optional): Optional maximum number of devices using the slice.
        sliceDownlinkThroughput (optional): Optional throughput object
        sliceUplinkThroughput (optional): Optional throughput object
        deviceDownlinkThroughput (optional): Optional throughput object
        deviceUplinkThroughput: (optional): Optional throughput object


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
    state: string;
    sliceInfo: SliceInfo;
    networkIdentifier: NetworkIdentifier;
    sid?: string;
    name?: string; // TODO: Add Validation As the Python version
    areaOfService?: AreaOfService;
    maxDataConnections?: number; // TODO: Add GE validation
    maxDevices?: number; // TODO: Add GE validation
    sliceDownlinkThroughput?: Throughput;
    sliceUplinkThroughput?: Throughput;
    deviceDownlinkThroughput?: Throughput;
    deviceUplinkThroughput?: Throughput;

    constructor(
        api: APIClient,
        state: string,
        sliceInfo: SliceInfo,
        networkIdentifier: NetworkIdentifier,
        sliceOptionalArgs?: SliceOptionalArgs
    ) {
        this._api = api;
        this._sessions = [];
        this.state = state;
        this.sliceInfo = sliceInfo;
        this.networkIdentifier = networkIdentifier;
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
}
