/**
 * Convert a human readable tag into a URL/file-safe slug.
 * Handles Swedish characters (å, ä, ö) by transliterating them to a, a, o.
 */
export function tagToSlug(tag: string): string {
	return tag
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
