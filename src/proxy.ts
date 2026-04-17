import { NextRequest, NextResponse } from 'next/server';
import {
	COOKIE_LOCALE,
	DEFAULT_LOCALE,
	findByTag,
	isValidLanguage,
	resolveLocale,
} from '@/lib/locale/locales';

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const segments = pathname.split('/').filter(Boolean);

	// Schon mit gültigem Sprachsegment? Durchlassen, fertig.
	if (isValidLanguage(segments[0])) {
		const response = NextResponse.next();
		response.headers.set('x-pathname', pathname);
		return response;
	}

	// Kein Sprachsegment -> einmaliger Redirect mit Detection
	const cookieTag = request.cookies.get(COOKIE_LOCALE)?.value;
	const fromCookie = cookieTag ? findByTag(cookieTag) : undefined;
	const locale = fromCookie ?? resolveLocale(
		DEFAULT_LOCALE.language,
		request.headers.get('accept-language') ?? '',
	) ?? DEFAULT_LOCALE;

	const url = request.nextUrl.clone();
	url.pathname = `/${locale.language}${pathname}`;
	return NextResponse.redirect(url, { status: 307 });
}

export const config = {
	matcher: ['/((?!_next|api|favicon\\.ico|.*\\..*).*)'],
};