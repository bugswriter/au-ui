import type { PageServerLoad } from './$types';
import { getInventoryAllocations, type InventoryAllocation } from '$lib/api/inventory';
import { getLookups } from '$lib/api/dashboard';
import { computeConsumptionByCenters, computeRemainingInventory } from '$lib/utils/inventory';
import { getCurrentUser, canViewInventory } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	// Temporarily removing auth check for debugging
	console.log('Inventory page loading...');

	const center = url.searchParams.get('center') ?? undefined;
	const fromDate = url.searchParams.get('fromDate') ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
	const toDate = url.searchParams.get('toDate') ?? new Date().toISOString().split('T')[0];

	console.log('Fetching inventory data...');

	try {
		const [allocationsResp, lookups] = await Promise.all([
			getInventoryAllocations({ center, fromDate, toDate, perPage: 500 }),
			getLookups().catch(() => ({ units: [], cities: [], center_names: [], landmarks: [] }))
		]);
		const allocations: InventoryAllocation[] = allocationsResp.items ?? [];

		// Compute consumption for the same date range (placeholder: needs efficient aggregation)
		const consumption = await computeConsumptionByCenters({ fromDate, toDate, centers: center ? [center] : undefined });

		// Compute remaining inventory per center
		const summaries = await computeRemainingInventory({ asOfDate: toDate, allocations, consumption });

		return {
			allocations,
			summaries,
			lookups,
			filters: { center, fromDate, toDate },
			error: null
		};
	} catch (e: any) {
		console.error('Failed to load inventory:', e);
		return {
			allocations: [],
			summaries: [],
			lookups: null,
			filters: { center: '', fromDate, toDate },
			error: e.message || 'Could not load inventory data'
		};
	}
};
