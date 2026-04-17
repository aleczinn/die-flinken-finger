'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { StoryblokMediaProps } from '@/components/storyblok/StoryblokMedia';
import { getYouTubeId, getVimeoId, resolveDimensions } from '@/components/storyblok/utils';
import { IconPlay, IconYouTube } from '@/components/icons';

type Props = Pick<StoryblokMediaProps, 'asset' | 'width' | 'height' | 'className'> & {
	provider: 'youtube' | 'vimeo';
};

export function StoryblokEmbed({ asset, width, height, className, provider }: Props) {
	const [activated, setActivated] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const id = provider === 'youtube' ? getYouTubeId(asset.filename) : getVimeoId(asset.filename);

	useEffect(() => {
		if (activated) iframeRef.current?.focus();
	}, [activated]);

	if (!id) {
		return null;
	}

	const title = asset.title ?? asset.alt ?? `${provider}-Video`;
	// Embeds haben nie intrinsische Dimensionen -> Fallback 16:9
	const dims = resolveDimensions(width, height, null) ?? { width: 16, height: 9 };
	const aspectRatio = `${dims.width} / ${dims.height}`;

	const thumbnail = provider === 'youtube'
		? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
		: null; // Vimeo: siehe Hinweis unten

	const embedSrc = provider === 'youtube'
			? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
			: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`;

	if (activated) {
		return (
			<div aria-live="polite">
				<iframe ref={iframeRef}
								src={embedSrc}
								title={title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className={`border-0 ${className ?? ''}`}
								style={{ aspectRatio, width: '100%', height: 'auto' }}
				/>
			</div>
		);
	}

	return (
		<button type="button"
						onClick={() => setActivated(true)}
						className={`focus-visible-facelift group block cursor-pointer ${className ?? ''}`}
						title={`Video abspielen: ${title}`}
						aria-label={`Video abspielen: ${title}`}
						style={{ aspectRatio, width: '100%' }}
		>
			<div className="relative w-full h-full overflow-hidden rounded-[inherit]">
				{thumbnail ? (
					<img src={thumbnail}
							 alt=""
							 loading="lazy"
							 decoding="async"
							 className="absolute inset-0 h-full w-full object-cover"
					/>
				) : (
					<div className="absolute inset-0 skeleton-pulse" />
				)}

				<span
					className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-black/30"
					aria-hidden="true"
				>
					{provider === 'youtube' ? (
							<span className="flex w-20 items-center justify-center text-gray-90/80 transition-colors duration-200 group-hover:text-youtube-red">
								<IconYouTube className="w-full h-full" />
							</span>
					) : (
						<span className="flex w-16 h-16 items-center justify-center rounded-full bg-gray-90/80 transition-transform duration-200 motion-safe:group-hover:scale-110">
							<IconPlay className="ml-1 h-8 w-8 text-gray-10" />
						</span>
					)}
    		</span>
			</div>
		</button>
	)
}