import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORIES } from '../consts';

function stripMarkdown(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`([^`]*)`/g, '$1')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/^\s{0,3}#{1,6}\s+/gm, ' ')
		.replace(/^\s{0,3}>\s?/gm, ' ')
		.replace(/[*_~]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

export const GET: APIRoute = async () => {
	const posts = await getCollection('blog');

	const index = posts.map((post) => ({
		id: post.id,
		title: post.data.title,
		description: post.data.description,
		category: post.data.category,
		categoryLabel: CATEGORIES[post.data.category].label,
		pubDate: post.data.pubDate.toISOString(),
		body: stripMarkdown(post.body ?? ''),
	}));

	return new Response(JSON.stringify(index), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});
};
