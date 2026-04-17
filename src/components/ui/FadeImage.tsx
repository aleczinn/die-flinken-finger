'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

type Props = ImageProps & { skeleton?: boolean };

export function FadeImage({ skeleton = true, className, ...props }: Props) {
	const [loaded, setLoaded] = useState(false);

	return (
		<Image {...props}
					 onLoad={() => setLoaded(true)}
					 className={`${skeleton && !loaded ? 'skeleton-pulse' : ''} transition-opacity duration-200 ease-in ${loaded ? 'opacity-100' : 'opacity-0'} ${className ?? ''}`}
		/>
	);
}