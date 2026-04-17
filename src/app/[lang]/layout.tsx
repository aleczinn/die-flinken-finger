import { ReactNode } from 'react';
import { availableLanguages, DEFAULT_LOCALE, getLocaleFromLang } from '@/lib/locale/locales';
import { getGlobalConfig } from '@/lib/storyblok-queries';
import { BASE_URL, getActiveAnnouncementBar } from '@/lib/site';
import { getSiteMeta } from '@/lib/site-server';
import { notoSans, notoSerif } from '@/app/fonts';
import SkipLinks from '@/components/layout/SkipLinks';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';

interface LangLayoutProps {
	children: ReactNode;
	params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
	return availableLanguages.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params,}: LangLayoutProps) {
	const { lang } = await params;
	const locale = getLocaleFromLang(lang) ?? DEFAULT_LOCALE;

	const [config, siteMeta] = await Promise.all([
		getGlobalConfig(locale),
		getSiteMeta(locale),
	]);

	const activeBar = getActiveAnnouncementBar(config.announcement_bars ?? []);

	const orgSchema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: siteMeta.name,
		url: BASE_URL,
		logo: `${BASE_URL}/logo.png`,
	};

	const siteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: siteMeta.name,
		url: BASE_URL,
		inLanguage: `${locale.language}-${locale.country}`,
	};

	return (
		<html lang={locale.language}
					className={`${notoSans.variable} ${notoSerif.variable}`}
					data-scroll-behavior="smooth"
		>
			<body className="bg-white subpixel-antialiased flex flex-col w-full min-h-screen">
				<script type="application/ld+json"
								dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
				/>
				<script type="application/ld+json"
								dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
				/>

				<SkipLinks locale={locale} />
				{activeBar && (
					<AnnouncementBar locale={locale} item={activeBar} />
				)}
				<Header locale={locale} />
				{children}
				<Footer locale={locale} />
			</body>
		</html>
	)
}