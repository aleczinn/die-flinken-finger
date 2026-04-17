'use client';

import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import { renderRichText, SbBlokData } from '@storyblok/react';
import Section from '@/components/layout/Section';
import { Headline } from '@/components/ui/Headline';
import { useState } from 'react';
import { IconPlus } from '@/components/icons';
import StoryblokRichText from '@/components/storyblok/StoryblokRichText';

interface AccordionItemData extends SbBlokData {
	title: string;
	text: any;
	default_open: boolean;
}

interface AccordionProps {
	blok: SbBlokData & {
		headline?: string;
		items: AccordionItemData[];
		allow_multiple_open: boolean;
	};
}

export default function Accordion({ blok }: AccordionProps) {
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

	return (
		<Section variant="capped"
						 className="py-16"
						 aria-labelledby={blok.headline ? headingId : undefined}
						 {...storyblokEditable(blok)}
		>
			{blok.headline && (
				<Headline id={headingId} as="h2" variant="h3" className="mb-4">
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

					return (
						<div key={uid} {...storyblokEditable(item)}>
							<h3>
								<button type="button"
												id={buttonId}
												aria-expanded={isOpen}
												aria-controls={panelId}
												onClick={() => toggle(uid)}
												className="w-full flex justify-between items-center px-6 py-4 text-left font-bold focus-visible-facelift bg-gray-20 transition-colors duration-300 hover:bg-gray-30 hover:cursor-pointer mb-4 hover:underline"
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
									<div className="px-8 py-4 bg-gray-10 mb-12">
										<StoryblokRichText content={item.text} />
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
