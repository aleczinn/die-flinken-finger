import Link from 'next/link';
import { BASE_URL } from '@/lib/site';
import { Locale } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import Section from '@/components/layout/Section';
import { getSlugMap, getTitle, PageEntry } from '@/lib/locale/slug-map';

interface BreadcrumbsProps {
	locale: Locale;
	entry: PageEntry;
	items?: BreadcrumbItem[];
	/** LD+JSON Schema nur einmal im DOM rendern */
	includeSchema?: boolean;
}

interface BreadcrumbItem {
	name: string;
	href: string;
}

export async function buildBreadcrumbs(locale: Locale, entry: PageEntry): Promise<BreadcrumbItem[]> {
	const map = await getSlugMap();
	const homeEntry = map.byReal.get('home');

	const crumbs: BreadcrumbItem[] = [
		{
			name: homeEntry ? getTitle(homeEntry, locale.language) : t(locale, 'home'),
			href: `/${locale.language}`,
		},
	];

	// Wenn Startseite dann return direkt
	if (entry.realSlug === 'home') {
		return crumbs;
	}

	const parts = entry.realSlug.split('/');
	let realCum = '';
	let translatedCum = '';

	for (const part of parts) {
		realCum = realCum ? `${realCum}/${part}` : part;
		const current = map.byReal.get(realCum);
		if (!current) continue;

		const segment = current.segments[locale.language] ?? part;
		translatedCum = translatedCum ? `${translatedCum}/${segment}` : segment;

		crumbs.push({
			name: getTitle(current, locale.language),
			href: `/${locale.language}/${translatedCum}`,
		});
	}

	return crumbs;
}

function buildBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbs.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: `${BASE_URL}${item.href}`,
		})),
	};
}

export default async function Breadcrumbs({ locale, entry, items, includeSchema = false }: BreadcrumbsProps) {
	const breadcrumbs = items ?? await buildBreadcrumbs(locale, entry);
	const breadcrumbsSchema = buildBreadcrumbSchema(breadcrumbs);

	return (
		<>
			{includeSchema && (
				<script type="application/ld+json"
								dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
				/>
			)}

			<Section as="nav"
							 variant="full"
							 className="h-16 flex flex-row items-center bg-gray-10"
							 aria-label={t(locale, 'header.navigation.breadcrumb')}
			>
				<ol className="flex flex-wrap items-center gap-2">
					{breadcrumbs.map((item, index) => {
						const isLast = index === breadcrumbs.length - 1;

						return (
							<li key={item.href} className="flex items-center gap-2">
								{index > 0 && (
									<span className="text-sm text-gray-40" aria-hidden="true">|</span>
								)}

								{isLast ? (
									<span className="text-sm font-bold text-gray-90" aria-current="page">
											{item.name}
									</span>
								) : (
									<Link href={item.href} className="text-sm text-gray-90 hover:underline">
										{item.name}
									</Link>
								)}
							</li>
						);
					})}
				</ol>
			</Section>
		</>
	);
}