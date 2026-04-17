import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
	const disallow = [
		'/api/',
		'/_next/',
		'/config/'
	];

	return {
		rules: [
			{ userAgent: '*', allow: '/', disallow },

			// Klassische Suchmaschinen (explizit, damit sichtbar)
			{ userAgent: 'Googlebot', allow: '/', disallow },
			{ userAgent: 'Bingbot', allow: '/', disallow },

			// AI-Trainings- und Such-Crawler
			{ userAgent: 'GPTBot', allow: '/', disallow },
			{ userAgent: 'OAI-SearchBot', allow: '/', disallow },
			{ userAgent: 'ChatGPT-User', allow: '/', disallow },
			{ userAgent: 'ClaudeBot', allow: '/', disallow },
			{ userAgent: 'Claude-Web', allow: '/', disallow },
			{ userAgent: 'PerplexityBot', allow: '/', disallow },
			{ userAgent: 'Google-Extended', allow: '/', disallow },
			{ userAgent: 'Applebot-Extended', allow: '/', disallow },
			{ userAgent: 'CCBot', allow: '/', disallow },
			{ userAgent: 'Meta-ExternalAgent', allow: '/', disallow },
		],
		sitemap: `${BASE_URL}/sitemap.xml`,
		host: BASE_URL,
	};
}