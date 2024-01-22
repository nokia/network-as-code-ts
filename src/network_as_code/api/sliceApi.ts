import {
    AreaOfService,
    NetworkIdentifier,
    Point,
    Slice,
    SliceInfo,
    SliceOptionalArgs,
} from "../models/slice";
import { errorHandler } from "../errors";
import { Device } from "../models/device";

export class SliceAPI {
    private baseUrl: string;
    private headers: HeadersInit;

    /**
 *  Methods takes rapidHost, rapidKey, and baseUrl.
 * Args:
            rapidHost (str): RapidAPI Host
            rapidKey (str): RapidAPI Key
            baseUrl (str): URL for
    */

    constructor(baseURL: string, rapidKey: string, rapidHost: string) {
        this.baseUrl = baseURL;
        this.headers = {
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey,
            "content-type": "application/json",
        };
    }

    async create(
        networkId: NetworkIdentifier,
        sliceInfo: SliceInfo,
        notificationUrl: string,
        optionalArgs?: SliceOptionalArgs
    ) {
        const body: any = {
            networkIdentifier: networkId,
            sliceInfo: sliceInfo,
            notificationUrl: notificationUrl,
        };

        if (optionalArgs) {
            if (optionalArgs.sid) {
                body.sid = optionalArgs.sid;
            }

            if (optionalArgs.name) {
                body.name = optionalArgs.name;
            }

            if (optionalArgs.areaOfService) {
                body.areaOfService = this.convertAreaOfServiceObj(
                    optionalArgs.areaOfService
                );
            }

            if (optionalArgs.maxDataConnections) {
                body.maxDataConnections = optionalArgs.maxDataConnections;
            }

            if (optionalArgs.maxDevices) {
                body.maxDevices = optionalArgs.maxDevices;
            }

            if (optionalArgs.sliceDownlinkThroughput) {
                body.sliceDownlinkThroughput =
                    optionalArgs.sliceDownlinkThroughput;
            }

            if (optionalArgs.sliceUplinkThroughput) {
                body.sliceUplinkThroughput = optionalArgs.sliceUplinkThroughput;
            }

            if (optionalArgs.deviceDownlinkThroughput) {
                body.deviceDownlinkThroughput =
                    optionalArgs.deviceDownlinkThroughput;
            }

            if (optionalArgs.deviceUplinkThroughput) {
                body.deviceUplinkThroughput =
                    optionalArgs.deviceUplinkThroughput;
            }
        }

        const response = await fetch(`${this.baseUrl}/slices`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
        });

        errorHandler(response);

        return await response.json();
    }

    async getAll() {
        const response = await fetch(`${this.baseUrl}/slices`, {
            method: "GET",
            headers: this.headers,
        });

        errorHandler(response);

        return response.json();
    }

    async get(sliceId: string) {
        const response = await fetch(`${this.baseUrl}/slices/${sliceId}`, {
            method: "GET",
            headers: this.headers,
        });

        errorHandler(response);

        return response.json();
    }

    async activate(sliceId: string) {
        const response = await fetch(
            `${this.baseUrl}/slices/${sliceId}/activate`,
            {
                method: "POST",
                headers: this.headers,
            }
        );

        errorHandler(response);

        return response;
    }

    async deactivate(sliceId: string) {
        const response = await fetch(
            `${this.baseUrl}/slices/${sliceId}/deactivate`,
            {
                method: "POST",
                headers: this.headers,
            }
        );

        errorHandler(response);

        return response;
    }

    async delete(sliceId: string) {
        const response = await fetch(`${this.baseUrl}/slices/${sliceId}`, {
            method: "DELETE",
            headers: this.headers,
        });

        errorHandler(response);

        return response;
    }

    convertAreaOfServiceObj(areaOfService: AreaOfService) {
        let polygon: Array<{ lat?: number; lon?: number }> = [];
        areaOfService.polygon.forEach((point: Point) => {
            polygon.push({ lat: point.latitude, lon: point.longitude });
        });
        return { polygon };
    }
}

export class AttachAPI {
    private baseUrl: string;
    private headers: HeadersInit;

    /**
 *  The class takes rapidHost, rapidKey, and baseUrl.
 * Args:
            rapidHost (str): RapidAPI Host
            rapidKey (str): RapidAPI Key
            baseUrl (str): URL for
    */

    constructor(baseURL: string, rapidKey: string, rapidHost: string) {
        this.baseUrl = baseURL;
        this.headers = {
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey,
            "content-type": "application/json",
        };
    }

    async attach(
        device: Device,
        sliceId: string,
        notificationUrl: string,
        notificationAuthToken?: string
    ) {
        const res = await fetch(`${this.baseUrl}/slice/${sliceId}/attach`, {
            method: "POST",
            body: JSON.stringify({
                phoneNumber: device.phoneNumber,
                notificationUrl,
                notificationAuthToken,
            }),
        });

        errorHandler(res);
    }

    async detach(
        device: Device,
        sliceId: string,
        notificationUrl: string,
        notificationAuthToken?: string
    ) {
        const res = await fetch(`${this.baseUrl}/slice/${sliceId}/detach`, {
            method: "POST",
            body: JSON.stringify({
                phoneNumber: device.phoneNumber,
                notificationUrl,
                notificationAuthToken,
            }),
        });

        errorHandler(res);
    }
}
