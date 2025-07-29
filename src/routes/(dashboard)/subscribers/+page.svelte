<!-- src/routes/(dashboard)/subscribers/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import SubscriberList from '$lib/components/subscribers/SubscriberList.svelte';
	import SubscriberForm from '$lib/components/subscribers/SubscriberForm.svelte';
	import SubscriberFilter from '$lib/components/subscribers/SubscriberFilter.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import {
		getSubscribers,
		createSubscriber,
		updateSubscriber,
		deleteSubscriber,
		type Subscriber,
		type PaginatedResult,
		type SubscriberQuery
	} from '$lib/api/subscribers';

	let paginatedResult: PaginatedResult<Subscriber> | null = null;
	let isLoading = true;
	let error: string | null = null;
	let showForm = false;
	let currentSubscriber: Subscriber | null = null;

	// This object holds all our query state
	let query: SubscriberQuery = {
		page: 1,
		perPage: 10,
		sort: '-created',
		search: '',
		plan: ''
	};

	// The main data loading function
	async function loadSubscribers() {
		isLoading = true;
		error = null;
		try {
			paginatedResult = await getSubscribers(query);
		} catch (e: any) {
			error = e.message;
			paginatedResult = null;
		} finally {
			isLoading = false;
		}
	}

	// Svelte's magic: this function re-runs whenever 'query' changes
	$: if (query) {
		loadSubscribers();
	}

	function handleFilterChange(event: CustomEvent) {
		// When filters change, reset to page 1
		query = { ...query, ...event.detail, page: 1 };
	}

	function handlePageChange(event: CustomEvent<number>) {
		query = { ...query, page: event.detail };
	}

	function handleAddNew() {
		currentSubscriber = null;
		showForm = true;
	}

	function handleEdit(event: CustomEvent<Subscriber>) {
		currentSubscriber = event.detail;
		showForm = true;
	}

	async function handleDelete(event: CustomEvent<string>) {
		const id = event.detail;
		if (confirm('Are you sure you want to delete this subscriber?')) {
			try {
				await deleteSubscriber(id);
				// If we delete the last item on a page, we might need to go back one page
				if (paginatedResult && paginatedResult.items.length === 1 && paginatedResult.page > 1) {
					query.page = paginatedResult.page - 1;
				}
				await loadSubscribers(); // Reload data with current query
			} catch (e: any) {
				alert(e.message);
			}
		}
	}

	async function handleSave(event: CustomEvent<Subscriber>) {
		const subscriberData = event.detail;
		try {
			if (subscriberData.id) {
				await updateSubscriber(subscriberData.id, subscriberData);
			} else {
				// After creating, reset to page 1 sorted by newest to see the new entry
				query = { ...query, page: 1, sort: '-created' };
				await createSubscriber(subscriberData);
			}
			showForm = false;
			await loadSubscribers(); // Reload data
		} catch (e: any) {
			alert(e.message);
		}
	}

	// Initial load
	onMount(loadSubscribers);
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold text-gray-800">Subscribers</h1>
		{#if !showForm}
			<button
				on:click={handleAddNew}
				class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow"
			>
				Add New Subscriber
			</button>
		{/if}
	</div>

	{#if showForm}
		<SubscriberForm
			subscriber={currentSubscriber}
			on:save={handleSave}
			on:cancel={() => (showForm = false)}
		/>
	{/if}

	<!-- We only show filters and list when the form is hidden -->
	{#if !showForm}
		<SubscriberFilter on:filter={handleFilterChange} />

		{#if isLoading}
			<p class="p-4 text-center text-gray-500">Loading subscribers...</p>
		{:else if error}
			<p class="p-4 text-center text-red-500 bg-red-100 rounded-md">{error}</p>
		{:else if paginatedResult && paginatedResult.items.length > 0}
			<SubscriberList subscribers={paginatedResult.items} on:edit={handleEdit} on:delete={handleDelete} />
			<Pagination
				currentPage={paginatedResult.page}
				totalPages={paginatedResult.totalPages}
				totalItems={paginatedResult.totalItems}
				perPage={paginatedResult.perPage}
				on:changePage={handlePageChange}
			/>
		{:else}
			<p class="p-8 text-center text-gray-500">No subscribers found for the current filters.</p>
		{/if}
	{/if}
</div>