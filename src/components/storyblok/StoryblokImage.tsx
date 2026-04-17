import Image from 'next/image';
import { StoryblokMediaProps } from '@/components/storyblok/StoryblokMedia';
import { parseStoryblokDimensions, resolveDimensions } from '@/components/storyblok/utils';
import { FadeImage } from '@/components/ui/FadeImage';

type Props = Pick<StoryblokMediaProps, 'asset' | 'width' | 'height' | 'priority' | 'className' | 'sizes'>;

const DEFAULT_SIZES = "(max-width: 768px) 100vw, 50vw"

export function StoryblokImage({ asset, width, height, priority, className, sizes }: Props) {
	const intrinsic = parseStoryblokDimensions(asset.filename);
	const dims = resolveDimensions(width, height, intrinsic);
	const alt = asset.alt ?? asset.title ?? '';

	if (dims) {
		const SharedProps = {
			src: asset.filename,
			alt,
			width: dims.width,
			height: dims.height,
			style: { width: '100%', height: 'auto' } as const,
			sizes: sizes ?? DEFAULT_SIZES,
			className,
		};

		// Priority-Bilder: kein Fade nötig, Server Component reicht
		if (priority) {
			return (
				<Image {...SharedProps}
							 priority={priority}
							 fetchPriority="high"
							 className={`bg-gray-20 ${className ?? ''}`}
				/>
			);
		}

		return <FadeImage {...SharedProps} />;
	}

	// Fallback: Keine Dimensionen -> fill-Modus
	return (
		<div className={`relative overflow-hidden skeleton-pulse ${className ?? ''}`}
				 style={{ aspectRatio: '16 / 9', width: '100%' }}
		>
			<Image src={asset.filename}
						 alt={alt}
						 fill
						 priority={priority}
						 sizes={DEFAULT_SIZES}
						 style={{ objectFit: 'cover' }}
			/>
		</div>
	);
}