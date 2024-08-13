// Device Status functionalities

// Subscribing to Connectivity and Roaming updates:

import { NetworkAsCodeClient } from "network-as-code";

const client = new NetworkAsCodeClient("<your-application-key-here>");

// Create a device object for the mobile device we want to use
const myDevice = client.devices.get({
    networkAccessIdentifier: "device@testcsp.net",
    ipv4Address: {
        publicAddress: "233.252.0.2",
        privateAddress: "192.0.2.25",
        publicPort: 80,
    },
});

// Simply change the event_type whenever needed.
const mySubscription = await client.deviceStatus.subscribe(
    myDevice,
    // When necessary, change it to:
    // "org.camaraproject.device-status.v0.roaming-status"
    "org.camaraproject.device-status.v0.connectivity-data",
    // Use HTTPS to send notifications
    "https://example.com/notify",
    {
        maxNumberOfReports: 5,
        notificationAuthToken: "replace-with-your-auth-token"
    }
);

// Use this to show the roaming subscription status
console.log(mySubscription);

// Get the subscription by its ID
const subscription = await client.deviceStatus.get(mySubscription.eventSubscriptionId);

// Then, delete the subscription whenever needed
subscription.delete();
