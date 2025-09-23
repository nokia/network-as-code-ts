import { NetworkAsCodeClient } from "network-as-code";

const client = new NetworkAsCodeClient("<your-token>");

const device = client.devices.get({ phoneNumber: "+3637123456" });

// Device swap date can be acquired like so:
const deviceSwapDate = await device.getDeviceSwapDate();

// Under some circumstances if no device swap has occurred, this object may be null
// Otherwise the device swap date may also be the activation date of the device
if (!deviceSwapDate) {
    console.log("Device swap date is null: No device swap has occurred");
} else {
    console.log(
        `Last device swap (or activation) happened on ${deviceSwapDate.toISOString()}`
    );
}

// It is also possible to check if a device swap has occurred in general
if (await device.verifyDeviceSwap()) {
    console.log("A device swap has occurred!");
}

// If we want to check if it happened during the past hour:
if (await device.verifyDeviceSwap(2400)) {
    console.log("A device swap has occurred in the past hour!");
}
