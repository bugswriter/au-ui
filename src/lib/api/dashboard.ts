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
	try {
		// Get current month dates
		const now = new Date();
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
		const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

		// Fetch subscribers
		const subscribersResponse = await fetch(`${API_BASE_URL}/collections/subscribers/records?perPage=1000`);
		if (!subscribersResponse.ok) throw new Error('Failed to fetch subscribers');
		const subscribersData = await subscribersResponse.json();
		const subscribers = subscribersData.items || [];

		// Fetch payment cycles
		const paymentCyclesResponse = await fetch(`${API_BASE_URL}/collections/payment_cycles/records?perPage=1000`);
		if (!paymentCyclesResponse.ok) throw new Error('Failed to fetch payment cycles');
		const paymentCyclesData = await paymentCyclesResponse.json();
		const paymentCycles = paymentCyclesData.items || [];

		// Calculate statistics
		const total_subscribers = subscribers.length;

		// Total due amount (sum of amounts where is_due is true)
		const total_due_amount = paymentCycles
			.filter((cycle: any) => cycle.is_due)
			.reduce((sum: number, cycle: any) => sum + (cycle.amount || 0), 0);

		// Revenue this month (sum of amounts with last_payment in current month)
		const revenue_this_month = paymentCycles
			.filter((cycle: any) => cycle.last_payment && cycle.last_payment >= monthStart && cycle.last_payment <= monthEnd)
			.reduce((sum: number, cycle: any) => sum + (cycle.amount || 0), 0);

		// New subscribers this month (count created in current month)
		const new_subscribers_this_month = subscribers
			.filter((sub: any) => sub.created >= monthStart && sub.created <= monthEnd)
			.length;

		return {
			total_subscribers,
			total_due_amount,
			revenue_this_month,
			new_subscribers_this_month
		};
	} catch (error) {
		console.error('Error fetching dashboard stats:', error);
		throw error;
	}
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
		fetch(`${API_BASE_URL}/collections/units/records`),
		fetch(`${API_BASE_URL}/collections/cities/records`),
		fetch(`${API_BASE_URL}/collections/center_names/records`),
		fetch(`${API_BASE_URL}/collections/landmarks/records`)
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