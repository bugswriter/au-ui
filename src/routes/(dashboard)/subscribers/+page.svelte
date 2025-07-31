<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getSubscribers, type Subscriber, type PaginatedSubscribers } from '$lib/api/subscribers';
	import { getUnitsLookup, type Lookups } from '$lib/api/dashboard';

	import SubscriberFilter from '$lib/components/subscribers/SubscriberFilter.svelte';
	import SubscriberList from '$lib/components/subscribers/SubscriberList.svelte';
	import SubscriberForm from '$lib/components/subscribers/SubscriberForm.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	// Note: The import for 'Icon' has been removed from this file.

	let subscribersData: PaginatedSubscribers | null = null;
	let lookups: Lookups | null = null;
	let error: string | null = null;
	let isLoading = true;
	let showFormModal = false;
	let selectedSubscriber: Subscriber | null = null;

	async function loadData() {
		isLoading = true;
		error = null;
		try {
			const pageNum = Number($page.url.searchParams.get('page') ?? '1');
			const search = $page.url.searchParams.get('search') ?? '';
			const city = $page.url.searchParams.get('city') ?? '';
			const has_due_payment = $page.url.searchParams.get('has_due_payment') === 'true';

			const [subs, lkps] = await Promise.all([
				getSubscribers({ page: pageNum, search, city, has_due_payment }),
				getUnitsLookup()
			]);
			subscribersData = subs;
			lookups = lkps;
		} catch (e: any) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	onMount(loadData);
	$: $page.url, loadData();

	function handleOpenModal(subscriber: Subscriber | null = null) {
		selectedSubscriber = subscriber;
		showFormModal = true;
	}

	function handleFormSuccess() {
		showFormModal = false;
		loadData();
	}

	function handlePageChange(event: CustomEvent<number>) {
		const query = new URLSearchParams($page.url.searchParams);
		query.set('page', event.detail.toString());
		goto(`/subscribers?${query.toString()}`);
	}
</script>

<div>
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-gray-900">Subscribers</h1>
		<!-- ======== THIS IS THE CORRECTED BUTTON ======== -->
		<button
			on:click={() => handleOpenModal()}
			class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			New Subscriber
		</button>
	</div>

	{#if lookups}
		<SubscriberFilter {lookups} />
	{/if}

	<div class="mt-4">
		{#if isLoading}
			<div class="text-center p-8 text-gray-500">Loading subscribers...</div>
		{:else if error}
			<div class="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
		{:else if subscribersData?.items}
			<SubscriberList subscribers={subscribersData.items} on:edit={(e) => handleOpenModal(e.detail)} />
			{#if subscribersData.totalPages > 1}
				<Pagination
					currentPage={subscribersData.page}
					totalPages={subscribersData.totalPages}
					totalItems={subscribersData.totalItems}
					perPage={subscribersData.perPage}
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