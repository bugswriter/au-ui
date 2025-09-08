import { API_BASE_URL } from './config';

// Defines the shape of the statistics object from your API
export interface DashboardStats {
	total_subscribers: number;
	total_due_amount: number;
	revenue_this_month: number;
	new_subscribers_this_month: number;
}

// --- UPDATED ---
// Defines the shape of the lookups object to include the new fields
export interface Lookups {
	units: string[];
	cities: string[];
	center_names: string[]; // <-- NEW
	landmarks: string[];    // <-- NEW
}

/**
 * Fetches the main statistics for the dashboard homepage.
 * (No changes needed in this function)
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
 * --- UPDATED & RENAMED ---
 * Fetches lists of unique data for UI dropdowns (units, cities, centers, landmarks).
 * This now fetches all lookups from the API in parallel, replacing the mocked data.
 */
export async function getLookups(): Promise<Lookups> {
	try {
		// Use Promise.all to fetch all lookups concurrently for better performance
		const [unitsResponse, citiesResponse, centersResponse, landmarksResponse] = await Promise.all([
			fetch(`${API_BASE_URL}/lookups/units`),
			fetch(`${API_BASE_URL}/lookups/cities`),
			fetch(`${API_BASE_URL}/lookups/center_names`),
			fetch(`${API_BASE_URL}/lookups/landmarks`)
		]);

		// Check if any of the requests failed
		if (!unitsResponse.ok) throw new Error('Failed to fetch units lookup');
		if (!citiesResponse.ok) throw new Error('Failed to fetch cities lookup');
		if (!centersResponse.ok) throw new Error('Failed to fetch center names lookup');
		if (!landmarksResponse.ok) throw new Error('Failed to fetch landmarks lookup');

		// Parse all JSON responses
		const unitsData = await unitsResponse.json();
		const citiesData = await citiesResponse.json();
		const centersData = await centersResponse.json();
		const landmarksData = await landmarksResponse.json();

		// Combine the results from all responses into a single Lookups object
		return {
			...unitsData,   // Expects { units: [...] }
			...citiesData,  // Expects { cities: [...] }
			...centersData, // Expects { center_names: [...] }
			...landmarksData// Expects { landmarks: [...] }
		};

	} catch (error) {
		console.error("Error fetching lookups:", error);
		// Return a default empty state in case of failure so the UI doesn't crash
		return {
			units: [],
			cities: [],
			center_names: [],
			landmarks: []
		};
	}
}