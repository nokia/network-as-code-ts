import { APIClient } from "./api/client";
import { Devices } from "./namespaces/device";
import { DeviceStatus } from "./namespaces/deviceStatus";
import { Sessions } from "./namespaces/session";
import { Slices } from "./namespaces/slice";

/**
 * A client for working with Network as Code.
 *  @example Example:
    import { NetworkAsCodeClient } from "../src";

    client = NetworkAsCodeClient(token="your_api_token")
    sub = client.subscriptions.get("user@example.com")
    console.log(sub.location())
    
    ### Args:
        @param token - Authentication token for the Network as Code API.
 */
export default class NetworkAsCodeClient {
    private _api: APIClient;
    private _devices: Devices;
    private _sessions: Sessions;
    private _deviceStatus: DeviceStatus;
    private _slices: Slices;

    constructor(token: string, devMode?: boolean) {
        this._api = new APIClient(
            token,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            devMode
        );
        this._devices = new Devices(this._api);
        this._sessions = new Sessions(this._api);
        this._deviceStatus = new DeviceStatus(this._api);
        this._slices = new Slices(this._api);
    }

    /**
     * Namespace containing functionalities related to mobile subscriptions.
     * @returns NAC Devices
     */
    get devices() {
        return this._devices;
    }

    /**
     * Namespace containing functionalities related to mobile subscriptions.
     * @returns NAC sessions
     */
    get sessions() {
        return this._sessions;
    }

    /**
     * Namespace containing functionalities related to device status.
     * @returns NAC deviceStatus
     */
    get deviceStatus() {
        return this._deviceStatus;
    }

    /**
     * Namespace containing functionalities related to network slicing.
     * @returns NAC slices
     */
    get slices() {
        return this._slices;
    }

    /**
     * @returns NAC API
     */
    get api() {
        return this._api;
    }
}

export function main() {
    const client = new NetworkAsCodeClient("<my-token>");

    const device = client.devices.get("testuser@open5glab.net", "1.1.1.2");

    const session = device.createQodSession("M_L", "5.6.7.8");
}

main();
