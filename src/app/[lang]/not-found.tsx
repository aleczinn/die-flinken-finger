'use client';

import { DEFAULT_LOCALE, getLocaleFromLang } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import { usePathname } from "next/navigation";

export default function NotFound() {
	const pathname = usePathname();
	const lang = pathname.split('/').filter(Boolean)[0] ?? '';
	const locale = getLocaleFromLang(lang) ?? DEFAULT_LOCALE;

	return (
		<main className="flex-1 flex flex-col justify-center items-center min-h-[70vh]">
			<h1 className="text-7xl mb-8">
				<span className="font-bold">404</span> – {t(locale, '404.title')}
			</h1>
			<Link href="/public" className="underline hover:text-blue-400">
				{t(locale, '404.backhome')}
			</Link>
		</main>
	);
}