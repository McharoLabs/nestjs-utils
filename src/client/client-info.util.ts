import type { Request } from 'express';
import type { ClientInfo } from './client.type';

export function getClientInfo(req: Request): ClientInfo {
  const forwardedFor = req.headers['x-forwarded-for'];

  const forwardedIps =
    typeof forwardedFor === 'string'
      ? forwardedFor
          .split(',')
          .map((ip) => ip.trim())
          .filter(Boolean)
      : Array.isArray(forwardedFor)
        ? forwardedFor.flatMap((value) =>
            value
              .split(',')
              .map((ip) => ip.trim())
              .filter(Boolean),
          )
        : [];

  const ip = forwardedIps[0] ?? req.ip ?? req.socket.remoteAddress ?? 'unknown';

  return {
    ip,
    ips: forwardedIps.length > 0 ? forwardedIps : [ip],
    userAgent: req.headers['user-agent'] ?? null,
    browserLanguage: req.headers['accept-language'] ?? null,
    referer: req.headers.referer ?? null,
    origin: req.headers.origin ?? null,
    host: req.headers.host ?? null,
    protocol: req.protocol,
    method: req.method,
    path: req.originalUrl,
    isSecure: req.secure,
    forwardedFor:
      typeof forwardedFor === 'string'
        ? forwardedFor
        : Array.isArray(forwardedFor)
          ? forwardedFor.join(', ')
          : null,
  };
}
