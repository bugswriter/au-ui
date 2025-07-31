import { writable, derived, type Readable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { API_BASE_URL } from '$lib/api/config';

// Define the User type to match the data coming from your API
export interface User {
	id: string;
	name: string;
	email: string;
	unit: string;
    initial?: string; // We can add this on the client
}

// --- Helper function to get initial state from localStorage ---
function getInitialUser(): User | null {
	if (!browser) return null; // Can't access localStorage on server

	const storedUser = localStorage.getItem('user');
	if (storedUser) {
		return JSON.parse(storedUser);
	}
	return null;
}

// --- SVELTE STORES ---

// The main store holding the logged-in user's data
export const user = writable<User | null>(getInitialUser());

// A derived store that is true if the user is logged in, false otherwise
export const isLoggedIn: Readable<boolean> = derived(user, ($user) => $user !== null);

// --- AUTHENTICATION FUNCTIONS ---

/**
 * Logs in the user by calling the real backend API.
 * @param email The user's email
 * @param password The user's password
 */
export async function login(email: string, password: string) {
	try {
		const response = await fetch(`${API_BASE_URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await response.json();

		if (!response.ok) {
			// If the server returns an error (e.g., 401), throw it.
			throw new Error(data.error || 'Login failed. Please check your credentials.');
		}

		// On successful login, the server sends back a token and user object.
		const { token, user: userData } = data;

        // Add the 'initial' property for the UI avatar
        userData.initial = userData.name.charAt(0).toUpperCase();

		// Store user data and token for session persistence
		if (browser) {
			localStorage.setItem('user', JSON.stringify(userData));
			localStorage.setItem('authToken', token); // Storing the token is crucial for future API calls
		}

		// Update the Svelte store to trigger UI changes
		user.set(userData);

		// Redirect to the dashboard
		await goto('/');

	} catch (error) {
		// Clean up on failure to be safe
		if (browser) {
			localStorage.removeItem('user');
			localStorage.removeItem('authToken');
		}
		user.set(null);
		// Re-throw the error so the UI component can display it
		throw error;
	}
}

/**
 * Logs the user out by clearing stores and localStorage.
 */
export function logout() {
	// Clear the Svelte store
	user.set(null);

	// Clear the browser's localStorage
	if (browser) {
		localStorage.removeItem('user');
		localStorage.removeItem('authToken');
	}

	// Redirect to the login page
	goto('/login');
}