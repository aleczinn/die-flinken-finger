import { Locale } from "@/lib/locale/locales";
import { SbBlokData } from "@storyblok/react";
import { storyblokEditable } from "@storyblok/react/rsc";
import Section, { SectionBackground } from "@/components/layout/Section";
import { useId } from "react";
import { Headline } from "@/components/ui/Headline";
import StoryblokRichTextRenderer from "@/components/storyblok/StoryblokRichTextRenderer";
import {
    IconClockOutline,
    IconLocationOutline,
    IconMailOutline,
    IconTelephoneOutline
} from "@/components/icons";
import { getConfig } from "@/lib/storyblok-queries";
import OpeningHours from "@/components/modules/OpeningHours";
import ContactForm from "@/components/modules/ContactForm";
import { t } from "@/lib/i18n";

interface ContactSectionProps {
    locale: Locale;
    blok: SbBlokData & {
        headline: string;
        description?: any;
        dropdown_items: ContactFormDropdownItem[];
    };
    background?: SectionBackground;
}

interface ContactFormDropdownItem {
    label: string;
    value?: string;
}

export default async function ContactSection({ locale, blok, background }: ContactSectionProps) {
    const headingId = useId();
    const config = await getConfig(locale);

    const topics = blok.dropdown_items.map((item) => ({
        label: item.label,
        value: item.value || item.label,
    }));

    const labels = {
        address: t(locale, 'generic.address'),
        telephone: t(locale, 'generic.telephone.short'),
        email: t(locale, 'generic.email.short'),
        opening_hours: t(locale, 'generic.opening_hours')
    }

    return (
        <Section variant="capped"
                 background={background}
                 outerClassName="py-section"
                 innerClassName="grid grid-cols-1 md:grid-cols-2 gap-8"
                 aria-labelledby={blok.headline ? headingId : undefined}
                 {...storyblokEditable(blok)}
        >
            {/* Headline + Text */}
            <div className="flex flex-col">
                {blok.headline && (
                    <Headline id={headingId} as="h2" variant="h3" alignment="left" design="line" className="mb-4">
                        {blok.headline}
                    </Headline>
                )}

                {blok.description && (
                    <StoryblokRichTextRenderer content={blok.description} className="text-gray-70 leading-relaxed mb-8" />
                )}

                <ul className="flex flex-col gap-8">
                    <li className="flex flex-row gap-4">
                        <IconLocationOutline className="p-3 bg-primary-lightest w-12 h-12 rounded-full text-primary" />
                        <div className="flex flex-col">
                            <span className="font-semibold mb-1">{labels.address}</span>
                            <span className="text-gray-70 text-sm">{config.company_name}</span>
                            <span className="text-gray-70 text-sm">{config.address_street_house_number}</span>
                            <span className="text-gray-70 text-sm">{config.address_plz_town}</span>
                        </div>
                    </li>

                    <li className="">
                        <a className="flex flex-row gap-4 focus-element" href={`tel:${config.telephone}`}>
                            <IconTelephoneOutline className="p-3 bg-primary-lightest w-12 h-12 rounded-full text-primary" />
                            <div className="flex flex-col">
                                <span className="font-semibold mb-1">
                                    {labels.telephone}
                                </span>
                                <span className="text-gray-70 text-sm">{config.telephone}</span>
                            </div>
                        </a>
                    </li>

                    <li>
                        <a className="flex flex-row gap-4 focus-element" href={`mailto:${config.email}`}>
                            <IconMailOutline className="p-3 bg-primary-lightest w-12 h-12 rounded-full text-primary" />
                            <div className="flex flex-col">
                            <span className="font-semibold mb-1">
                                {labels.email}
                            </span>
                                <span className="text-gray-70 text-sm">{config.email}</span>
                            </div>
                        </a>
                    </li>

                    <li className="flex flex-row gap-4">
                        <IconClockOutline className="p-3 bg-primary-lightest w-12 h-12 rounded-full text-primary" />
                        <div className="flex flex-col">
                            <span className="font-semibold mb-1">{labels.opening_hours}</span>
                            <OpeningHours locale={locale} items={config?.opening_hours ?? []} className="gap-y-0! text-gray-70 text-sm" />
                        </div>
                    </li>
                </ul>
            </div>

            <ContactForm locale={locale} topics={topics} />
        </Section>
    );
}