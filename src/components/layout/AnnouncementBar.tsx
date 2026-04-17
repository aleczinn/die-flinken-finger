'use client';

import { useState, useEffect } from 'react';
import { renderRichText } from '@storyblok/react';
import { t } from '@/lib/i18n';
import { Locale } from '@/lib/locale/locales';
import Section from '@/components/layout/Section';

export type AnnouncementBarItem = {
	_uid: string;
	enabled: boolean;
	type: string;
	message: any;
	start_date: string;
	end_date: string;
}

interface AnnouncementBarProps {
	locale: Locale;
	item: AnnouncementBarItem;
}

export default function AnnouncementBar({ locale, item }: AnnouncementBarProps) {
	const storageKey = `announcement-dismissed-${item._uid}`;
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const dismissed = sessionStorage.getItem(storageKey);
		if (!dismissed) setVisible(true);
	}, [storageKey]);

	if (!visible) {
		return null;
	}

	const dismiss = () => {
		sessionStorage.setItem(storageKey, '1');
		setVisible(false);
	};

	const colors: Record<string, string> = {
		info: 'bg-[#002C5C] text-gray-10',
		warning: 'bg-[#F7D154] text-gray-90',
	};

	const colorsDismiss: Record<string, string> = {
		info: 'text-gray-10 hover:text-gray-40',
		warning: 'text-gray-90 hover:text-gray-70',
	}

	const titleDismiss = t(locale, 'header.announcement_bar.dismiss');

	return (
		<Section as="div" variant="full" className={`w-full py-2 ${colors[item.type] ?? colors.info}`}>
			<div className="flex flex-row items-center justify-center relative">
				<div className="text-center text-sm md:text-base"
							dangerouslySetInnerHTML={{ __html: renderRichText(item.message) ?? '' }}
				/>

				<button onClick={dismiss}
								title={titleDismiss}
								aria-label={titleDismiss}
								className={`absolute right-0 p-1 hover:cursor-pointer ${colorsDismiss[item.type] ?? colorsDismiss.info}`}
				>
					✕
				</button>
			</div>
		</Section>
	)
}