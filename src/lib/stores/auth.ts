import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import type { User } from '$lib/api/users'; // Import the User type

const API_BASE_URL = 'https://api.au.shiosayi.org/api';

// --- State Management ---

// Check localStorage to see if the user was already logged in from a previous session
const getInitialUser = (): User | null => {
    if (!browser) return null;
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
};

// Create a store to hold the logged-in user's data
export const authedUser = writable<User | null>(getInitialUser());

// The `isLoggedIn` store can now simply check if the user object exists
export const isLoggedIn = writable<boolean>(getInitialUser() !== null);


// --- Authentication Functions ---

export async function login(email, password) {
	try {
		const response = await fetch(`${API_BASE_URL}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		const data = await response.json();

		if (!response.ok) {
			// If the server returns an error (like 401), throw it to be caught
			throw new Error(data.error || 'Login failed.');
		}

		// On successful login, the server sends back a token and user object
		const { token, user } = data;

		// Store user data and token for session persistence
		if (browser) {
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('authToken', token);
		}

		// Update our stores
		authedUser.set(user);
		isLoggedIn.set(true);

		// Redirect to the dashboard
		goto('/');

	} catch (error) {
		// Clean up on failure
		authedUser.set(null);
		isLoggedIn.set(false);
		console.error('Login error:', error);
		// Re-throw the error so the UI component can display it
		throw error;
	}
}

export function logout() {
	// Clear stores
	authedUser.set(null);
	isLoggedIn.set(false);

	// Clear localStorage
	if (browser) {
		localStorage.removeItem('user');
		localStorage.removeItem('authToken');
	}

	// Redirect to login page
	goto('/login');
}