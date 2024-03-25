import { NetworkAsCodeClient } from "network-as-code";

import { Device, DeviceIpv4Addr } from "network-as-code/models/device";

const main = async () => {

    const client = new NetworkAsCodeClient("<your-application-key-here>");

    // Create a device object for the mobile device we want to use
    const myDevice = client.devices.get(
        "device@bestcsp.net",
        {
            publicAddress: "233.252.0.2",
            privateAddress: "192.0.2.25",
            publicPort: 80
        },
        // The phone number accepts the "+" sign, but not spaces or "()" marks
        "36721601234567"
    );

    // Simply change the event_type to "ROAMING_STATUS" whenever needed.
    const mySubscription = await client.deviceStatus.subscribe(
        myDevice,
        // Change it to "ROAMING_STATUS" whenever needed
        "CONNECTIVITY",
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
};