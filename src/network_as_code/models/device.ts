import { APIClient } from '../api/client';
import { PortSpec, QoDSession } from './session';
import { Location, CivicAddress } from "./location";

/**
 * An interface representing the `Event` model.
 * #### Public Attributes:
            eventTarget (string): the `eventTarget` of an event object.
            atUnix (float): the `atUnix` of an event object.
 */
interface Event {
	eventTarget: string;
	atUnix: number;
}

/**
 *  An class representing the `DeviceIpv4Addr` model.
 * #### Public Attributes:
            publicAddress (float): the `public_address` of a device IPv4 address object.
            privateAddress (float): the `private_address` of a device IPv4 address object.
            publicPort (Optional[CivicAddress]): the `public_port` of a device IPv4 address object.
 */
export class DeviceIpv4Addr {
	publicAddress?: string;
	privateAddress?: string;
	publicPort?: number;
	constructor(
		publicAddress?: string,
		privateAddress?: string,
		publicPort?: number
	) {
		this.publicAddress = publicAddress;
		this.privateAddress = privateAddress;
		this.publicPort = publicPort;
	}
}

/**
 *  A class representing the `Device` model.
 * #### Private Attributes:
        _api(APIClient): An API client object.
        _sessions(List[Session]): List of device session instances.


    #### Public Attributes:
        sid(EmailStr): Device Identifier email string.
        phoneNumber(str): Phone Number string
        ipv4Address (DeviceIpv4Addr): DeviceIpv4Addr
        ipv6Address (str): string

    #### Public Methods:
        createSession (Session): Creates a session for the device.
        sessions (List[Session]): Returns all the sessions created by the device network_access_id.
        clearSessions (): Deletes all the sessions created by the device network_access_id.
        location (Location): Gets the location of the device and returns a Location client object.
        verifyLocation (bool): Verifies if a device is located in a given location point.
        getConnectivity (ConnectivityData): Retrieve device connectivity status data
        updateConnectivity (ConnectivityData): Update device connectivity status data
        deleteConnectivity (): Delete device connectivity status
 */
export class Device {
	private _api: APIClient;
	private _sessions: QoDSession[];
	networkAccessIdentifier?: string;
	phoneNumber?: string;
	ipv4Address?: string | DeviceIpv4Addr;
	ipv6Address?: string;
	constructor(
		api: APIClient,
		networkAccessIdentifier?: string,
		ipv4Address?: string | DeviceIpv4Addr,
		ipv6Address?: string,
		phoneNumber?: string
	) {
		this._api = api;
		this._sessions = [];
		this.networkAccessIdentifier = networkAccessIdentifier;
		this.ipv4Address = ipv4Address;
		this.ipv6Address = ipv6Address;
		this.phoneNumber = phoneNumber;
	}

	get networkAccessId(): string | undefined {
		return this.networkAccessIdentifier;
	}

	/**
 *  Creates a session for the device.
 * #### Args:
            profile (any): Name of the requested QoS profile.
            serviceIpv4 (any): IPv4 address of the service.
            serviceIpv6 (optional): IPv6 address of the service.
            devicePorts (optional): List of the device ports.
            servicePorts (optional): List of the application server ports.
            duration (optional): Session duration in seconds.
            notificationUrl (optional): Notification URL for session-related events.
            notificationToken (optional): Security bearer token to authenticate registration of session.

        #### Example:
        TODO: Replace with TS example
            ```python
            session = device.createSession(profile="QOS_L", serviceIpv4="5.6.7.8", serviceIpv6="2041:0000:140F::875B:131B", notificationUrl="https://example.com/notifications, notificationToken="c8974e592c2fa383d4a3960714")
            ```
 */
	async createQodSession(
		profile: string,
		serviceIpv4: string | undefined = undefined,
		serviceIpv6: string | undefined = undefined,
		devicePorts: PortSpec | undefined = undefined,
		servicePorts: PortSpec | undefined = undefined,
		duration = undefined,
		notificationUrl = undefined,
		notificationAuthToken = undefined
	): Promise<QoDSession> {
		// Checks if at least one parameter is set
		if (!serviceIpv4 && !serviceIpv6) {
			throw new Error(
				'ValueError: At least one of IP parameters must be provided'
			);
		}

		let session = await this._api.sessions.createSession(
			this.networkAccessIdentifier,
			profile,
			serviceIpv6,
			serviceIpv4,
			this.phoneNumber,
			this.ipv4Address,
			devicePorts,
			servicePorts,
			duration,
			notificationUrl,
			notificationAuthToken
		);

		return QoDSession.convertSessionModel(
			this._api,
			this.ipv4Address,
			JSON.parse(JSON.stringify(session))
		);
	}

	/**
 *  List sessions of the device.
 *  #### Example:
            ```
            sessions = device.sessions()
            ```
 */
	async sessions(): Promise<QoDSession[]> {
		try {
			let sessions: any = await this._api.sessions.getAllSessions(this);
			return sessions.map((session: any) =>
				this.__convertSessionModel(session)
			);
		} catch (error) {
			// TODO Change it to NotFound Error
			return [];
		}
	}

	/**
	 *  Clears sessions of the device.
	 *
	 */
	async clearSessions(): Promise<void> {
		const sessions = await this.sessions();
		sessions.forEach(async (session: any) => {
			await session.deleteSession();
		});
	}

	__convertSessionModel(session: any): QoDSession {
		const result = QoDSession.convertSessionModel(
			this._api,
			this.ipv4Address,
			session
		);
		return result;
	}

    async getLocation(maxAge: number = 60): Promise<Location> {
        const location = await this._api.locationRetrieval.getLocation(this, maxAge)

        return location;
    }

    async verifyLocation(latitude: number, longitude: number, radius: number, maxAge: number = 60): Promise<boolean> {
        return this._api.locationVerify.verifyLocation(latitude, longitude, this, radius, maxAge);
    }

    toJson(): any {
        return {
            networkAccessIdentifier: this.networkAccessId,
            phoneNumber: this.phoneNumber,
            ipv4Address: this.ipv4Address,
            ipv6Address: this.ipv6Address
        }
    }
}
