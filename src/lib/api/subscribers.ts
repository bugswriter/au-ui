// src/lib/api/subscribers.ts

// --- THE FIX IS HERE ---
// The API_URL should be the BASE URL of your API, without the resource path.
const API_URL = 'https://api.au.shiosayi.org/api';

// The subscriber type itself remains the same
export interface Subscriber {
	id?: string;
	name: string;
	email: string;
	phone: string;
	city?: string;
	plan?: string;
	vendor_name?: string;
	state?: string;
	pincode?: string;
	branch?: string;
	product?: string;
	address?: string;
	erikshaw_no?: string;
	centre_name?: string;
	created?: string;
	updated?: string;
}

export interface PaginatedResult<T> {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: T[];
}

export interface SubscriberQuery {
	page?: number;
	perPage?: number;
	sort?: string;
	search?: string;
	plan?: string;
	city?: string;
	[key: string]: any;
}

// Now this function will build the CORRECT URL: `${API_URL}/subscribers`
export async function getSubscribers(
	query: SubscriberQuery = {}
): Promise<PaginatedResult<Subscriber>> {
	const params = new URLSearchParams();
	
	for (const [key, value] of Object.entries(query)) {
		if (value) {
			params.append(key, value.toString());
		}
	}

    // This now correctly constructs 'https://api.au.shiosayi.org/api/subscribers?...'
	const response = await fetch(`${API_URL}/subscribers?${params.toString()}`);
	if (!response.ok) {
		const errorBody = await response.text(); // Get more details on failure
		console.error("API Error:", errorBody);
		throw new Error('Failed to fetch subscribers');
	}
	return response.json();
}

// All other functions will now also build their URLs correctly.
export async function createSubscriber(data: Omit<Subscriber, 'id'>): Promise<Subscriber> {
	const response = await fetch(`${API_URL}/subscribers`, { // Correct URL
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	if (!response.ok) throw new Error('Failed to create subscriber');
	return response.json();
}

export async function updateSubscriber(id: string, data: Partial<Subscriber>): Promise<Subscriber> {
	const response = await fetch(`${API_URL}/subscribers/${id}`, { // Correct URL
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	if (!response.ok) throw new Error('Failed to update subscriber');
	return response.json();
}

export async function deleteSubscriber(id: string): Promise<void> {
	const response = await fetch(`${API_URL}/subscribers/${id}`, { // Correct URL
		method: 'DELETE'
	});
	if (!response.ok) throw new Error('Failed to delete subscriber');
}