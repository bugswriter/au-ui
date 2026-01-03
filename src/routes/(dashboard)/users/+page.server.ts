import type { PageServerLoad } from './$types';
import { getLookups } from '$lib/api/dashboard';
import { getPocUsers, type PocUser } from '$lib/api/poc';
import { getCurrentUser, isAdmin } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// Temporarily removing auth check for debugging
	console.log('AU POC page loading...');
	console.log('Fetching POC data...');

	try {
		const [users, lookups] = await Promise.all([
			getPocUsers(),
			getLookups().catch(() => ({ units: [], cities: [], center_names: [], landmarks: [] }))
		]);
		return { users, lookups, error: null };
	} catch (e: any) {
		console.error('Failed to load AU POCs:', e);
		return { users: null, lookups: null, error: e.message || 'Could not load POCs' };
	}
};
