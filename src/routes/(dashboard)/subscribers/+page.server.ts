import { getSubscribers } from '$lib/api/subscribers';
import { getUnitsLookup } from '$lib/api/dashboard';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// We can pre-load the first page and filters from the server
	const page = Number(url.searchParams.get('page') ?? '1');
	const search = url.searchParams.get('search') ?? '';
	const city = url.searchParams.get('city') ?? '';

	try {
		// Fetch initial data in parallel
		const [subscribersData, lookupsData] = await Promise.all([
			getSubscribers({ page, search, city }),
			getUnitsLookup()
		]);

		return {
			subscribersData,
			lookups: lookupsData
		};
	} catch (error) {
		console.error('Failed to load subscribers page data:', error);
		return {
			subscribersData: { items: [], totalPages: 0, totalItems: 0 },
			lookups: { units: [] },
			error: 'Could not load subscribers.'
		};
	}
};