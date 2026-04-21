import { Locale } from '@/lib/locale/locales';
import Section from '@/components/layout/Section';
import { t } from "@/lib/i18n";
import { IconMail, IconTelephone } from "@/components/icons";
import { getConfig } from "@/lib/storyblok-queries";

interface ServiceBarProps {
	locale: Locale;
}

export default async function ServiceBar({ locale }: ServiceBarProps) {
	const config = await getConfig(locale);
	const telephone = config.telephone;
	const email = config.email;

	return (
		<Section as="nav"
				 variant="capped"
				 outerClassName="bg-gray-90 text-white pt-[env(safe-area-inset-top)]"
				 innerClassName="flex flex-row justify-center sm:justify-end items-center py-2"
				 aria-label={t(locale, 'header.service_bar')}
		>
			<div className="flex flex-row gap-4">
				<a href={`tel:${telephone}`}
				   className="flex flex-row items-center gap-2 text-white transition-colors duration-100 hover:text-primary-light hover:cursor-pointer"
				   title={t(locale, 'generic.telephone', telephone)}
				   aria-label={t(locale, 'generic.telephone', telephone)}
				>
					<IconTelephone className="w-4 h-auto"/>
					<span className="text-sm font-medium">{telephone}</span>
				</a>

				<a href={`mailto:${email}`}
				   className="flex flex-row items-center gap-2 text-white transition-colors duration-100 hover:text-primary-light hover:cursor-pointer"
				   title={t(locale, 'generic.email', email)}
				   aria-label={t(locale, 'generic.email', email)}
				>
					<IconMail className="w-4 h-auto"/>
					<span className="text-sm font-medium">{email}</span>
				</a>
			</div>
		</Section>
	);
}