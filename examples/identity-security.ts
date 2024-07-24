// Identity and security functionalities

// SIM Swap examples:

import { NetworkAsCodeClient } from 'network-as-code';

import { Device } from ".network-as-code/models/device";

// Initialize the client object with your application key
const main = async () => {
    const client = new NetworkAsCodeClient("<your-application-key-here>");
    // Then, create a device object for the phone number you want to check

    const myDevice = client.devices.get({
        // The phone number accepts the "+" sign, but not spaces or "()" marks
        phoneNumber: "36721601234567"
    });

    // Check the latest SIM-Swap date
    const simSwapDate = myDevice.getSimSwapDate()

    // Check SIM-Swap events within specified time spans
    // The maxAge parameter is not mandatory
    // This method also checks if SIM swap occurred within an undefined age
    const simSwapCheck = myDevice.verifySimSwap(360)
};
