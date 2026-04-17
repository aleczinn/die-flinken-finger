import { AnnouncementBarItem } from '@/components/layout/AnnouncementBar';

export const BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL ||
	process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
	'http://localhost:3000';

export const SITE_SHORTCUT = process.env.NEXT_PUBLIC_SITE_SHORTCUT || 'WS';

export function getActiveAnnouncementBar(items: AnnouncementBarItem[]): AnnouncementBarItem | null {
	if (!items?.length) {
		return null;
	}

	const now = new Date();

	return items.find((item) => {
		if (!item.enabled) {
			return false;
		}
		if (item.start_date && new Date(item.start_date) > now) {
			return false;
		}
		return !(item.end_date && new Date(item.end_date) < now);
	}) ?? null;
}