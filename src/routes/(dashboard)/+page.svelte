<script lang="ts">
	import { onMount } from 'svelte';
	import { getDashboardStats, type DashboardStats } from '$lib/api/dashboard';

	let stats: DashboardStats | null = null;
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			stats = await getDashboardStats();
		} catch (e: any) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	});

	// Helper to format numbers with commas for Indian currency format
	const formatNumber = (num: number) => {
		if (num === null || num === undefined) return '0';
		return num.toLocaleString('en-IN');
	};
</script>

<div>
	<h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

	{#if isLoading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
			<!-- Loading Skeleton -->
			{#each { length: 4 } as _}
				<div class="bg-white p-6 rounded-lg shadow-md h-28">
                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div class="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
			{/each}
		</div>
	{:else if error}
		<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
			<p class="font-bold">Error Loading Data</p>
			<p>{error}</p>
		</div>
	{:else if stats}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Total Subscribers -->
			<div class="bg-white p-6 rounded-lg shadow-md">
				<p class="text-sm font-medium text-gray-500">Total Subscribers</p>
				<p class="text-4xl font-bold text-gray-800 mt-1">{formatNumber(stats.total_subscribers)}</p>
			</div>

			<!-- Total Due Amount -->
			<div class="bg-white p-6 rounded-lg shadow-md">
				<p class="text-sm font-medium text-gray-500">Total Due Amount</p>
				<p class="text-4xl font-bold text-red-600 mt-1">
					<span class="text-3xl">₹</span>{formatNumber(stats.total_due_amount)}
				</p>
			</div>

			<!-- Revenue This Month -->
			<div class="bg-white p-6 rounded-lg shadow-md">
				<p class="text-sm font-medium text-gray-500">Revenue This Month</p>
				<p class="text-4xl font-bold text-green-600 mt-1">
					<span class="text-3xl">₹</span>{formatNumber(stats.revenue_this_month)}
				</p>
			</div>

			<!-- New Subscribers -->
			<div class="bg-white p-6 rounded-lg shadow-md">
				<p class="text-sm font-medium text-gray-500">New Subscribers</p>
				<p class="text-4xl font-bold text-blue-600 mt-1">+{formatNumber(stats.new_subscribers_this_month)}</p>
			</div>
		</div>
	{/if}
</div>