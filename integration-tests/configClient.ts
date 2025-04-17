
import "dotenv/config";

import { NetworkAsCodeClient } from "../src";

export const configureClient = (): NetworkAsCodeClient => {
    const prodTest = process.env["PRODTEST"];
    const NAC_TOKEN = prodTest ? process.env["NAC_TOKEN_PROD"] : process.env["NAC_TOKEN"];
    const client = new NetworkAsCodeClient(
        NAC_TOKEN as string,
        prodTest ? false : true
    );
    return client;
}

export const configureNotificationServerUrl = () : string => {
    const notificationUrl = process.env["SDK_NOTIFICATION_SERVER_URL"].conact("typescript");
    return notificationUrl 
}
