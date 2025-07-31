import { getDashboardStats } from '$lib/api/dashboard';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const stats = await getDashboardStats();
		return {
			stats
		};
	} catch (error) {
		console.error('Failed to load dashboard stats:', error);
		return {
			stats: null,
			error: 'Could not load dashboard data.'
		};
	}
};