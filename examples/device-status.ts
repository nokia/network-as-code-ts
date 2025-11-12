// Device Status functionalities

// Subscribing to Reachability or Roaming updates:

import { NetworkAsCodeClient } from "network-as-code";
import { EventType } from "../src/models/deviceStatus";

const client = new NetworkAsCodeClient("<your-application-key-here>");

// Create a device object for the mobile device we want to use
const myDevice = client.devices.get({
    // The phone number accepts the "+" sign, but not spaces or "()" marks
    phoneNumber: "+99999991000"
});

// Simply change the event_type whenever needed.
const mySubscription = await client.deviceStatus.subscribe(
    myDevice,
    // When necessary, change this to different event_type, for example:
    // [EventType.ROAMING_STATUS]
    [EventType.REACHABILITY_DATA],
    // Use HTTPS to send notifications
    "https://example.com/notify",
    // You can add optional parameters as well
    {
        initialEvent: true,
        subscriptionMaxEvents: 5
    }
);

// Use this to show the roaming subscription status
console.log(mySubscription);

// Get the reachability subscription by its ID
// Change the method call to getRoamingSubscription() to get a roaming subscription
const subscription = await client.deviceStatus.getReachabilitySubscription(mySubscription.eventSubscriptionId);

// Then, delete the subscription whenever needed
subscription.delete();
