import { NetworkAsCodeClient } from "network-as-code";

import {
    AreaOfService,
    NetworkIdentifier,
    Point,
    Slice,
    SliceInfo,
    Throughput
} from "network-as-code/models/slice";

const main = async () => {
    const client = new NetworkAsCodeClient(...);

    // Creation of a slice:
    // We use the country code (MCC) and network code (MNC) to identify the network
    // Different types of slices can be requested using service type and differentiator
    // Area of the slice must also be described in geo-coordinates
    const mySlice = await client.slices.create(
        { mcc: "236", mnc: "30" },
        { service_type: "eMBB", differentiator: "123456" },
        "https://notify.me/here",
        {
            name: "slice-name",
            notificationAuthToken: "replace-with-your-auth-token",
            areaOfService: {
                polygon: [
                    {
                        latitude: 23.0,
                        longitude: 23.0
                    },
                    {
                        latitude: 23.0,
                        longitude: 23.0
                    },
                ],
            },
            maxDataConnections: 1000,
            maxDevices: 5,
            sliceDownlinkThroughput: {
                guaranteed: 3415,
                maximum: 1234324
            },
            sliceUplinkThroughput: {
                guaranteed: 3415,
                maximum: 1234324
            },
            deviceDownlinkThroughput: {
                guaranteed: 3415,
                maximum: 1234324
            },
            deviceUplinkThroughput: {
                guaranteed: 3415,
                maximum: 1234324
            }
        }
    );
};