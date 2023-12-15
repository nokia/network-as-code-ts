import { Device, DeviceIpv4Addr } from '../models/device';
import { Namespace } from './namespace';

/**
 *  Representation of a mobile subscription.
 * 
 * Through this class many of the parameters of a
    subscription can be configured on the network.
 */
export class Devices extends Namespace {
	/**
     *  Get a subscription by its external ID.
     * 
     * Args:
            id (str): External ID of the subscription. Email-like.
            ipv4Address (Any | None): ipv4 address of the subscription.
            ipv6Address (Any | None): ipv6 address of the subscription.
            phoneNumber (Any | None): phone number of the subscription.
    */
	get(
		networkAccessIdentifier: string | undefined = undefined,
		ipv4Address: string | DeviceIpv4Addr,
		ipv6Address = undefined,
		phoneNumber: string | undefined = undefined
	): Device {
		if (
			!networkAccessIdentifier &&
			!ipv4Address &&
			!ipv6Address &&
			phoneNumber
		) {
			throw new Error('At least one parameter must be set.');
		}

		if (typeof ipv4Address === 'string') {
			ipv4Address = new DeviceIpv4Addr(ipv4Address, undefined, undefined);
		}

		let retDevice = new Device(
			this.api,
			networkAccessIdentifier,
			ipv4Address,
			ipv6Address,
			phoneNumber
		);
		return retDevice;
	}
}
