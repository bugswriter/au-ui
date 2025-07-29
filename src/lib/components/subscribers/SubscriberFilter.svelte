<!-- src/lib/components/subscribers/SubscriberFilter.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Hardcoded for simplicity, but could be fetched from the API
	const plans = ['Basic', 'Standard', 'Premium'];

	let searchTerm = '';
	let selectedPlan = '';
	let sortBy = '-created';

	const dispatch = createEventDispatcher();

	let debounceTimer: number;
	function debounceApplyFilters() {
		clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(() => {
			applyFilters();
		}, 350); // wait 350ms after user stops typing
	}

	function applyFilters() {
		dispatch('filter', {
			search: searchTerm,
			plan: selectedPlan,
			sort: sortBy
		});
	}

	function clearFilters() {
		searchTerm = '';
		selectedPlan = '';
		sortBy = '-created';
		applyFilters();
	}
</script>

<div class="p-4 bg-gray-50 rounded-lg shadow-inner mb-6">
	<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
		<!-- Search Input -->
		<div class="lg:col-span-2">
			<label for="search" class="block text-sm font-medium text-gray-700">Search</label>
			<input
				id="search"
				type="text"
				placeholder="Search by name, email, city..."
				bind:value={searchTerm}
				on:input={debounceApplyFilters}
				class="mt-1 w-full p-2 border rounded-md"
			/>
		</div>

		<!-- Plan Filter -->
		<div>
			<label for="plan" class="block text-sm font-medium text-gray-700">Plan</label>
			<select
				id="plan"
				bind:value={selectedPlan}
				on:change={applyFilters}
				class="mt-1 w-full p-2 border rounded-md bg-white"
			>
				<option value="">All Plans</option>
				{#each plans as plan}
					<option value={plan}>{plan}</option>
				{/each}
			</select>
		</div>

		<!-- Sort By -->
		<div>
			<label for="sort" class="block text-sm font-medium text-gray-700">Sort By</label>
			<select
				id="sort"
				bind:value={sortBy}
				on:change={applyFilters}
				class="mt-1 w-full p-2 border rounded-md bg-white"
			>
				<option value="-created">Newest First</option>
				<option value="created">Oldest First</option>
				<option value="name">Name (A-Z)</option>
				<option value="-name">Name (Z-A)</option>
			</select>
		</div>
	</div>
	<div class="mt-4 flex justify-end">
		<button on:click={clearFilters} class="text-sm text-indigo-600 hover:underline">
			Clear Filters
		</button>
	</div>
</div>