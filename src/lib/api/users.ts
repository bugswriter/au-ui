import { API_BASE_URL } from './config';

export interface User {
	id?: string;
	name: string;
	email: string;
	unit: string;
	password?: string;
}

export const getUsers = async (): Promise<User[]> => {
	const response = await fetch(`${API_BASE_URL}/collections/users/records`);
	if (!response.ok) throw new Error('Failed to fetch users');
	const data = await response.json();
	return data.items;
};

// --- CORRECTED FUNCTION ---
// Renamed from 'registerUser' to 'createUser' and now points to the correct endpoint.
export const createUser = async (userData: Partial<User>): Promise<User> => {
	const response = await fetch(`${API_BASE_URL}/collections/users/records`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(userData)
	});
	if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
    }
	return response.json();
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
	const response = await fetch(`${API_BASE_URL}/collections/users/records/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(userData)
	});
	if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
    }
	return response.json();
};

export const deleteUser = async (id: string): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/collections/users/records/${id}`, {
		method: 'DELETE'
	});
	if (!response.ok) throw new Error('Failed to delete user');
};