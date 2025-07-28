const API_URL = 'https://api.au.shiosayi.org/api/subscribers';

export interface Subscriber {
	// PocketBase default fields
	id?: string;
	collectionId?: string;
	collectionName?: string;
	created?: string;
	updated?: string;
	expand?: object;
	// Your custom fields
	name: string;
	phone: string;
	email: string;
	erikshaw_no?: string;
	centre_name?: string;
	vendor_name?: string;
	address?: string;
	pincode?: string;
	city?: string;
	state?: string;
	plan?: string;
	product?: string;
	branch?: string;
	au_poc_id?: string;
}

export const getSubscribers = async (): Promise<Subscriber[]> => {
	const response = await fetch(API_URL);
	if (!response.ok) throw new Error('Failed to fetch subscribers');
	return response.json();
};

export const createSubscriber = async (subscriber: Partial<Subscriber>): Promise<Subscriber> => {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(subscriber)
	});
	if (!response.ok) throw new Error('Failed to create subscriber');
	return response.json();
};

export const updateSubscriber = async (
	id: string,
	subscriber: Partial<Subscriber>
): Promise<Subscriber> => {
	const response = await fetch(`${API_URL}/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(subscriber)
	});
	if (!response.ok) throw new Error('Failed to update subscriber');
	return response.json();
};

export const deleteSubscriber = async (id: string): Promise<void> => {
	const response = await fetch(`${API_URL}/${id}`, {
		method: 'DELETE'
	});
	if (!response.ok) throw new Error('Failed to delete subscriber');
};