import { beforeAll, describe, expect } from "@jest/globals";
import "dotenv/config";
import { NetworkAsCodeClient } from "../src";
import { configureClient } from "./configClient";

let client: NetworkAsCodeClient;

beforeAll((): any => {
    client = configureClient()
});

describe("Call forwarding retrieval and verification of unconditional forwarding", () => {
    it("should check if device is unconditionally forwarding a call", async () => {
        let device = client.devices.get({
            phoneNumber: "+367199991000"
        });
        
        let response = await device.verifyUnconditionalForwarding()
        expect(response).toBe(true)
    });

    it("should check if device is not unconditionally forwarding a call", async () => {
        let device = client.devices.get({
            phoneNumber: "+367199991001"
        });

        let response = await device.verifyUnconditionalForwarding()
        expect(response).toBe(false)
    })

    it("gets list of call forwarding services", async () => {
        let device = client.devices.get({
            phoneNumber: "+367199991000"
        });

        let response = await device.getCallForwarding()
        let types = ['inactive', 'unconditional', 'conditional_busy', 'conditional_not_reachable', 'conditional_no_answer']

        expect(response instanceof Array).toBeTruthy();
        expect(response.every((val) => types.includes(val)));
    });

});