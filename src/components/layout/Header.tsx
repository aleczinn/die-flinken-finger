import ServiceBar from "@/components/layout/ServiceBar";
import { availableLanguages, Locale } from '@/lib/locale/locales';
import Section from "@/components/layout/Section";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { IconFullLogo } from "@/components/icons";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import { getSlugMap, translatePath } from "@/lib/locale/slug-map";

interface HeaderProps {
    locale: Locale;
}

export default async function Header({ locale }: HeaderProps) {
    const map = await getSlugMap();
    const byTranslated: Record<string, Record<string, string>> = {};
    for (const lang of availableLanguages) {
        byTranslated[lang] = Object.fromEntries(map.byTranslated[lang]);
    }
    const pathsByReal: Record<string, Record<string, string>> = {};
    for (const entry of map.byReal.values()) {
        pathsByReal[entry.realSlug] = {};
        for (const lang of availableLanguages) {
            pathsByReal[entry.realSlug][lang] = translatePath(map.byReal, entry.realSlug, lang);
        }
    }

    return (
        <>
            <ServiceBar locale={locale}/>

            <header className="sticky top-0 bg-white shadow-xl shadow-gray-90/5 z-50 shrink-0">
                <Section as="div"
                         variant="capped"
                         outerClassName="py-4 bg-white"
                         innerClassName="flex flex-row justify-between items-center"
                >
                    <Link href="/" className="hover:cursor-pointer"
                          title={t(locale, 'home')}
                          aria-label={t(locale, 'home')}
                    >
                        <IconFullLogo className="w-60 h-auto"/>
                    </Link>

                    <div>
                        navigation
                    </div>

                    <div>
                        <LocaleSwitcher locale={locale} alternates={{ byTranslated, pathsByReal }} />
                    </div>
                </Section>
            </header>
        </>
    );
}