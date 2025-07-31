import { API_BASE_URL } from './config';
import type { PaymentCycle } from './payment_cycles'; // Assuming this type exists

// Define the types for our data for type safety
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
	params: {
		page?: number;
		search?: string;
		city?: string;
		unit?: string;
		has_due_payment?: boolean;
		pincode?: string;
	} = {}
): Promise<PaginatedSubscribers> {
	const query = new URLSearchParams();
	if (params.page) query.set('page', params.page.toString());
	if (params.search) query.set('search', params.search);
	if (params.city) query.set('city', params.city);
	if (params.unit) query.set('unit', params.unit);
	if (params.has_due_payment) query.set('has_due_payment', 'true');
	if (params.pincode) query.set('pincode', params.pincode);

	const response = await fetch(`${API_BASE_URL}/subscribers?${query.toString()}`);

	// --- THIS IS THE MISSING CODE ---

	// 1. Check if the request was successful
	if (!response.ok) {
		throw new Error('Failed to fetch subscribers');
	}

	// 2. Parse the JSON body and RETURN the result.
	// This fulfills the function's promise to return a PaginatedSubscribers object.
	return response.json();
}

export async function createSubscriber(data: Partial<Subscriber>): Promise<Subscriber> {
	const response = await fetch(`${API_BASE_URL}/subscribers`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		throw new Error('Failed to create subscriber');
	}
	return response.json();
}

export async function updateSubscriber(id: string, data: Partial<Subscriber>): Promise<Subscriber> {
	const response = await fetch(`${API_BASE_URL}/subscribers/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		throw new Error('Failed to update subscriber');
	}
	return response.json();
}

export async function getSubscriberPaymentCycles(id: string): Promise<PaymentCycle[]> {
	const response = await fetch(`${API_BASE_URL}/subscribers/${id}/payment-cycles`);
	if (!response.ok) {
		throw new Error('Failed to fetch subscriber payment cycles');
	}
	return response.json();
}