/** @type {import('next').NextConfig} */
const nextConfig = {
	// The following environment variables can be safely exposed to the public bundle.
	// The Storyblok public access token is required for features like live preview.
	env: {
		STORYBLOK_DELIVERY_API_TOKEN: process.env.STORYBLOK_DELIVERY_API_TOKEN,
		STORYBLOK_API_BASE_URL: process.env.STORYBLOK_API_BASE_URL,
		STORYBLOK_REGION: process.env.STORYBLOK_REGION,
	},
	images: {
		deviceSizes: [640, 750, 828, 1080, 1200, 1366, 1536, 1920, 2048, 3840],
		loaderFile: './src/lib/storyblokImageLoader.ts',
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'a.storyblok.com',
			},
		],
	},
	experimental: {
		inlineCss: true,
	}
};

export default nextConfig;
