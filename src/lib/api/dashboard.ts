import { API_BASE_URL } from './config';

// Defines the shape of the statistics object from your API
export interface DashboardStats {
	total_subscribers: number;
	total_due_amount: number;
	revenue_this_month: number;
	new_subscribers_this_month: number;
}

// Defines the shape of the lookups object
export interface Lookups {
	units: string[];
	cities: string[];
}

/**
 * Fetches the main statistics for the dashboard homepage.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
	const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.details || 'Failed to fetch dashboard stats');
	}
	return response.json();
}

/**
 * Fetches lists of unique data for UI dropdowns.
 */
export async function getUnitsLookup(): Promise<Lookups> {
	// This function remains the same, with mocked city data for now.
	const unitsResponse = await fetch(`${API_BASE_URL}/lookups/units`);
	if (!unitsResponse.ok) {
		throw new Error('Failed to fetch units lookup');
	}

	const mockCitiesData = {
		cities: ['Delhi', 'Mumbai', 'Bangalore', 'Hisar', 'Kanpur', 'Prayagraj', 'Varanasi']
	};

	return {
		...(await unitsResponse.json()),
		...mockCitiesData
	};
}