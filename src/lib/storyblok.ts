import 'server-only';
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';
import Page from '@/components/blocks/Page';
import Hero from "@/components/blocks/Hero";
import MediaWithText from "@/components/blocks/MediaWithText";
import PageLegal from "@/components/blocks/PageLegal";
import Accordion from "@/components/blocks/Accordion";
import Banner from "@/components/blocks/Banner";
import ContactForm from "@/components/blocks/ContactForm";
import Grid from "@/components/blocks/Grid";

const cachedFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
	return fetch(input, {
		...init,
		next: {
			/** There is no cache in the development environment, so changes are visible immediately; in the production environment, Next.js revalidates every 60 seconds */
			revalidate: process.env.NODE_ENV === 'development' ? 0 : 60,
		},
	});
};

export const getStoryblokApi = storyblokInit({
	accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
	use: [apiPlugin],
	components: {
		// CONTENT-TYPES
		page: Page,
		page_legal: PageLegal,

		// COMPONENTS
		hero: Hero,
		media_with_text: MediaWithText,
		accordion: Accordion,
		banner: Banner,
		contact_form: ContactForm,
		grid: Grid
	},
	apiOptions: {
		/** Set the correct region for your space. Learn more: https://www.storyblok.com/docs/packages/storyblok-js#example-region-parameter */
		region: process.env.STORYBLOK_REGION || 'eu',
		/** The following code is only required when creating a Storyblok space directly via the Blueprints feature. */
		endpoint: process.env.STORYBLOK_API_BASE_URL
			? `${new URL(process.env.STORYBLOK_API_BASE_URL).origin}/v2`
			: undefined,
		fetch: cachedFetch,
	},
});
