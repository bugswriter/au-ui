<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { User } from '$lib/api/users';
	import { createUser, updateUser } from '$lib/api/users';

	export let user: User | null = null;
	const dispatch = createEventDispatcher();

	let formData: Partial<User>;
	let isLoading = false;
	let error = '';

	$: isEditing = !!user?.id;
	$: formData = user ? { ...user } : { name: '', email: '', unit: '', password: '' };

	async function handleSubmit() {
		isLoading = true;
		error = '';
		try {
			const payload = { ...formData };
			if (!payload.password) {
				delete payload.password;
			}
			if (isEditing && user?.id) {
				await updateUser(user.id, payload);
			} else {
				await createUser(payload);
			}
			dispatch('success');
		} catch (e: any) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
	<div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
		<h3 class="font-bold text-lg mb-4 text-gray-900">{isEditing ? 'Edit' : 'Create New'} User</h3>
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				<div>
					<label for="name" class="label">Name</label>
					<input id="name" type="text" bind:value={formData.name} required class="input" />
				</div>
				<div>
					<label for="email" class="label">Email</label>
					<input id="email" type="email" bind:value={formData.email} required class="input" />
				</div>
				<div>
					<label for="unit" class="label">Unit</label>
					<input id="unit" type="text" bind:value={formData.unit} required class="input" />
				</div>
				<div>
					<label for="password" class="label">Password</label>
					<input
						id="password" type="password" bind:value={formData.password}
						placeholder={isEditing ? 'Leave blank to keep current' : ''}
						required={!isEditing} class="input"
					/>
				</div>
			</div>
			{#if error}
				<p class="text-sm text-red-600">{error}</p>
			{/if}
			<div class="pt-4 flex justify-end gap-3">
				<button type="button" on:click={() => dispatch('cancel')} class="btn-secondary">
					Cancel
				</button>
				<button type="submit" class="btn-primary" disabled={isLoading}>
					{isLoading ? 'Saving...' : 'Save User'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	@reference '../../../app.css';
	.label { @apply block text-sm font-medium leading-6 text-gray-900; }
	.input { @apply block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6; }
	.btn-primary { @apply rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50; }
	.btn-secondary { @apply rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50; }
</style>