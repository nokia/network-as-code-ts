
interface Device {
    toJSON(): any; // Define toJSON method for Device interface
  }
  
  class LocationVerifyAPI {
    private baseUrl: string;
    private headers: HeadersInit;
  
    constructor(base_url: string, rapid_key: string, rapid_host: string) {
      this.baseUrl = base_url;
      this.headers = {
        "X-RapidAPI-Host": rapid_host,
        "X-RapidAPI-Key": rapid_key,
      };
    }
  
    async verifyLocation(latitude: number, longitude: number, device: Device, radius: number, max_age?: number): Promise<boolean> {
      const body: any = {
        device: device.toJSON(),
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
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
      return data.verificationResult === "TRUE";
    }
  }
  
  class LocationRetrievalAPI {
    private baseUrl: string;
    private headers: HeadersInit;
  
    constructor(base_url: string, rapid_key: string, rapid_host: string) {
      this.baseUrl = base_url;
      this.headers = {
        "X-RapidAPI-Host": rapid_host,
        "X-RapidAPI-Key": rapid_key,
      };
    }
  
    async getLocation(device: Device, max_age?: number): Promise<any> {
      const body: any = { device: device.toJSON() };
  
      if (max_age) {
        body.maxAge = max_age;
      }
  
      const response = await fetch(`${this.baseUrl}/retrieve`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });
  
      // Error handling
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    }
  }
  