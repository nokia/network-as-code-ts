import { NetworkAsCodeClient } from "../src";

const client = new NetworkAsCodeClient("<your-token>");

const device = client.devices.get({ phoneNumber: "3637123456" })

// SIM swap date can be acquired like so:
const simSwapDate = await device.getSimSwapDate();

// Under some circumstances if no SIM swap has occurred, this object may be null
// Otherwise the SIM swap date may also be the activation date of the SIM
if (!simSwapDate) {
    console.log("SIM swap date is null: No SIM swap has occurred")
} else {
    console.log(`Last SIM swap (or activation) happened on ${simSwapDate.toISOString()}`)
}

// It is also possible to check if a SIM swap has occurred in general
if (await device.verifySimSwap()) {
    console.log("A SIM swap has occurred!")
}

// If we want to check if it happened during the past hour:
if (await device.verifySimSwap(3600)) {
    console.log("A SIM swap has occurred in the past hour!")
}
