export const SITE_TITLE = 'Teklas';
export const SITE_DESCRIPTION = 'Serier, konst, bokrecensioner och krönikor';
export const SITE_AUTHOR = 'Teklas';

export const CATEGORIES = {
	cartoon: { label: 'Serier', color: '#e07a5f' },
	art: { label: 'Konst', color: '#81b29a' },
	'book-review': { label: 'Bokrecensioner', color: '#f2cc8f' },
	'opinion-piece': { label: 'Krönikor', color: '#457b9d' },
} as const;

export type Category = keyof typeof CATEGORIES;
