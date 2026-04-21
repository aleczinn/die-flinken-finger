const rawBaseURL = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) || 'http://localhost:3000';
export const BASE_URL = rawBaseURL.replace(/\/+$/, '');
export const SITE_SHORTCUT = process.env.NEXT_PUBLIC_SITE_SHORTCUT || 'WS';