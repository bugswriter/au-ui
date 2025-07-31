import { browser } from '$app/environment';
import { user } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';

// By setting ssr=false, this load function will only run on the client-side,
// which simplifies checking for the user in localStorage.
export const ssr = false;

export const load: LayoutLoad = ({ url }) => {
	// This function runs before any page in your app is rendered.
	if (!browser) {
		// If not in browser, do nothing. This is a safety check.
		return;
	}

	const isLoggedIn = get(user) !== null;
	const { pathname } = url;

	// --- Route Guard Logic ---

	// 1. If the user is trying to access the login page but is already logged in,
	//    redirect them to the dashboard.
	if (isLoggedIn && pathname === '/login') {
		throw redirect(307, '/');
	}

	// 2. If the user is NOT logged in and is trying to access any page
	//    other than the login page, redirect them to the login page.
	if (!isLoggedIn && pathname !== '/login') {
		throw redirect(307, '/login');
	}

    // If neither of the above conditions are met, allow the user to proceed.
	return {};
};