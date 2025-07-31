<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { User } from '$lib/api/users';

	export let users: User[] = [];
	const dispatch = createEventDispatcher();
</script>

<div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
	<div class="overflow-x-auto">
		<table class="w-full min-w-[600px]">
			<thead class="bg-gray-50">
				<tr>
					<th class="th">Name</th>
					<th class="th">Email</th>
					<th class="th">Unit</th>
					<th class="th text-right">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each users as user (user.id)}
					<tr class="hover:bg-gray-50">
						<td class="td font-medium text-gray-800">{user.name}</td>
						<td class="td text-gray-600">{user.email}</td>
						<td class="td text-gray-600">{user.unit}</td>
						<td class="td text-right space-x-2 whitespace-nowrap">
							<button on:click={() => dispatch('edit', user)} class="btn-action"> Edit </button>
							<button on:click={() => dispatch('delete', user.id)} class="btn-action-destructive">
								Delete
							</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="p-8 text-center text-gray-500">No users found.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	@reference '../../../app.css';
	.th { @apply p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider; }
	.td { @apply p-4 text-sm; }
	.btn-action { @apply rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50; }
	.btn-action-destructive { @apply rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-100; }
</style>