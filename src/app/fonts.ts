import localFont from 'next/font/local';

export const jakartaSans = localFont({
	src: [
		{ path: '../../public/fonts/plus-jakarta-sans-v12-latin_latin-ext-regular.woff2', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/plus-jakarta-sans-v12-latin_latin-ext-500.woff2', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/plus-jakarta-sans-v12-latin_latin-ext-600.woff2', weight: '600', style: 'normal' },
		{ path: '../../public/fonts/plus-jakarta-sans-v12-latin_latin-ext-700.woff2', weight: '700', style: 'normal' },
		// { path: '../../public/fonts/plus-jakarta-sans-v12-latin_latin-ext-800.woff2', weight: '800', style: 'normal' },
	],
	variable: '--font-jakarta-sans',
	display: 'swap',
	preload: true,
	fallback: ['Arial', 'Helvetica', 'sans-serif'],
	adjustFontFallback: 'Arial',
});

export const inter = localFont({
	src: [
		{ path: '../../public/fonts/inter-v20-latin_latin-ext-regular.woff2', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/inter-v20-latin_latin-ext-500.woff2', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/inter-v20-latin_latin-ext-600.woff2', weight: '600', style: 'normal' },
		{ path: '../../public/fonts/inter-v20-latin_latin-ext-700.woff2', weight: '700', style: 'normal' },
	],
	variable: '--font-inter',
	display: 'swap',
	preload: true,
	fallback: ['Arial', 'Helvetica', 'sans-serif'],
	adjustFontFallback: 'Arial',
});