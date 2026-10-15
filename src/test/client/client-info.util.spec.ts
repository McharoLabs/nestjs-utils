import { describe, expect, it } from '@jest/globals';
import type { Request } from 'express';
import type { ClientInfo } from '../../client/client.type';
import { getClientInfo } from '../../client/client-info.util';

describe('getClientInfo', () => {
  const createRequest = (overrides: Partial<Request> = {}): Request =>
    ({
      headers: {},
      ip: '192.168.1.10',
      socket: {
        remoteAddress: '192.168.1.20',
      },
      protocol: 'https',
      method: 'GET',
      originalUrl: '/api/users',
      secure: true,
      ...overrides,
    }) as Request;

  it('should return client information from the request', () => {
    const req = createRequest({
      headers: {
        'user-agent': 'Mozilla/5.0',
        'accept-language': 'en-US,en;q=0.9',
        referer: 'https://example.com',
        origin: 'https://example.com',
        host: 'api.example.com',
      },
    });

    const result: ClientInfo = getClientInfo(req);

    expect(result).toEqual({
      ip: '192.168.1.10',
      ips: ['192.168.1.10'],
      userAgent: 'Mozilla/5.0',
      browserLanguage: 'en-US,en;q=0.9',
      referer: 'https://example.com',
      origin: 'https://example.com',
      host: 'api.example.com',
      protocol: 'https',
      method: 'GET',
      path: '/api/users',
      isSecure: true,
      forwardedFor: null,
    });
  });

  it('should use the first forwarded IP as the client IP', () => {
    const req = createRequest({
      headers: {
        'x-forwarded-for': '203.0.113.10, 10.0.0.1, 10.0.0.2',
      },
    });

    const result = getClientInfo(req);

    expect(result.ip).toBe('203.0.113.10');
    expect(result.ips).toEqual(['203.0.113.10', '10.0.0.1', '10.0.0.2']);
    expect(result.forwardedFor).toBe('203.0.113.10, 10.0.0.1, 10.0.0.2');
  });

  it('should trim forwarded IPs and remove empty entries', () => {
    const req = createRequest({
      headers: {
        'x-forwarded-for': ' 203.0.113.10, , 10.0.0.1 , ',
      },
    });

    const result = getClientInfo(req);

    expect(result.ip).toBe('203.0.113.10');
    expect(result.ips).toEqual(['203.0.113.10', '10.0.0.1']);
    expect(result.forwardedFor).toBe(' 203.0.113.10, , 10.0.0.1 , ');
  });

  it('should support an array of forwarded-for header values', () => {
    const req = createRequest({
      headers: {
        'x-forwarded-for': ['203.0.113.10, 10.0.0.1', '198.51.100.5'],
      },
    });

    const result = getClientInfo(req);

    expect(result.ip).toBe('203.0.113.10');
    expect(result.ips).toEqual(['203.0.113.10', '10.0.0.1', '198.51.100.5']);
    expect(result.forwardedFor).toBe('203.0.113.10, 10.0.0.1, 198.51.100.5');
  });

  it('should fall back to req.ip when no forwarded IP is available', () => {
    const req = createRequest({
      headers: {
        'x-forwarded-for': ' , ',
      },
      ip: '192.168.1.10',
    });

    const result = getClientInfo(req);

    expect(result.ip).toBe('192.168.1.10');
    expect(result.ips).toEqual(['192.168.1.10']);
  });

  it('should fall back to the socket remote address when req.ip is undefined', () => {
    const req = createRequest({
      ip: undefined,
      socket: {
        remoteAddress: '192.168.1.20',
      } as Request['socket'],
    });

    const result = getClientInfo(req);

    expect(result.ip).toBe('192.168.1.20');
    expect(result.ips).toEqual(['192.168.1.20']);
  });

  it('should use unknown when no client IP is available', () => {
    const req = createRequest({
      ip: undefined,
      socket: {
        remoteAddress: undefined,
      } as Request['socket'],
    });

    const result = getClientInfo(req);

    expect(result.ip).toBe('unknown');
    expect(result.ips).toEqual(['unknown']);
  });

  it('should return null for optional headers that are absent', () => {
    const req = createRequest();

    const result = getClientInfo(req);

    expect(result.userAgent).toBeNull();
    expect(result.browserLanguage).toBeNull();
    expect(result.referer).toBeNull();
    expect(result.origin).toBeNull();
    expect(result.host).toBeNull();
    expect(result.forwardedFor).toBeNull();
  });

  it('should preserve request protocol, method, path, and security status', () => {
    const req = createRequest({
      protocol: 'http',
      method: 'POST',
      originalUrl: '/api/users?page=2',
      secure: false,
    });

    const result = getClientInfo(req);

    expect(result.protocol).toBe('http');
    expect(result.method).toBe('POST');
    expect(result.path).toBe('/api/users?page=2');
    expect(result.isSecure).toBe(false);
  });
});
