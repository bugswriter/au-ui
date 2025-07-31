<script lang="ts">
	import { onMount } from 'svelte';
	import { getUsers, deleteUser, type User } from '$lib/api/users';
	import UserList from '$lib/components/users/UserList.svelte';
	import UserForm from '$lib/components/users/UserForm.svelte';

	let users: User[] = [];
	let isLoading = true;
	let error = '';
	let showForm = false;
	let selectedUser: User | null = null;

	async function loadUsers() {
		isLoading = true;
		error = '';
		try {
			users = await getUsers();
		} catch (e: any) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	onMount(loadUsers);

	function handleAdd() {
		selectedUser = null;
		showForm = true;
	}

	function handleEdit(event: CustomEvent<User>) {
		selectedUser = event.detail;
		showForm = true;
	}

async function handleDelete(event: CustomEvent<string>) {
		const userId = event.detail;
		if (confirm('Are you sure you want to delete this user?')) {
			try {
				await deleteUser(userId);
				await loadUsers(); // Refresh the list
			} catch (e: any) {
				alert(`Error: ${e.message}`);
			}
		}
	}
</script>

<div>
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-gray-900">Manage Users</h1>
		<button on:click={handleAdd} class="btn-primary"> Add New User </button>
	</div>

	{#if isLoading}
		<p>Loading users...</p>
	{:else if error}
		<p class="text-red-600">{error}</p>
	{:else}
		<UserList {users} on:edit={handleEdit} on:delete={handleDelete} />
	{/if}
</div>

{#if showForm}
	<UserForm
		user={selectedUser}
		on:cancel={() => (showForm = false)}
		on:success={() => {
			showForm = false;
			loadUsers();
		}}
	/>
{/if}

<style>
	@reference '../../../app.css';
	.btn-primary {
		@apply rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500;
	}
</style>