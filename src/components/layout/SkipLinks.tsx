import { Locale } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';

interface SkipLinksProps {
	locale: Locale;
}

export default function SkipLinks({ locale }: SkipLinksProps) {
	const links = [
		{ href: '#main-content', label: t(locale, 'skiplinks.to_main') },
		{ href: '#main-navigation', label: t(locale, 'skiplinks.to_navigation') },
	];

	return (
		<nav aria-label={t(locale, 'skiplinks.label')} className="h-0 overflow-visible">
			<ul className="contents">
				{links.map((link) => (
					<li key={link.href} className="contents">
						<a href={link.href} className="focus-visible-facelift sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-popup focus:bg-gray-90 focus:text-gray-10 focus:px-4 focus:py-2 focus:font-bold focus:rounded">
							{link.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}