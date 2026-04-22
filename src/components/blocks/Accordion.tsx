'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import Section, { SectionBackground } from '@/components/layout/Section';
import { Headline, HeadlineDesign } from '@/components/ui/Headline';
import { useState } from 'react';
import { IconPlus } from '@/components/icons';
import StoryblokRichTextRenderer from '@/components/storyblok/StoryblokRichTextRenderer';

type AccordionLayout = 'left' | 'center' | 'right';

interface AccordionItemData extends SbBlokData {
	title: string;
	text: any;
	default_open: boolean;
}

interface AccordionProps {
	blok: SbBlokData & {
		layout: AccordionLayout;
		headline?: string;
		items: AccordionItemData[];
		allow_multiple_open: boolean;
	};
	background?: SectionBackground;
}

export default function Accordion({ blok, background }: AccordionProps) {
	const headingId = `a-${blok._uid}`;

	const defaultOpen = new Set(
		blok.items
			.filter(
				(item): item is AccordionItemData & { _uid: string } =>
					typeof item._uid === 'string' && item.default_open,
			)
			.map((item) => item._uid),
	);

	const [openItems, setOpenItems] = useState<Set<string>>(defaultOpen);

	function toggle(uid: string) {
		setOpenItems((prev) => {
			const next = new Set(blok.allow_multiple_open ? prev : []);

			if (prev.has(uid)) {
				next.delete(uid);
			} else {
				next.add(uid);
			}

			return next;
		});
	}

	let headlineDesign: HeadlineDesign = 'default';
	switch (blok.layout) {
		case 'left':
			headlineDesign = 'line-left';
			break;
		case 'center':
			headlineDesign = 'line-center';
			break;
		case 'right':
			headlineDesign = 'line-right';
			break;
	}

	return (
		<Section variant="capped"
				 background={background}
				 outerClassName="py-section"
				 aria-labelledby={blok.headline ? headingId : undefined}
				 {...storyblokEditable(blok)}
		>
			{blok.headline && (
				<Headline id={headingId} as="h2" variant="h3" design={headlineDesign} className="mb-8">
					{blok.headline}
				</Headline>
			)}

			<div className="flex flex-col">
				{blok.items?.map((item) => {
					if (!item._uid) return null;

					const uid = item._uid;
					const isOpen = openItems.has(uid);

					const buttonId = `acc-btn-${uid}`;
					const panelId = `acc-panel-${uid}`;

					let bgButtonClasses = '';
					switch (background || 'transparent') {
						case "transparent":
							bgButtonClasses = 'border-b-1 border-solid border-gray-30';
							break;
						case "white":
							bgButtonClasses = 'border-b-1 border-solid border-gray-20';
							break;
						case "primary":
							bgButtonClasses = 'bg-white';
							break;
					}

					return (
						<div key={uid} {...storyblokEditable(item)}>
							<h3>
								<button type="button"
												id={buttonId}
												aria-expanded={isOpen}
												aria-controls={panelId}
												onClick={() => toggle(uid)}
												className={`${bgButtonClasses} w-full flex justify-between items-center py-4 text-left font-bold focus-visible-facelift transition-colors duration-300 hover:cursor-pointer hover:text-primary-darkest`}
								>
									<span>{item.title}</span>
									<IconPlus className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
								</button>
							</h3>

							<div id={panelId}
									 role="region"
									 aria-labelledby={buttonId}
									 className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
							>
								<div className="overflow-hidden">
									<div className="pt-6 pb-16">
										<StoryblokRichTextRenderer content={item.text} />
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</Section>
	);
}
