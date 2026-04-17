import { MediaKind, StoryblokAsset } from '@/components/storyblok/types';

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)(\?.*)?$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

/**
 * Detects the media kind from a Storyblok asset.
 */
export function detectMediaKind(asset: StoryblokAsset): MediaKind {
	const url = asset.filename ?? '';

	if (asset.is_external_url) {
		if (/youtube\.com|youtu\.be/.test(url)) {
			return 'youtube';
		}

		if (/vimeo\.com/.test(url)) {
			return 'vimeo';
		}
		return 'unknown';
	}

	if (IMAGE_EXT.test(url)) {
		return 'image';
	}

	if (VIDEO_EXT.test(url)) {
		return 'video';
	}
	return 'unknown';
}

export function getYouTubeId(url: string): string | null {
	const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
	return m?.[1] ?? null;
}

export function getVimeoId(url: string): string | null {
	const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
	return m?.[1] ?? null;
}

/**
 * Parst WIDTHxHEIGHT aus dem Storyblok-Pfad.
 * z. B. /f/123/1920x1080/abc/bild.jpg → { width: 1920, height: 1080 }
 */
export function parseStoryblokDimensions(url: string): { width: number; height: number } | null {
	const match = url.match(/\/(\d+)x(\d+)\//);

	if (!match) {
		return null;
	}

	const w = parseInt(match[1], 10);
	const h = parseInt(match[2], 10);
	return w > 0 && h > 0 ? { width: w, height: h } : null;
}

/**
 * Löst die finalen Render-Dimensionen auf.
 * Beispiel: Original 1920×1080, prop width=1280 → height = 720
 */
export function resolveDimensions(propWidth?: number, propHeight?: number, intrinsic?: {
	width: number;
	height: number
} | null): { width: number; height: number } | null {
	if (propWidth && propHeight) {
		return { width: propWidth, height: propHeight };
	}

	const ratio = intrinsic ? intrinsic.height / intrinsic.width : null;

	if (propWidth && ratio) {
		return { width: propWidth, height: Math.round(propWidth * ratio) };
	}

	if (propHeight && ratio && intrinsic) {
		return { width: Math.round(propHeight / ratio), height: propHeight };
	}

	if (intrinsic) {
		return intrinsic;
	}
	return null;
}