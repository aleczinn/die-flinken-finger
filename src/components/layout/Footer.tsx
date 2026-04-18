import { Locale } from '@/lib/locale/locales';
import Section from "@/components/layout/Section";
import { getConfig } from "@/lib/storyblok-queries";
import { t } from "@/lib/i18n";
import { IconFullLogoLight, IconHome, IconMail, IconTelephone } from "@/components/icons";
import Link from "next/link";

interface FooterProps {
	locale: Locale;
}

export default async function Footer({ locale }: FooterProps) {
	const config = await getConfig(locale);
	const currentYear = new Date().getFullYear();

	return (
		<footer className="flex flex-col text-gray-10 border-t-4 border-solid border-primary">
			<div className="w-full bg-gray-90">
				<Section as="div" variant="capped" className="flex flex-col sm:flex-row justify-center sm:justify-between py-12">
					<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
				            <IconFullLogoLight className="w-48 h-auto mb-4" />

						</div>

                        <div>
							<span className="text-primary text-sm font-bold uppercase mb-2">
								{t(locale, 'footer.navigation.label')}
							</span>
                        </div>

                        <div className="flex flex-col">
							<span className="text-primary text-sm font-bold uppercase mb-4">
								{t(locale, 'footer.contact.label')}
							</span>

                            <ul className="flex flex-col gap-4">
                                <li className="flex flex-row gap-2">
									<div>
										<IconHome className="w-6 h-auto mt-1" />
									</div>

									<div className="flex flex-col">
										<span className="text-sm">{config.company.street} {config.company.house_number}</span>
										<span className="text-sm">{config.company.postal_code} {config.company.town}</span>
									</div>
                                </li>

                                <li className="flex flex-row items-center gap-2">
                                    <IconTelephone className="w-6 h-auto" />
                                    <span className="text-sm">{config.company.telephone}</span>
                                </li>

								<li className="flex flex-row items-center gap-2">
									<IconMail className="w-6 h-auto" />
									<span className="text-sm">{config.company.email}</span>
								</li>
                            </ul>
                        </div>

                        <div>
							<span className="text-primary text-sm font-bold uppercase mb-2">
								{t(locale, 'footer.hours_of_operation.label')}
							</span>
                        </div>
					</div>
				</Section>
			</div>

			<div className="w-full bg-gray-80">
				<Section as="div" variant="capped" className="flex flex-col sm:flex-row justify-center sm:justify-between py-6">
					<div>logo</div>
					<div></div>
					<div></div>
				</Section>
			</div>

			<div className="bg-gray-90">
				<Section as="div" variant="capped" className="flex flex-col sm:flex-row justify-center sm:justify-between py-12 items-center">
					<span className="text-sm">{t(locale, "footer.copyright", currentYear, config.site_name)}</span>

					{/* Social links (Facebook, Instagram etc.) */}
					<div className="flex flex-row gap-2">
						<Link href=""></Link>
					</div>
				</Section>
			</div>
		</footer>
	);
}