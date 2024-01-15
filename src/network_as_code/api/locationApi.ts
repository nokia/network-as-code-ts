import { Device } from "../models/device";
import { Location } from "../models/location";
import { errorHandler } from "../errors";

class LocationVerifyAPI {
    private baseUrl: string;
    private headers: HeadersInit;

    constructor(base_url: string, rapid_key: string, rapid_host: string) {
        this.baseUrl = base_url;
        this.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": rapid_host,
            "X-RapidAPI-Key": rapid_key,
        };
    }

    async verifyLocation(
        latitude: number,
        longitude: number,
        device: Device,
        radius: number,
        max_age?: number
    ): Promise<boolean> {
        const body: any = {
            device: device.toJson(),
            area: {
                areaType: "Circle",
                center: { latitude: latitude, longitude: longitude },
                radius: radius,
            },
        };

        if (max_age) {
            body.maxAge = max_age;
        }

        const response = await fetch(`${this.baseUrl}/verify`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
        });

        errorHandler(response);

        const data = await response.json();
        return data.verificationResult === "TRUE";
    }
}

class LocationRetrievalAPI {
    private baseUrl: string;
    private headers: HeadersInit;

    constructor(baseUrl: string, rapidKey: string, rapidHost: string) {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey,
        };
    }

    async getLocation(device: Device, max_age?: number): Promise<Location> {
        const body: any = { device: device.toJson() };

        if (max_age) {
            body.maxAge = max_age;
        }

        const response = await fetch(`${this.baseUrl}/retrieve`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
        });

        errorHandler(response);

        const jsonData = await response.json();

        return {
            latitude: jsonData.area.center.latitude,
            longitude: jsonData.area.center.longitude,
            civicAddress: jsonData.civicAddress,
        };
    }
}

export { LocationRetrievalAPI, LocationVerifyAPI };
