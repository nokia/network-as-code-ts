import fetch from 'node-fetch';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

interface CivicAddress {
  country: string;
  A1: string;
  A2: string;
  A3: string;
  A4: string;
  A5: string;
  A6: string;
}

interface Location {
  longitude: number;
  latitude: number;
  civic_address?: CivicAddress;
}

interface DeviceIpv4Addr {
  publicAddress: string;
  privateAddress: string;
  publicPort: number;
}

class Device {
  constructor(public ipv4Address: DeviceIpv4Addr) {}

  async getLocation(maxAge: number): Promise<Location> {
    const url = 'https://location-retrieval.p-eu.rapidapi.com/retrieve';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device: {
          networkAccessIdentifier: 'test_device_id',
          ipv4Address: this.ipv4Address,
        },
        maxAge: maxAge,
      }),
    });
    return response.json();
  }

  async verifyLocation(longitude: number, latitude: number, radius: number, maxAge: number): Promise<boolean> {
    const url = 'https://location-verification.p-eu.rapidapi.com/verify';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device: {
          networkAccessIdentifier: 'test_device_id',
          ipv4Address: this.ipv4Address,
        },
        area: {
          areaType: 'Circle',
          center: {
            latitude: latitude,
            longitude: longitude,
          },
          radius: radius,
        },
        maxAge: maxAge,
      }),
    });
    const data = await response.json();
    return data.verificationResult === 'TRUE';
  }
}

// Tests
beforeEach(() => {
  fetchMock.resetMocks();
});

describe('Device', () => {
  const device = new Device({ publicAddress: '1.1.1.2', privateAddress: '1.1.1.2', publicPort: 80 });

  it('should get location', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({
      longitude: 0.0,
      latitude: 0.0,
      civic_address: {
        country: 'Finland',
        A1: '',
        A2: '',
        A3: '',
        A4: '',
        A5: '',
        A6: '',
      },
    }));

    const location = await device.getLocation(60);

    expect(location.longitude).toBe(0.0);
    expect(location.latitude).toBe(0.0);
    expect(location.civic_address).toBeDefined();
  });

  it('should verify location', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({
      verificationResult: 'TRUE',
    }));

    const result = await device.verifyLocation(19, 47, 10000, 60);

    expect(result).toBe(true);
  });
});
