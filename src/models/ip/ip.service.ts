import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IPService {
  constructor() {}

  private localInfo = {
    country: 'Localhost',
    region: 'Development',
    city: 'Local',
  };

  async getIPInfo(ip: string) {
    if (ip === '127.0.0.1') return this.localInfo;

    try {
      const { data } = await axios.get(`https://ipwho.is/${ip}`);

      if (data?.success) {
        return {
          country: data.country,
          region: data.region,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
        };
      } else return this.localInfo;
    } catch (error) {
      return this.localInfo;
    }
  }
}
