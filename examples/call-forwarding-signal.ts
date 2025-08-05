import { NetworkAsCodeClient } from "network-as-code";

// We begin by creating a Network as Code client
const client = new NetworkAsCodeClient("<your-application-key-here>");

// Create a device object for the mobile device we want to use
const myDevice = client.devices.get({
    // The phone number accepts the "+" sign, but not spaces or "()" marks
    phoneNumber: "36721601234567"
});

// Verify, if a device has an active, unconditional call forwarding
const result = await myDevice.verifyUnconditionalForwarding()

// Show the result
console.log(result)

// To get information about an active "call forwarding setup" for the given device,
// use the following snippet:
const services = myDevice.getForwardingServices()

// Show active Call Forwarding Services
console.log(services)