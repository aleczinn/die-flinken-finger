import ServiceBar from "@/components/layout/ServiceBar";
import { Locale } from '@/lib/locale/locales';
import Section from "@/components/layout/Section";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { IconFullLogo } from "@/components/icons";

interface HeaderProps {
    locale: Locale;
}

export default async function Header({ locale }: HeaderProps) {
    return (
        <>
            <ServiceBar locale={locale}/>

            <header className="sticky top-0 bg-white shadow-xl shadow-gray-90/5 z-50 shrink-0">
                <Section as="div" variant="capped" outerClassName="py-5 bg-white">
                    <div className="flex justify-center sm:justify-start">
                        <Link href="/" className="hover:cursor-pointer"
                              title={t(locale, 'home')}
                              aria-label={t(locale, 'home')}
                        >
                            <IconFullLogo className="w-60 h-auto"/>
                        </Link>
                    </div>
                </Section>
            </header>
        </>
    );
}