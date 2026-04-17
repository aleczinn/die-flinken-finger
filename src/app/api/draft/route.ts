import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const secret = searchParams.get('secret');
	const slug = searchParams.get('slug') ?? '';

	// Secret prüfen, damit nicht jeder Draft Mode aktivieren kann
	if (secret !== process.env.STORYBLOK_PREVIEW_SECRET) {
		return new Response('Invalid secret', { status: 401 });
	}

	const draft = await draftMode();
	draft.enable();

	// Weiterleitung zur angeforderten Seite
	redirect(`/${slug}`);
}