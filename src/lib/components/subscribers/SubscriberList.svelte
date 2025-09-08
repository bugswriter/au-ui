<script lang="ts">
	import type { Subscriber } from '$lib/api/subscribers';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import PaymentHistory from './PaymentHistory.svelte';

	export let subscribers: Subscriber[] = [];
	const dispatch = createEventDispatcher();

	let expandedSubscriberId: string | null = null;

	function toggleExpand(id: string) {
		expandedSubscriberId = expandedSubscriberId === id ? null : id;
	}
</script>

<div class="bg-white rounded-lg shadow-sm overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full min-w-[800px]">
			<thead class="bg-gray-50">
				<tr>
					<th class="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Subscriber</th>
					<th class="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
					<!-- --- UPDATED: Header is more descriptive --- -->
					<th class="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
						Center / Location
					</th>
					<th class="w-24"></th><!-- Actions -->
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each subscribers as sub (sub.id)}
					<tr
						class="cursor-pointer transition-colors"
						class:bg-indigo-50={expandedSubscriberId === sub.id}
						class:hover:bg-gray-50={expandedSubscriberId !== sub.id}
						on:click={() => toggleExpand(sub.id)}
					>
						<td class="p-4 font-medium text-gray-800">
							<div class="flex items-center gap-3">
								<div
									class="text-gray-400 transition-transform {expandedSubscriberId === sub.id
										? 'rotate-90'
										: ''}"
								>
									▶
								</div>
								<div>
									<div>{sub.name}</div>
									<code class="text-xs text-gray-400 font-mono">{sub.id}</code>
								</div>
							</div>
						</td>
						<td class="p-4 text-sm text-gray-600">
							<div>{sub.phone}</div>
							<div class="text-xs text-gray-500">{sub.email || '-'}</div>
						</td>
						<!-- --- UPDATED: Location column now displays the new fields --- -->
						<td class="p-4 text-sm text-gray-600">
							<!-- Display center_name as the primary location info -->
							{#if sub.center_name}
								<div>{sub.center_name}</div>
							{/if}
							<!-- Display landmark as secondary info -->
							{#if sub.landmark}
								<div class="text-xs text-gray-500">{sub.landmark}</div>
							{/if}
							<!-- Display city and unit as tertiary info, filtering out empty values -->
							<div class="text-xs text-gray-500">
								{[sub.city, sub.unit].filter(Boolean).join(' - ')}
							</div>
						</td>
						<td class="p-4 text-right">
							<button
								on:click|stopPropagation={() => dispatch('edit', sub)}
								class="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							>
								Edit
							</button>
						</td>
					</tr>

					{#if expandedSubscriberId === sub.id}
						<tr>
							<td colspan="4" class="p-0 bg-gray-50/70">
								<div transition:slide={{ duration: 200 }} class="p-4 border-t-2 border-indigo-200">
									<PaymentHistory subscriberId={sub.id} />
								</div>
							</td>
						</tr>
					{/if}
				{:else}
					<tr>
						<td colspan="4" class="p-8 text-center text-gray-500">No subscribers found.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>