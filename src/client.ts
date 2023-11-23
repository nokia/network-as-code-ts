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
	constructor(token: string, ...args: any[]) {}
}
