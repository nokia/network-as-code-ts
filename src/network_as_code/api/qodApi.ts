import { Device, DeviceIpv4Addr } from "../models/device";
import { errorHandler } from "../errors";
import { PortSpec } from "../models/session";
/**
 *  Qod API, that sends requests to the API via httpx calls
 */
export class QodAPI {
    /**
 *  Methods takes rapidHost, rapidKey, and baseUrl.
 * Args:
            rapidHost (str): RapidAPI Host
            rapidKey (str): RapidAPI Key
            baseUrl (str): URL for
    */
    private headers: HeadersInit;
    private baseUrl: string;
    constructor(baseURL: string, rapidKey: string, rapidHost: string) {
        this.baseUrl = baseURL;
        this.headers = {
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey,
            "content-type": "application/json",
        };
    }

    /**
 *  Function that hits the create session endpoint with the data
 * 
 * #### Args:
            profile (any): Name of the requested QoS profile.
            serviceIpv4 (any): IPv4 address of the service.
            serviceIpv6 (optional): IPv6 address of the service.
            devicePorts (optional): List of the device ports.
            servicePorts (optional): List of the application server ports.
            duration (optional): Session duration in seconds.
            notificationUrl (optional): Notification URL for session-related events.
            notificationToken (optional): Security bearer token to authenticate registration of session.

        Returns:
            Session: response of the endpoint, ideally a Session
 */
    async createSession(
        sid: string | undefined,
        profile: string,
        serviceIpv6: string | undefined,
        serviceIpv4?: string,
        phoneNumber?: string,
        ipv4Address?: string | DeviceIpv4Addr,
        devicePorts: PortSpec | undefined = undefined,
        servicePorts: PortSpec | undefined = undefined,
        duration = undefined,
        notificationUrl = undefined,
        notificationAuthToken = undefined
    ) {
        let sessionPayload: any = {
            qosProfile: profile,
            device: { ipv4Address: {} },
            applicationServer: { ipv4Address: serviceIpv4 },
            devicePorts: devicePorts ? devicePorts : undefined,
            applicationServerPorts: servicePorts ? servicePorts : undefined,
        };

        if (sid) {
            sessionPayload["device"]["networkAccessIdentifier"] = sid;
        }

        if (ipv4Address) {
            if ((ipv4Address as DeviceIpv4Addr).publicAddress) {
                sessionPayload["device"]["ipv4Address"]["publicAddress"] = (
                    ipv4Address as DeviceIpv4Addr
                ).publicAddress;
            }
            if ((ipv4Address as DeviceIpv4Addr).privateAddress) {
                sessionPayload["device"]["ipv4Address"]["privateAddress"] = (
                    ipv4Address as DeviceIpv4Addr
                ).privateAddress;
            }
            if ((ipv4Address as DeviceIpv4Addr).publicPort) {
                sessionPayload["device"]["ipv4Address"]["publicPort"] = (
                    ipv4Address as DeviceIpv4Addr
                ).publicPort;
            }
        }

        if (phoneNumber) {
            sessionPayload["device"]["phoneNumber"] = phoneNumber;
        }

        if (serviceIpv6) {
            sessionPayload["applicationServer"]["ipv6Address"] = serviceIpv6;
        }

        if (duration) {
            sessionPayload["duration"] = duration;
        }

        if (notificationUrl) {
            sessionPayload["notificationUrl"] = notificationUrl;
        }

        if (notificationAuthToken) {
            sessionPayload["notificationAuthToken"] =
                "Bearer " + notificationAuthToken;
        }

        let response = await fetch(this.baseUrl + "/sessions", {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(sessionPayload),
        });

        errorHandler(response);

        response = await response.json();
        return response;
    }

    /**
 *  This function retrieves all sessions given a device_id
 * Args:
            deviceId (dict): The dict with device-id of the device whose sessions to retrieve

        Returns:
            list: returns list of session
 */
    async getAllSessions(device: Device) {
        let url = "";

        if (device.networkAccessIdentifier) {
            url = `/sessions?networkAccessIdentifier=${device.networkAccessIdentifier}`;
        } else if (device.phoneNumber) {
            url = `/sessions?phoneNumber=${device.phoneNumber}`;
        }

        let response = await fetch(this.baseUrl + url, {
            method: "GET",
            headers: this.headers,
        });

        errorHandler(response);

        response = await response.json();
        return response;
    }

    /**
 *  Returns a session given session ID
 * Args:
            sessionId (str): A string session ID

        Returns:
            Session: the session object
 */
    async getSession(sessionId: string) {
        const url = `/sessions/${sessionId}`;
        let response = await fetch(this.baseUrl + url, {
            method: "GET",
            headers: this.headers,
        });

        errorHandler(response);

        response = await response.json();
        return response;
    }

    /**
 *  Deletes a session given session ID
 * Args:
            id (string): session ID
 */
    async deleteSession(sessionId: string) {
        const url = `/sessions/${sessionId}`;
        let response = await fetch(this.baseUrl + url, {
            method: "DELETE",
            headers: this.headers,
        });

        errorHandler(response);

        return response;
    }
}
