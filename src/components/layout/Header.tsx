import Link from 'next/link';
import { IconBundestagDesktop, IconBundestagMobile } from '@/components/icons';
import ServiceBar from '@/components/layout/ServiceBar';
import Navigation from '@/components/layout/Navigation';
import { Locale } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import Section from '@/components/layout/Section';

interface HeaderProps {
	locale: Locale;
}

export default async function Header({ locale }: HeaderProps) {
	return (
		<header className="shadow-md shadow-gray-20">
			<ServiceBar locale={locale} />

			<Section as="div" variant="full" className="py-5 bg-white">
				<div className="flex justify-center sm:justify-start">
					<Link href="/" className="hover:cursor-pointer" title={t(locale, 'home')} aria-label={t(locale, 'home')}>
						<IconBundestagDesktop className="hidden sm:block" />
						<IconBundestagMobile className="block sm:hidden" />
					</Link>
				</div>
			</Section>

			<Navigation locale={locale} />
		</header>
	);
}