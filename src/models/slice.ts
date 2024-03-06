import { APIClient } from "../api/client";
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
    service_type: string;
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

/**
 *  A class representing the `Slice` model.
 * #### Private Attributes:
       @param _api(APIClient): An API client object.
       @param _sessions(List[Session]): List of device session instances.

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

    modify({
        sliceDownlinkThroughput,
        sliceUplinkThroughput,
        deviceDownlinkThroughput,
        deviceUplinkThroughput,
        maxDataConnections,
        maxDevices,
    }: SliceModifyOptionalArgs) {
        this._api.slicing.create(
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
        notificationUrl: string,
        notificationAuthToken?: string
    ) {
        await this._api.sliceAttach.attach(
            device,
            this.name as string,
            notificationUrl,
            notificationAuthToken
        );
    }

    /**
 *  Detach network slice.
 * #### Args:
            device (Device): Device object that the slice is being attached to

    #### Example:
            device = client.devices.get("testuser@open5glab.net", {public_address="1.1.1.2", private_address="1.1.1.2", public_port=80})
            slice.attach(device)
            slice.detach()
 */
    async detach(
        device: Device,
        notificationUrl: string,
        notificationAuthToken?: string
    ) {
        await this._api.sliceAttach.detach(
            device,
            this.name as string,
            notificationUrl,
            notificationAuthToken
        );
    }
}
