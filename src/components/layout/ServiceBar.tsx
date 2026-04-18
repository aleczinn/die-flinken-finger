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

	return (
		<div className="bg-gray-90 text-white">
			<Section as="nav" variant="capped" className="flex flex-row justify-center sm:justify-end items-center py-2" aria-label={t(locale, 'header.service_bar')}>
				<div className="flex flex-row gap-4">
					<a href={`tel:${telephone}`}
					   className="flex flex-row items-center gap-2 text-white transition-colors duration-100 hover:text-gray-20 hover:cursor-pointer"
					>
						<IconTelephone className="w-4 h-4"/>
						<span>0123 4567890</span>
					</a>

					<a href={`mailto:${config.email}`}
					   className="flex flex-row items-center gap-2 text-white transition-colors duration-100 hover:text-gray-20 hover:cursor-pointer"
					>
						<IconMail className="w-4 h-4"/>
						<span>info@flinke-finger.de</span>
					</a>
				</div>
			</Section>
		</div>
	);
}