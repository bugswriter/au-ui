import { API_BASE_URL } from './config';

// --- TYPE DEFINITIONS ---

// This interface defines the shape of a single Payment Cycle record from your backend.
// It includes the optional 'subscriber_details' for when we 'expand' the subscriber relation.
export interface PaymentCycle {
	id: string;
	subscriber: string; // The ID of the related subscriber
	start_date: string;
	end_date: string;
	amount: number;
	is_due: boolean;
    is_flagged: boolean;
	last_payment: string | null;
	product_code: string;
	note: string | null;
	invoice_link: string | null;
	payment_link: string | null;
	created: string;
	updated: string;
	// This will be populated by the 'expand' query parameter from the API
	subscriber_details?: {
		id: string;
		name: string;
		phone: string;
		unit: string;
		city: string;
	};
}

// This interface defines the shape of the paginated response from the API.
export interface PaginatedPaymentCycles {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: PaymentCycle[];
}


// --- API FUNCTIONS ---

/**
 * Fetches a paginated list of all payment cycles with optional filters.
 * @param params - Optional filter parameters.
 * @returns A promise that resolves to a PaginatedPaymentCycles object.
 */
export async function getPaymentCycles(
	params: {
		page?: number;
		is_due?: boolean | null;
		month?: string; // Format should be "YYYY-MM"
		subscriber?: string; // Filter by a specific subscriber ID
	} = {}
): Promise<PaginatedPaymentCycles> {
	const query = new URLSearchParams();

	if (params.page) query.set('page', params.page.toString());
	if (params.is_due !== null && params.is_due !== undefined) {
		query.set('is_due', String(params.is_due));
	}
	if (params.month) query.set('month', params.month);
	if (params.subscriber) query.set('subscriber', params.subscriber);

	const response = await fetch(`${API_BASE_URL}/payment-cycles?${query.toString()}`);
	if (!response.ok) {
		throw new Error('Failed to fetch payment cycles');
	}
	return response.json();
}

/**
 * Creates a new payment cycle record for a subscriber.
 * @param data - An object containing the data for the new cycle.
 * @returns A promise that resolves to the newly created PaymentCycle object.
 */
export async function createPaymentCycle(data: Partial<PaymentCycle>): Promise<PaymentCycle> {
	const response = await fetch(`${API_BASE_URL}/payment-cycles`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || 'Failed to create payment cycle');
	}
	return response.json();
}

/**
 * Updates an existing payment cycle record.
 * @param id - The ID of the payment cycle to update.
 * @param data - An object containing the fields to update.
 * @returns A promise that resolves to the updated PaymentCycle object.
 */
export async function updatePaymentCycle(id: string, data: Partial<PaymentCycle>): Promise<PaymentCycle> {
	const response = await fetch(`${API_BASE_URL}/payment-cycles/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || 'Failed to update payment cycle');
	}
	return response.json();
}

/**
 * Deletes a payment cycle record from the database.
 * @param id - The ID of the payment cycle to delete.
 * @returns A promise that resolves when the operation is complete.
 */
export async function deletePaymentCycle(id: string): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/payment-cycles/${id}`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		// Even if there's an error, the server might send a JSON body with details.
		try {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to delete payment cycle');
		} catch (e) {
			// If parsing fails, throw a generic error.
			throw new Error('Failed to delete payment cycle');
		}
	}
	// A successful DELETE request typically returns a 204 No Content status, so there's no JSON body to parse.
}