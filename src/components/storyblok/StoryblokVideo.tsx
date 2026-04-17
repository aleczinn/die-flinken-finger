import { StoryblokMediaProps } from '@/components/storyblok/StoryblokMedia';
import { parseStoryblokDimensions, resolveDimensions } from '@/components/storyblok/utils';

type StoryblokVideoProps = Pick<StoryblokMediaProps, 'asset' | 'width' | 'height' | 'captionsSrc' | 'className'> & {
	/** Optionales Poster-Bild (Storyblok Asset URL) */
	posterSrc?: string;
};

export function StoryblokVideo({ asset, width, height, captionsSrc, className, posterSrc }: StoryblokVideoProps) {
	const intrinsic = parseStoryblokDimensions(asset.filename);
	const dims = resolveDimensions(width, height, intrinsic);

	const aspectRatio = dims ? `${dims.width} / ${dims.height}` : '16 / 9';

	return (
		<video controls
					 preload="metadata"
					 className={`bg-gray-20 ${className ?? ''}`}
					 style={{ aspectRatio, width: '100%', height: 'auto' }}
					 aria-label={asset.alt ?? asset.title ?? 'Video'}
		>
			<source src={asset.filename} type="video/mp4" />
			{captionsSrc && (
				<track kind="captions"
							 src={captionsSrc}
							 srcLang="de"
							 label="Deutsch"
							 default
				/>
			)}
		</video>
	);
}