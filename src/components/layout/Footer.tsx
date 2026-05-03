import { Locale } from '@/lib/locale/locales';
import Section from "@/components/layout/Section";
import { getConfig, NavigationLink } from "@/lib/storyblok-queries";
import { t } from "@/lib/i18n";
import {
	IconChevronRight,
	IconFullLogoLight,
	IconMail,
	IconTelephone
} from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { buildLocalizedHref, resolveStoryblokLink } from "@/lib/locale/links";
import OpeningHours from "@/components/modules/OpeningHours";
import { storyblokEditable } from "@storyblok/react/rsc";
import { Tagline } from "@/components/ui/Tagline";
import { MyLink } from "@/components/ui/MyLink";

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

	const navigation = await Promise.all(
		(config.footer_navigation ?? []).map(async (item: NavigationLink) => ({
			uid: item._uid,
			label: item.label,
			href: await resolveStoryblokLink(item.link, language),
			editable: storyblokEditable(item),
		})),
	);

	return (
		<footer className="flex flex-col text-gray-10 border-t-4 border-solid border-primary shrink-0">
			<Section as="div"
					 variant="capped"
					 outerClassName="bg-gray-90"
					 innerClassName="flex flex-col sm:flex-row justify-center sm:justify-between py-16"
			>
				<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-x-4 lg:gap-4">
					{/* Kontakt */}
					<div className="flex flex-col">
						<Tagline alignment="left" children={t(locale, 'footer.contact.label')} className="font-bold! mb-2" />

						<div className="flex flex-col">
							<span className="font-semibold">{config.company_name.toUpperCase()}</span>
							<span className="">{config.address_street_house_number}</span>
							<span className="">{config.address_plz_town}</span>
						</div>

						<div className="flex-1 min-h-8"></div>

						<div className="flex flex-col gap-2">
							<MyLink href={`tel:${config.telephone}`}
									icon={<IconTelephone className="w-4 h-auto" />}
									aria-label={t(locale, 'generic.telephone.long', config.telephone)}
							>
								{config.telephone}
							</MyLink>

							<MyLink href={`mailto:${config.email}`}
									icon={<IconMail className="w-4 h-auto" />}
									aria-label={t(locale, 'generic.email.long', config.email)}
							>
								{config.email}
							</MyLink>
						</div>
					</div>

					{/* Navigation */}
					<div className="flex flex-col">
						<Tagline alignment="left" children={t(locale, 'footer.navigation.label')} className="font-bold! mb-2" />

						<ul className="flex flex-col gap-2">
							{navigation.map((item) => {
								if (!item.href) return null;

								return (
									<li key={item.uid} {...item.editable}>
										<Link href={item.href}
											  title={`${item.label}`}
											  className="group flex flex-row items-center gap-2 w-fit text-gray-10 transition-colors duration-200 hover:text-primary focus-element"
										>
											<IconChevronRight className="w-4 h-auto" />
											<span className="">
												{item.label}
											</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</div>

					{/* Öffnungszeiten */}
					<div className="flex flex-col">
						<Tagline alignment="left" children={t(locale, 'footer.hours_of_operation.label')} className="font-bold! mb-2" />

						<OpeningHours locale={locale} items={config.opening_hours ?? []} />
					</div>
				</div>
			</Section>

			{/* Banner */}
			<Section as="div"
					 variant="capped"
					 outerClassName="bg-gray-80"
					 innerClassName="flex flex-row flex-wrap justify-between items-center py-6 gap-0 lg:gap-8"
			>
				<IconFullLogoLight className="w-48 h-auto mb-4" />

				{/*<span className="font-bold text-lg text-wrap text-center mb-8 lg:mb-0">Hier könnte ein Werbetext stehen</span>*/}

				<Button variant="primary" href={contactHref}>
					{contactTitle}
				</Button>
			</Section>

			{/* Copyright */}
			<Section as="div"
					 variant="capped"
					 outerClassName="bg-gray-90 pb-[calc(3rem+env(safe-area-inset-bottom))] lg:pb-[env(safe-area-inset-bottom)]"
					 innerClassName="flex flex-col md:flex-row justify-center sm:justify-between gap-2 py-12 items-center"
			>
				<span className="text-sm text-center order-2 md:order-1 md:text-left">{t(locale, "footer.copyright", currentYear, config.company_name)}</span>

				{/* Social links (Facebook, Instagram etc.) */}
				<ul className="flex flex-row gap-2 order-1 md:order-2">
					<li>
						<Link href={impressumHref} title={impressumTitle} className="text-sm hover:underline focus-element">{impressumTitle}</Link>
					</li>

					<li>
						<Link href={datenschutzHref} title={datenschutzTitle} className="text-sm hover:underline focus-element">{datenschutzTitle}</Link>
					</li>
				</ul>
			</Section>
		</footer>
	);
}