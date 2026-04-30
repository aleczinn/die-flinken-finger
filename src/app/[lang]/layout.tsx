import { ReactNode } from 'react';
import { availableLanguages, DEFAULT_LOCALE, getLocaleFromLang } from '@/lib/locale/locales';
import { getConfig } from '@/lib/storyblok-queries';
import { BASE_URL } from '@/lib/site';
import { inter, jakartaSans } from '@/app/fonts';
import SkipLinks from '@/components/layout/SkipLinks';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from "@/components/storyblok/ScrollToTop";
import BackToTop from "@/components/layout/BackToTop";

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
	const config = await getConfig(locale);

	const orgSchema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: config.company_name,
		url: BASE_URL,
		logo: `${BASE_URL}/logo.png`,
	};

	const siteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: config.company_name,
		url: BASE_URL,
		inLanguage: `${locale.language}-${locale.country}`,
	};

	return (
		<html lang={locale.language}
					className={`${jakartaSans.variable} ${inter.variable}`}
					data-scroll-behavior="smooth"
		>
			<body className="font-display bg-gray-90 text-gray-90 text-pretty subpixel-antialiased flex flex-col w-full">
				<script type="application/ld+json"
								dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
				/>
				<script type="application/ld+json"
								dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
				/>

				<SkipLinks locale={locale} />
				<ScrollToTop />
				<BackToTop locale={locale} />
				<Header locale={locale} />
				{children}
				<Footer locale={locale} />
			</body>
		</html>
	)
}