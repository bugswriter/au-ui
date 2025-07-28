<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Subscriber } from "$lib/api/subscribers";

  export let subscribers: Subscriber[] = [];
  let expandedRowId: string | null = null;

  const dispatch = createEventDispatcher();

  function toggleDetails(id: string) {
    expandedRowId = expandedRowId === id ? null : id;
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-x-auto">
  <table class="w-full min-w-[700px] text-left">
    <thead class="bg-gray-50 border-b border-gray-200">
      <tr>
        <th class="p-4 font-semibold text-sm text-gray-600">Name</th>
        <th class="p-4 font-semibold text-sm text-gray-600">Email / Phone</th>
        <th class="p-4 font-semibold text-sm text-gray-600">City</th>
        <th class="p-4 font-semibold text-sm text-gray-600">Plan</th>
        <th class="p-4 font-semibold text-sm text-gray-600 text-center"
          >Actions</th
        >
      </tr>
    </thead>
    <tbody>
      {#each subscribers as sub (sub.id)}
        <tr class="border-t border-gray-200 hover:bg-gray-50">
          <td class="p-4 font-medium text-gray-800">{sub.name}</td>
          <td class="p-4 text-gray-600">
            <div>{sub.email}</div>
            <div class="text-xs text-gray-500">{sub.phone}</div>
          </td>
          <td class="p-4 text-gray-600">{sub.city || "N/A"}</td>
          <td class="p-4 text-gray-600">{sub.plan || "N/A"}</td>
          <td class="p-4 text-center space-x-2 whitespace-nowrap">
            <button
              on:click={() => toggleDetails(sub.id!)}
              class="px-2 py-1 text-xs font-medium rounded {expandedRowId ===
              sub.id
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'} hover:bg-blue-200"
            >
              {expandedRowId === sub.id ? "Hide" : "Details"}
            </button>
            <button
              on:click={() => dispatch("edit", sub)}
              class="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-yellow-200"
            >
              Edit
            </button>
            <button
              on:click={() => dispatch("delete", sub.id)}
              class="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-red-200"
            >
              Delete
            </button>
          </td>
        </tr>

        <!-- EXPANDED ROW -->
        {#if expandedRowId === sub.id}
          <tr class="bg-gray-50">
            <td colspan="5" class="p-4">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 class="font-bold text-gray-700">Vendor Name</h4>
                  <p class="text-gray-600">{sub.vendor_name || "N/A"}</p>
                </div>
                <div>
                  <h4 class="font-bold text-gray-700">State</h4>
                  <p class="text-gray-600">{sub.state || "N/A"}</p>
                </div>
                <div>
                  <h4 class="font-bold text-gray-700">Pincode</h4>
                  <p class="text-gray-600">{sub.pincode || "N/A"}</p>
                </div>
                <div>
                  <h4 class="font-bold text-gray-700">Branch</h4>
                  <p class="text-gray-600">{sub.branch || "N/A"}</p>
                </div>
                <div>
                  <h4 class="font-bold text-gray-700">Product</h4>
                  <p class="text-gray-600">{sub.product || "N/A"}</p>
                </div>
                <div class="col-span-2 md:col-span-3">
                  <h4 class="font-bold text-gray-700">Address</h4>
                  <p class="text-gray-600">{sub.address || "N/A"}</p>
                </div>
              </div>
            </td>
          </tr>
        {/if}
      {:else}
        <tr>
          <td colspan="5" class="p-8 text-center text-gray-500"
            >No subscribers found.</td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>
