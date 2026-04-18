import { Locale } from '@/lib/locale/locales';

interface FooterProps {
	locale: Locale;
}

export default async function Footer({ locale }: FooterProps) {
	const currentYear = new Date().getFullYear();
	const lang = locale?.language;

	return (
		<footer className="pb-24 w-full bg-white">
			footer
		</footer>
	);
}