import { Locale } from '@/lib/locale/locales';
import Section from '@/components/layout/Section';
import { t } from "@/lib/i18n";
import { IconMail, IconTelephone } from "@/components/icons";
import { getConfig } from "@/lib/storyblok-queries";
import { UILink } from "@/components/ui/UILink";

interface ServiceBarProps {
    locale: Locale;
}

export default async function ServiceBar({ locale }: ServiceBarProps) {
    const config = await getConfig(locale);

    return (
        <Section as="nav"
                 variant="capped"
                 outerClassName="bg-gray-90 text-white"
                 innerClassName="flex flex-row justify-center sm:justify-end items-center py-2"
                 aria-label={t(locale, 'header.service_bar')}
        >
            <div className="flex flex-row gap-4">
                <UILink href={`tel:${config.telephone}`}
                        icon={<IconTelephone className="w-4 h-auto" />}
                        aria-label={t(locale, 'generic.telephone.long', config.telephone)}
                >
                    {config.telephone}
                </UILink>

                <UILink href={`mailto:${config.email}`}
                        icon={<IconMail className="w-4 h-auto" />}
                        aria-label={t(locale, 'generic.email.long', config.email)}
                >
                    {config.email}
                </UILink>
            </div>
        </Section>
    );
}