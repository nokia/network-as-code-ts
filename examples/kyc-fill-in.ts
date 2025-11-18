import { NetworkAsCodeClient } from "network-as-code";


// Initialize the client object with your application key
const client = new NetworkAsCodeClient("<your-application-key-here>");


// To use the requestCustomerData method you must provide the customer's phone number.
const result = await client.kyc.requestCustomerData("+99999991000");


// If successful, you can access the results like so:
console.log(result);