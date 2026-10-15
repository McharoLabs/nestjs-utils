export interface ClientInfo {
  ip: string;
  ips: string[];
  userAgent: string | null;
  browserLanguage: string | null;
  referer: string | null;
  origin: string | null;
  host: string | null;
  protocol: string;
  method: string;
  path: string;
  isSecure: boolean;
  forwardedFor: string | null;
}
