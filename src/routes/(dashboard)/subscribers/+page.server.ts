import type { PageServerLoad } from './$types';
import { getLookups } from '$lib/api/dashboard'; // <-- FIXED: Renamed from getUnitsLookup
import { getSubscribers } from '$lib/api/subscribers';

export const load: PageServerLoad = async ({ url }) => {
	// Extract all possible filter and pagination parameters from the URL
	const page = Number(url.searchParams.get('page') ?? 1);
	const search = url.searchParams.get('search') ?? undefined;
	const city = url.searchParams.get('city') ?? undefined;
	const unit = url.searchParams.get('unit') ?? undefined; // <-- ADDED
	const pincode = url.searchParams.get('pincode') ?? undefined; // <-- ADDED
	const center_name = url.searchParams.get('center_name') ?? undefined; // <-- ADDED
	const landmark = url.searchParams.get('landmark') ?? undefined; // <-- ADDED
	const has_due_payment = url.searchParams.get('has_due_payment') === 'true'; // <-- ADDED

	try {
		// Fetch both the subscriber list and the filter dropdown data in parallel for performance.
		const [subscribersData, lookups] = await Promise.all([
			// Pass all extracted parameters to the API client function
			getSubscribers({
				page,
				search,
				city,
				unit,
				pincode,
				center_name,
				landmark,
				has_due_payment
			}),
			getLookups() // <-- FIXED: Call the correct function
		]);

		// Return the successfully fetched data to the page component
		return {
			subscribersData,
			lookups,
			error: null // Explicitly return no error
		};
	} catch (error: any) {
		// If an error occurs (e.g., the API is down), log it on the server
		console.error('Failed to load subscribers page data:', error);
		
		// And return a structured error object to the page component
		return {
			subscribersData: null,
			lookups: null,
			error: error.message || 'Could not load subscribers.'
		};
	}
};