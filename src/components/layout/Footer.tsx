import { Locale } from '@/lib/locale/locales';
import Section from "@/components/layout/Section";
import { getConfig } from "@/lib/storyblok-queries";
import { t } from "@/lib/i18n";
import { IconFullLogoLight, IconHome, IconMail, IconTelephone } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { buildLocalizedHref } from "@/lib/locale/links";
import OpeningHours from "@/components/modules/OpeningHours";

interface FooterProps {
	locale: Locale;
}

export default async function Footer({ locale }: FooterProps) {
	const config = await getConfig(locale);
	const language = locale.language;
	const currentYear = new Date().getFullYear();

	const [
		impressumHref,
		datenschutzHref,
		contactHref,
	] = await Promise.all([
		buildLocalizedHref('impressum', language),
		buildLocalizedHref('datenschutz', language),
		buildLocalizedHref('kontakt', language),
	]);

	const impressumTitle = t(locale, 'footer.impressum');
	const datenschutzTitle = t(locale, 'footer.datenschutz');
	const contactTitle = t(locale, 'footer.contact.contact_us');

	return (
		<footer className="flex flex-col text-gray-10 border-t-4 border-solid border-primary shrink-0 pb-[env(safe-area-inset-bottom)]">
			<div className="w-full bg-gray-90">
				<Section as="div" variant="capped" className="flex flex-col sm:flex-row justify-center sm:justify-between py-16">
					<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-4">
						{/* Kontakt */}
						<div className="flex flex-col">
							<span className="text-primary text-sm font-bold uppercase mb-2">
								{t(locale, 'footer.contact.label')}
							</span>

							<div className="flex flex-col">
								<span className="">{config.site_name.toUpperCase()}</span>
								<span className="">{config.address_street_house_number}</span>
								<span className="">{config.address_plz_town}</span>
							</div>

							<div className="flex-1 min-h-8"></div>

							<div className="flex flex-col gap-2">
								<a href={`tel:${config.telephone}`}
								   className="flex flex-row items-center gap-2 text-gray-10 transition-colors duration-100 hover:text-primary-light hover:cursor-pointer"
								   title={t(locale, 'generic.telephone', config.telephone)}
								   aria-label={t(locale, 'generic.telephone', config.telephone)}
								>
									<IconTelephone className="w-4 h-auto"/>
									<span className="text-sm">{config.telephone}</span>
								</a>

								<a href={`mailto:${config.email}`}
								   className="flex flex-row items-center gap-2 text-gray-10 transition-colors duration-100 hover:text-primary-light hover:cursor-pointer"
								   title={t(locale, 'generic.email', config.email)}
								   aria-label={t(locale, 'generic.email', config.email)}
								>
									<IconMail className="w-4 h-auto"/>
									<span className="text-sm">{config.email}</span>
								</a>
							</div>
						</div>

						{/* Navigation */}
						<div className="hidden lg:flex flex-col">
							<span className="text-primary text-sm font-bold uppercase mb-2">
								{t(locale, 'footer.navigation.label')}
							</span>

							<ul className="">
								<li></li>
							</ul>
                        </div>

						{/* Öffnungszeiten */}
						<div className="flex flex-col">
							<span className="text-primary text-sm font-bold uppercase mb-2">
								{t(locale, 'footer.hours_of_operation.label')}
							</span>

							<OpeningHours locale={locale} items={config.opening_hours ?? []} />
                        </div>
					</div>
				</Section>
			</div>

			{/* Banner */}
			<div className="w-full bg-gray-80">
				<Section as="div" variant="capped" className="flex flex-col lg:flex-row justify-center sm:justify-between items-center py-6 gap-0 lg:gap-8">
					<IconFullLogoLight className="w-48 h-auto mb-4" />

					<span className="font-bold text-lg text-wrap text-center mb-8">Spezialist von hochwertigen Elektroinstallationen im Rhein-Main-Gebiet</span>

					<Button variant="primary" href={contactHref}>
						{contactTitle}
					</Button>
				</Section>
			</div>

			{/* Copyright */}
			<div className="bg-gray-90">
				<Section as="div" variant="capped" className="flex flex-col sm:flex-row justify-center sm:justify-between py-12 items-center">
					<span className="text-sm">{t(locale, "footer.copyright", currentYear, config.site_name)}</span>

					{/* Social links (Facebook, Instagram etc.) */}
					<ul className="flex flex-row gap-2">
						<li>
							<Link href={impressumHref} title={impressumTitle} className="text-sm hover:underline">{impressumTitle}</Link>
						</li>

						<li>
							<Link href={datenschutzHref} title={datenschutzTitle} className="text-sm hover:underline">{datenschutzTitle}</Link>
						</li>
					</ul>
				</Section>
			</div>
		</footer>
	);
}