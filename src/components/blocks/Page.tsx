import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';

interface PageProps {
	blok: SbBlokData & {
		body: SbBlokData[];
	};
}

const COMPONENTS_WITH_LCP_IMAGE = new Set(['hero', 'media_with_text']);

export default function Page({ blok }: PageProps) {
	let lcpAssigned = false;

	return (
		<div className="flex flex-col" {...storyblokEditable(blok)}>
			{blok.body?.map((nestedBlok, index) => {
				const isLcpCandidate = !lcpAssigned && COMPONENTS_WITH_LCP_IMAGE.has(nestedBlok.component ?? '');

				if (isLcpCandidate) {
					lcpAssigned = true;
				}

				return (
					<div key={nestedBlok._uid} className={index % 2 !== 0 ? 'bg-white' : ''}>
						<StoryblokServerComponent blok={nestedBlok} priority={isLcpCandidate} />
					</div>
				);
			})}
		</div>
	);
};

