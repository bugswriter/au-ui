import { API_BASE_URL } from './config';

export interface DashboardStats {
	total_subscribers: number;
	total_due_amount: number;
	revenue_this_month: number;
	new_subscribers_this_month: number;
}


// src/lib/api/dashboard.ts
// ...

export interface Lookups {
	units: string[];
    cities: string[]; // <-- ADD THIS
}

export async function getUnitsLookup(): Promise<Lookups> {
	// In a real app, you might have a separate endpoint for cities.
	// For now, we'll mock it with some sample data.
	const units = await fetch(`${API_BASE_URL}/lookups/units`);
    if (!units.ok) throw new Error('Failed to fetch units lookup');
    
    // MOCK DATA for cities
    const citiesData = { cities: ["Delhi", "Mumbai", "Bangalore", "Hisar", "Kanpur", "Prayagraj", "Varanasi"] };

	return {
        ...(await units.json()),
        ...citiesData
    };
}