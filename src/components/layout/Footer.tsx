import { IconInstagram, IconLinkedIn, IconWhatsApp, IconYouTube } from '@/components/icons';
import IconMastodon from '@/components/icons/IconMastodon';
import Link from 'next/link';
import Section from '@/components/layout/Section';
import { Locale } from '@/lib/locale/locales';
import { buildLocalizedHref } from '@/lib/locale/links';

interface FooterProps {
	locale: Locale;
}

export default async function Footer({ locale }: FooterProps) {
	const currentYear = new Date().getFullYear();
	const lang = locale?.language;

	// Alle Footer-Links zentral als realSlugs definiert
	const [
		hilfeHref,
		kontaktHref,
		inhaltHref,
		barrierefreiheitHref,
		datenschutzHref,
		impressumHref,
	] = await Promise.all([
		buildLocalizedHref('services/hilfe', lang),
		buildLocalizedHref('services/kontakt', lang),
		buildLocalizedHref('services/inhaltsuebersicht', lang),
		buildLocalizedHref('services/barrierefreiheit', lang),
		buildLocalizedHref('services/datenschutz', lang),
		buildLocalizedHref('services/impressum', lang),
	]);

	return (
		<footer className="pb-24 w-full bg-white">
			<Section as="div" variant="full" className="py-8">
				<div className="flex flex-col items-start md:flex-row justify-between gap-y-8 mb-4">
					<ul className="flex flex-row items-center gap-4 order-1">
						<li>
							<Link className="bt-link-bold" title="Hilfe" href={hilfeHref}>Hilfe</Link>
						</li>

						<li>
							<Link className="bt-link-bold" title="Kontakt" href={kontaktHref}>Kontakt</Link>
						</li>

						<li>
							<Link className="bt-link-bold" title="Inhaltsübersicht" href={inhaltHref}>Inhaltsübersicht</Link>
						</li>
					</ul>

					<ul className="flex flex-row items-center gap-8 font-bold md:order-2">
						<li>
							<a title="Instagram" href="https://www.instagram.com/bundestag/" target="_blank" className="text-sm flex flex-row items-center gap-2">
								<IconInstagram className="w-8 h-8" />
								<span className="hidden lg:block">Instagram</span>
							</a>
						</li>

						<li>
							<a title="LinkedIn" href="https://www.linkedin.com/company/deutscher-bundestag-verwaltung" target="_blank" className="text-sm flex flex-row items-center gap-2">
								<IconLinkedIn className="w-8 h-8" />
								<span className="hidden lg:block">LinkedIn</span>
							</a>
						</li>

						<li>
							<a title="Mastodon" href="https://social.bund.de/@bundestag" target="_blank" className="text-sm flex flex-row items-center gap-2">
								<IconMastodon className=" w-8 h-8" />
								<span className="hidden lg:block">Mastodon</span>
							</a>
						</li>

						<li>
							<a title="WhatsApp" href="https://www.whatsapp.com/channel/0029VaJlSAOGOj9fgM3dAS1p" target="_blank" className="text-sm flex flex-row items-center gap-2">
								<IconWhatsApp className="w-8 h-8" />
								<span className="hidden lg:block">WhatsApp</span>
							</a>
						</li>

						<li>
							<a title="YouTube" href="https://www.youtube.com/bundestag" target="_blank" className="text-sm flex flex-row items-center gap-2">
								<IconYouTube className="w-8 h-8" />
								<span className="hidden lg:block">YouTube</span>
							</a>
						</li>
					</ul>
				</div>

				<div className="flex flex-col md:flex-row justify-between gap-y-3.5">
					<div className="text-sm order-1">© {currentYear} | Deutscher Bundestag</div>

					<ul className="flex flex-row items-center gap-4 md:order-2">
						<li>
							<Link className="bt-link" title="Barrierefreiheit" href={barrierefreiheitHref}>Barrierefreiheit</Link>
						</li>

						<li>
							<Link className="bt-link" title="Datenschutz" href={datenschutzHref}>Datenschutz</Link>
						</li>

						<li>
							<Link className="bt-link" title="Impressum" href={impressumHref}>Impressum</Link>
						</li>
					</ul>
				</div>
			</Section>
		</footer>
	);
}