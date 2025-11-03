import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req: Request & { clientIp?: string }, res: Response, next: NextFunction) {
    let ip: string | undefined;

    // 1. Try to read from x-forwarded-for (if behind proxy)
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (typeof xForwardedFor === 'string') {
      ip = xForwardedFor.split(',')[0].trim();
    } else {
      ip = req.socket.remoteAddress || '';
    }

    // 2. Normalize IPv6 and localhost formats
    if (
      ip === '::1' || // IPv6 loopback
      ip === '::ffff:127.0.0.1' || // IPv6-mapped IPv4 localhost
      ip === '::ffff:0:0' ||
      ip === '::' ||
      ip?.startsWith('127.')
    ) {
      ip = '127.0.0.1';
    }

    // 3. Remove IPv6 prefix "::ffff:" if any
    if (ip.startsWith('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    // 4. Attach to request
    req.clientIp = ip;

    next();
  }
}
