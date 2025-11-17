import { NetworkAsCodeClient } from "network-as-code";


// Initialize the client object with your application key
const client = new NetworkAsCodeClient("<your-application-key-here>");


// To use the check_tenure method you must provide the customer's phone number.

// Add the tenure date from which the continuous tenure of the subscriber is to be confirmed

const result = await client.kyc.checkTenure(
    "+99999991000",
    "2024-03-17"
)

// If successful, you can access the results like so:
console.log(result)

// Or
console.log(result.tenureDateCheck)
console.log(result.contractType)
