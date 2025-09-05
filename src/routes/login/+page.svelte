<script lang="ts">
	import { login } from '$lib/stores/auth';

	let email = '';
	let password = '';
	let isLoading = false;
	let error: string | null = null;

	async function handleLogin() {
		isLoading = true;
		error = null;
		try {
			// This now calls your real API via the auth store
			await login(email, password);
		} catch (e: any) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="p-8 bg-white rounded-lg shadow-xl w-full max-w-sm">
		<h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
  <img 
    src="https://2.bp.blogspot.com/-91e2PSMrZjE/TvSUGtNlGDI/AAAAAAAAD6U/iA-rHM7NIx8/s400/amar-ujala-logo.gif" 
    alt="Amar Ujala" 
    class="mx-auto h-12 w-auto object-contain"
  />
  <span class="sr-only">Amar Ujala Login</span>
</h1>

		<form on:submit|preventDefault={handleLogin} class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					class="mt-1 input-style"
					required
					disabled={isLoading}
				/>
			</div>
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					class="mt-1 input-style"
					required
					disabled={isLoading}
				/>
			</div>

			{#if error}
				<div class="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md">
					{error}
				</div>
			{/if}

			<button type="submit" class="w-full btn-primary" disabled={isLoading}>
				{isLoading ? 'Signing In...' : 'Login'}
			</button>
		</form>
	</div>
</div>

<style>
	@reference '../../app.css';
	.input-style {
		@apply block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6;
	}
	.btn-primary {
		@apply flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50;
	}
</style>