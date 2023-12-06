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

import { APIClient } from "./api/client";
import { Devices } from "./namespaces/device";

export class NetworkAsCodeClient {
    _api: APIClient;
    _devices: Devices;

	constructor(token: string, ...args: any[]) {
        this._api = new APIClient(token);
        this._devices = new Devices(this._api)
    }


     /**
         * Namespace containing functionalities related to mobile subscriptions.
    */
    get devices(){
       return this._devices;
    }
}
