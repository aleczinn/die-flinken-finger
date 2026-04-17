import { StoryblokAsset } from '@/components/storyblok/types';
import { detectMediaKind } from '@/components/storyblok/utils';
import { StoryblokImage } from '@/components/storyblok/StoryblokImage';
import { StoryblokVideo } from '@/components/storyblok/StoryblokVideo';
import { StoryblokEmbed } from '@/components/storyblok/StoryblokEmbed';

export type StoryblokMediaProps = {
	asset: StoryblokAsset;
	width: number;
	height?: number;
	priority?: boolean;
	className?: string;
	sizes?: string;
	/** Optionale Untertitel-URL (VTT) für lokale Videos */
	captionsSrc?: string;
}

export function StoryblokMedia(props: StoryblokMediaProps) {
	const kind = detectMediaKind(props.asset);

	switch (kind) {
		case 'image':
			return <StoryblokImage {...props} />;
		case 'video':
			return <StoryblokVideo {...props} />
		case 'youtube':
		case 'vimeo':
			return <StoryblokEmbed {...props} provider={kind} />;
		default:
			return null;
	}
}