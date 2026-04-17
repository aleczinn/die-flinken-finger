import { renderRichText } from '@storyblok/react';

interface StoryblokRichTextProps {
	content: any;
}

export default function StoryblokRichText({ content }: StoryblokRichTextProps) {
	return (
		<div className="
			font-sans text-gray-90
			[&_p:not(:last-child)]:mb-2

			[&_ul:not(:last-child)]:mb-2
			[&_ul]:list-disc
			[&_ul]:pl-4

			[&_ol:not(:last-child)]:mb-2
			[&_ol]:list-decimal
			[&_ol]:pl-4

			[&_a]:underline
			[&_a]:text-blue-700
			hover:[&_a]:text-blue-900

			[&_blockquote]:border-l-4
			[&_blockquote]:border-gray-30
			[&_blockquote]:pl-4
			[&_blockquote]:italic
			[&_blockquote]:my-4

			[&_strong]:font-bold
			[&_em]:italic
		"
				 dangerouslySetInnerHTML={{ __html: renderRichText(content) ?? '' }}
		/>
	)
}