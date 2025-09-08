
<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { Subscriber } from '$lib/api/subscribers';
	import type { PageData } from './$types';

	import SubscriberFilter from '$lib/components/subscribers/SubscriberFilter.svelte';
	import SubscriberList from '$lib/components/subscribers/SubscriberList.svelte';
	import SubscriberForm from '$lib/components/subscribers/SubscriberForm.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	// The `data` prop is automatically passed from your +page.server.ts load function
	export let data: PageData;

	// UI state is all that's left in the component
	let showFormModal = false;
	let selectedSubscriber: Subscriber | null = null;

	function handleOpenModal(subscriber: Subscriber | null = null) {
		selectedSubscriber = subscriber;
		showFormModal = true;
	}

	function handleFormSuccess() {
		showFormModal = false;
		// This tells SvelteKit to re-run the `load` function to get fresh data
		invalidateAll();
	}

	function handlePageChange(event: CustomEvent<number>) {
		// The URL is the single source of truth for filters and pagination
		const query = new URLSearchParams(location.search);
		query.set('page', event.detail.toString());
		goto(`/subscribers?${query.toString()}`, { keepFocus: true, noScroll: true });
	}
</script>

<div>
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-gray-900">Subscribers</h1>
		<button
			on:click={() => handleOpenModal()}
			class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			New Subscriber
		</button>
	</div>

	<!-- Use the lookups data passed from the server -->
	{#if data.lookups}
		<SubscriberFilter lookups={data.lookups} />
	{/if}

	<div class="mt-4">
		<!-- Check for server-side errors -->
		{#if data.error}
			<div class="bg-red-100 text-red-700 p-4 rounded-md">{data.error}</div>
		{:else if data.subscribersData?.items}
			<SubscriberList
				subscribers={data.subscribersData.items}
				on:edit={(e) => handleOpenModal(e.detail)}
			/>
			{#if data.subscribersData.totalPages > 1}
				<Pagination
					currentPage={data.subscribersData.page}
					totalPages={data.subscribersData.totalPages}
					totalItems={data.subscribersData.totalItems}
					perPage={data.subscribersData.perPage}
					on:changePage={handlePageChange}
				/>
			{/if}
		{/if}
	</div>
</div>

{#if showFormModal}
	<SubscriberForm
		subscriber={selectedSubscriber}
		on:close={() => (showFormModal = false)}
		on:success={handleFormSuccess}
	/>
{/if}