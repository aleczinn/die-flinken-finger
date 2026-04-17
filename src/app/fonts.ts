import localFont from 'next/font/local';

export const notoSerif = localFont({
	src: [
		{ path: '../../public/fonts/noto-serif-v33-latin_latin-ext-regular.woff2', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/noto-serif-v33-latin_latin-ext-500.woff2', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/noto-serif-v33-latin_latin-ext-600.woff2', weight: '600', style: 'normal' },
		{ path: '../../public/fonts/noto-serif-v33-latin_latin-ext-700.woff2', weight: '700', style: 'normal' },
	],
	variable: '--font-serif-noto',
	display: 'swap',
	preload: true,
	fallback: ['Georgia', 'Times New Roman', 'serif'],
	adjustFontFallback: 'Times New Roman',
});

export const notoSans = localFont({
	src: [
		{ path: '../../public/fonts/noto-sans-display-v30-latin_latin-ext-regular.woff2', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/noto-sans-display-v30-latin_latin-ext-700.woff2', weight: '700', style: 'normal' },
	],
	variable: '--font-sans-noto',
	display: 'swap',
	preload: true,
	fallback: ['Arial', 'Helvetica', 'sans-serif'],
	adjustFontFallback: 'Arial',
});