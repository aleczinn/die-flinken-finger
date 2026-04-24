import ServiceBar from "@/components/layout/ServiceBar";
import { availableLanguages, Locale } from '@/lib/locale/locales';
import Section from "@/components/layout/Section";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { IconFullLogo } from "@/components/icons";
import LocaleSwitcher from "@/components/layout/header/LocaleSwitcher";
import { getSlugMap, translatePath } from "@/lib/locale/slug-map";
import { getConfig } from "@/lib/storyblok-queries";
import { resolveNavigationItem } from "@/lib/locale/navigation";
import DesktopNavigation from "@/components/layout/header/DesktopNavigation";
import MobileNavigation from "@/components/layout/header/MobileNavigation";

interface HeaderProps {
    locale: Locale;
}

export default async function Header({ locale }: HeaderProps) {
    const config = await getConfig(locale);
    const language = locale.language;

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

    const navigation = await Promise.all(
        (config.header_navigation ?? []).map((item) => resolveNavigationItem(item, language)),
    );

    const localeSwitcher = (
        <LocaleSwitcher locale={locale} alternates={{ byTranslated, pathsByReal }} />
    );

    return (
        <header className="shadow-xl shadow-gray-90/5 z-50 shrink-0">
            <ServiceBar locale={locale}/>

            <Section as="div"
                     variant="capped"
                     outerClassName="py-4 bg-white"
                     innerClassName="flex flex-row justify-between items-center"
            >
                <Link href="/" className="hover:cursor-pointer focus-visible-facelift"
                      title={t(locale, 'home')}
                      aria-label={t(locale, 'home')}
                >
                    <IconFullLogo className="w-40 sm:w-48 md:w-56 lg:w-60 h-auto"/>
                </Link>

                <DesktopNavigation locale={locale} items={navigation} />

                <div className="hidden lg:block">
                    {localeSwitcher}
                </div>

                <MobileNavigation locale={locale}
                                  items={navigation}
                                  localeSwitcher={localeSwitcher}
                />
            </Section>
        </header>
    );
}