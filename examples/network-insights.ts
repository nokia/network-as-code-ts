// Network Insights functionalities

// Congestion examples:

import { NetworkAsCodeClient } from 'network-as-code';

// Begin by creating a client for Network as Code:
const client = new NetworkAsCodeClient("<your-application-key-here>");

// The "device@testcsp.net" should be replaced
// with a test device copied from your Developer Sandbox
// Or you can identify a device with its ID,
// IP address(es) and optionally, a phone number
const myDevice = client.devices.get({
    networkAccessIdentifier: "device@testcsp.net",
    ipv4Address: {
        publicAddress: "233.252.0.2",
        privateAddress: "192.0.2.25",
        publicPort: 80,
    },
    Ipv6Address: "2041:0000:140F::875B:131B",
    // The phone number accepts the "+" sign, but not spaces or "()" marks
    phoneNumber: "36721601234567"
});

// Set the duration of your subscription to congestion insights,
// e.g.: it can end in `n` days starting from now.
const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
tomorrowDate.setMilliseconds(0);

// Subscribe your device to Congestion notifications
const congestionSubscription = await client.insights.subscribeToCongestionInfo(
    myDevice,
    tomorrowDate,
    "https://example.com/notify",
    "my-secret-token"
);

// Subscriptions are identified by id, for management
// Use this to show the subscription:
console.log(congestionSubscription.subscriptionId());

// Or check when your subscription starts/expires:
console.log(congestionSubscription.startsAt);
console.log(congestionSubscription.expiresAt);

// Get congestion predictions and historical data
// between two timestamps with ISO 8601 formatted date strings.
const congestion = await myDevice.getCongestion(
    // start date
    "2025-04-15T05:11:30.961136Z",
    // end date
    "2025-04-16T05:11:30Z"
);
