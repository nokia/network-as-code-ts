import { APIClient } from "./api/client";
import { Devices } from "./namespaces/device";
import { DeviceStatus } from "./namespaces/deviceStatus";
import { Sessions } from "./namespaces/session";
import { Slices } from "./namespaces/slice";

/**
 * A client for working with Network as Code.
 * ### Example:
    ```python
    from network_as_code import NetworkAsCodeClient

    client = NetworkAsCodeClient(token="your_api_token")
    sub = client.subscriptions.get("user@example.com")
    print(sub.location())
    ```
    ### Args:
        token (str): Authentication token for the Network as Code API.
        Any additional keyword arguments will be directly passed to the underlying HTTPX client.
 */
export class NetworkAsCodeClient {
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
     */
    get devices() {
        return this._devices;
    }

    /**
     * Namespace containing functionalities related to mobile subscriptions.
     */
    get sessions() {
        return this._sessions;
    }

    get deviceStatus() {
        return this._deviceStatus;
    }

    /**
     * Namespace containing functionalities related to network slicing.
     */
    get slices() {
        return this._slices;
    }

    get api() {
        return this._api;
    }
}

export function main() {
	const client = new NetworkAsCodeClient('<my-token>');
}

main();
