export default function storyblokImageLoader({ src, width, quality }: {
	src: string;
	width: number;
	quality?: number;
}): string {
	if (!src.includes('a.storyblok.com')) {
		return src;
	}

	const match = src.match(/\/(\d+)x(\d+)\//);
	const originalWidth = match ? parseInt(match[1], 10) : Infinity;
	const cappedWidth = Math.min(width, originalWidth); // Nie größer als das Original anfordern

	return `${src}/m/${cappedWidth}x0/filters:format(avif):quality(${quality ?? 65})`;
}