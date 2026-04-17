import { DEFAULT_LOCALE, getLocaleFromLang } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import { headers } from 'next/headers';

export default async function NotFound() {
	const headersList = await headers();
	const pathname = headersList.get('x-pathname') ?? '';
	const lang = pathname.split('/').filter(Boolean)[0];
	const locale = getLocaleFromLang(lang ?? '') ?? DEFAULT_LOCALE;

	return (
		<main className="flex-1 flex flex-col justify-center items-center">
			<h1 className="text-7xl mb-8">
				<span className="font-bold">404</span> – {t(locale, '404.title')}
			</h1>
			<Link href="/public" className="underline hover:text-blue-400">
				{t(locale, '404.backhome')}
			</Link>
		</main>
	);
}