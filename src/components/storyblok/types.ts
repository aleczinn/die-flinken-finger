export type StoryblokAsset = {
	id: number | null;
	alt: string | null;
	name: string;
	title: string | null;
	source?: string;
	filename: string;
	copyright: string | null;
	fieldtype: 'asset';
	meta_data: Record<string, unknown>;
	is_external_url: boolean;
};

export type MediaKind = 'image' | 'video' | 'youtube' | 'vimeo' | 'unknown';