import { API_BASE_URL } from './config';
import type { PaymentCycle } from './payment_cycles'; // Assuming this type exists

// --- UPDATED ---
// Define the Subscriber interface to include the new fields
export interface Subscriber {
	id: string;
	name: string;
	phone: string;
	email: string;
	address: string;
	city: string;
	state: string;
	pincode: string;
	unit: string;
	center_name: string; // <-- NEW
	landmark: string;    // <-- NEW
	created: string;
	updated: string;
}

export interface PaginatedSubscribers {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: Subscriber[];
}

export async function getSubscribers(
	// --- UPDATED ---
	// Add the new optional parameters for filtering
	params: {
		page?: number;
		search?: string;
		city?: string;
		unit?: string;
		pincode?: string;
		center_name?: string; // <-- NEW
		landmark?: string;    // <-- NEW
		has_due_payment?: boolean;
	} = {}
): Promise<PaginatedSubscribers> {
	const query = new URLSearchParams();

	// Set parameters if they exist
	if (params.page) query.set('page', params.page.toString());
	if (params.search) query.set('search', params.search);
	if (params.city) query.set('city', params.city);
	if (params.unit) query.set('unit', params.unit);
	if (params.pincode) query.set('pincode', params.pincode);
	if (params.has_due_payment) query.set('has_due_payment', 'true');
	
	// --- NEW ---
	// Add the new filter parameters to the query string
	if (params.center_name) query.set('center_name', params.center_name);
	if (params.landmark) query.set('landmark', params.landmark);
	// --- END NEW ---

	const response = await fetch(`${API_BASE_URL}/collections/subscribers/records?${query.toString()}`);

	if (!response.ok) {
		// You can add more detailed error handling here if needed
		const errorData = await response.json().catch(() => ({ message: 'Failed to fetch subscribers' }));
		throw new Error(errorData.message || 'An unknown error occurred');
	}

	return response.json();
}

// No changes needed here. `Partial<Subscriber>` will automatically
// include the new fields `center_name` and `landmark`.
export async function createSubscriber(data: Partial<Subscriber>): Promise<Subscriber> {
	const response = await fetch(`${API_BASE_URL}/collections/subscribers/records`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({ message: 'Failed to create subscriber' }));
		throw new Error(errorData.message || 'An unknown error occurred');
	}
	return response.json();
}

// No changes needed here either for the same reason as createSubscriber.
export async function updateSubscriber(id: string, data: Partial<Subscriber>): Promise<Subscriber> {
	const response = await fetch(`${API_BASE_URL}/collections/subscribers/records/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({ message: 'Failed to update subscriber' }));
		throw new Error(errorData.message || 'An unknown error occurred');
	}
	return response.json();
}

export async function deleteSubscriber(id: string): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/collections/subscribers/records/${id}`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		try {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to delete subscriber');
		} catch (e) {
			throw new Error('Failed to delete subscriber');
		}
	}
}

export async function getSubscriberById(id: string): Promise<Subscriber> {
	const response = await fetch(`${API_BASE_URL}/collections/subscribers/records/${id}`);
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({ message: 'Failed to fetch subscriber' }));
		throw new Error(errorData.message || 'Failed to fetch subscriber');
	}
	return response.json();
}

// No changes needed in this function.
export async function getSubscriberPaymentCycles(id: string): Promise<PaymentCycle[]> {
	const response = await fetch(`${API_BASE_URL}/collections/payment_cycles/records?subscriber=${id}`);
	if (!response.ok) {
		throw new Error('Failed to fetch subscriber payment cycles');
	}
	const data = await response.json();
	return data.items;
}