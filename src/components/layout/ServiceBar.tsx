import { Locale } from '@/lib/locale/locales';
import Section from '@/components/layout/Section';
import { t } from "@/lib/i18n";
import { IconMail, IconTelephone } from "@/components/icons";
import { getGlobalConfig } from "@/lib/storyblok-queries";

interface ServiceBarProps {
	locale: Locale;
}

export default async function ServiceBar({ locale }: ServiceBarProps) {
	const config = await getGlobalConfig(locale);
	const telephone = config.telephone.replace(/\s/g, '');
	const email = config.email;

	return (
		<div className="bg-gray-90 text-white">
			<Section as="nav" variant="capped" className="flex flex-row justify-center sm:justify-end items-center py-2" aria-label={t(locale, 'header.service_bar.label')}>
				<div className="flex flex-row gap-4">
					<a href={`tel:${telephone}`}
					   className="flex flex-row items-center gap-2 text-white transition-colors duration-100 hover:text-gray-20 hover:cursor-pointer"
					   title={t(locale, 'header.service_bar.telephone', telephone)}
					   aria-label={t(locale, 'header.service_bar.telephone', telephone)}
					>
						<IconTelephone className="w-4 h-4"/>
						<span>{telephone}</span>
					</a>

					<a href={`mailto:${email}`}
					   className="flex flex-row items-center gap-2 text-white transition-colors duration-100 hover:text-gray-20 hover:cursor-pointer"
					   title={t(locale, 'header.service_bar.email', email)}
					   aria-label={t(locale, 'header.service_bar.email', email)}
					>
						<IconMail className="w-4 h-4"/>
						<span>{email}</span>
					</a>
				</div>
			</Section>
		</div>
	);
}