<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { updatePaymentCycle, type PaymentCycle } from '$lib/api/payment_cycles';
	
	export let cycle: PaymentCycle;
	const dispatch = createEventDispatcher();

	let amount = cycle.amount;
	let isLoading = false;
	let errorMessage = '';

	async function handleSend() {
		isLoading = true;
		errorMessage = '';
		try {
			const paymentLink = `https://dummy.payment.link/${cycle.subscriber}/${Date.now()}`;
			
			// If amount was changed, update the cycle first
			if(amount !== cycle.amount) {
				await updatePaymentCycle(cycle.id, { amount });
			}

			// In a real app, you would call an API to send an SMS/Email here.
			// For now, we just update the record with the dummy link.
			await updatePaymentCycle(cycle.id, { payment_link: paymentLink });

			alert(`Dummy link sent!\n${paymentLink}`);
			dispatch('close');
		} catch (e: any) {
			errorMessage = e.message;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
	<div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
		<h3 class="font-bold text-lg mb-4">Send Payment Link</h3>
		<p class="text-sm text-gray-600 mb-4">
			You can adjust the amount before sending a new payment link to the subscriber.
		</p>
		<div class="mb-4">
			<label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Payment Amount (₹)</label>
			<input type="number" id="amount" class="block w-full rounded-md border-gray-300 shadow-sm" bind:value={amount} />
		</div>

		{#if errorMessage}<p class="text-sm text-red-600">{errorMessage}</p>{/if}

		<div class="pt-4 flex justify-end gap-3">
			<button on:click={() => dispatch('close')} class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Cancel
            </button>
			<button on:click={handleSend} disabled={isLoading} class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
				{isLoading ? 'Sending...' : 'Send Link'}
			</button>
		</div>
	</div>
</div>