import { Device } from "../models/device";
import { Location } from "../models/location";
import { errorHandler } from "../errors";
import { ProxyAgent } from "proxy-agent";

import fetch from "node-fetch";

class LocationVerifyAPI {
    private baseUrl: string;
    private headers: HeadersInit;
    private agent: ProxyAgent;

    constructor(
        baseUrl: string,
        rapidKey: string,
        rapidHost: string,
        agent: ProxyAgent
    ) {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey,
        };
        this.agent = agent;
    }

    async verifyLocation(
        latitude: number,
        longitude: number,
        device: Device,
        radius: number,
        maxAge = 60
    ): Promise<boolean> {
        const body: any = {
            device: device.toJson(),
            area: {
                areaType: "Circle",
                center: { latitude: latitude, longitude: longitude },
                radius: radius,
            },
            maxAge,
        };

        const response = await fetch(`${this.baseUrl}/verify`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
            agent: this.agent,
        });

        errorHandler(response);

        const data: any = await response.json();
        return data.verificationResult === "TRUE";
    }
}

class LocationRetrievalAPI {
    private baseUrl: string;
    private headers: HeadersInit;
    private agent: ProxyAgent;

    constructor(
        baseUrl: string,
        rapidKey: string,
        rapidHost: string,
        agent: ProxyAgent
    ) {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey,
        };
        this.agent = agent;
    }

    async getLocation(device: Device, maxAge = 60): Promise<Location> {
        const body: any = { device: device.toJson(), maxAge };

        const response = await fetch(`${this.baseUrl}/retrieve`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
            agent: this.agent,
        });

        errorHandler(response);

        const jsonData: any = await response.json();

        return {
            latitude: jsonData.area.center.latitude,
            longitude: jsonData.area.center.longitude,
            civicAddress: jsonData.civicAddress,
        };
    }
}

export { LocationRetrievalAPI, LocationVerifyAPI };
