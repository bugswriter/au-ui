<!-- src/lib/components/Pagination.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let currentPage: number;
	export let totalPages: number;
	export let totalItems: number;
	export let perPage: number;

	const dispatch = createEventDispatcher();

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			dispatch('changePage', page);
		}
	}

	$: startItem = (currentPage - 1) * perPage + 1;
	$: endItem = Math.min(currentPage * perPage, totalItems);
</script>

<div class="flex justify-between items-center mt-6 text-sm">
	<p class="text-gray-600">
		Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> results
	</p>
	<div class="flex items-center space-x-2">
		<button
			on:click={() => goToPage(currentPage - 1)}
			disabled={currentPage === 1}
			class="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
		>
			Previous
		</button>
		<span class="text-gray-700">
			Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
		</span>
		<button
			on:click={() => goToPage(currentPage + 1)}
			disabled={currentPage === totalPages}
			class="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
		>
			Next
		</button>
	</div>
</div>