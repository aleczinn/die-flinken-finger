import ServiceBar from "@/components/layout/ServiceBar";
import { Locale } from '@/lib/locale/locales';

interface HeaderProps {
	locale: Locale;
}

export default async function Header({ locale }: HeaderProps) {
	return (
		<header className="">
			<ServiceBar locale={locale} />
		</header>
	);
}