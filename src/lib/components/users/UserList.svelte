<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { User } from "$lib/api/users";

  export let users: User[] = [];
  const dispatch = createEventDispatcher();
</script>

<div class="bg-white rounded-lg shadow-md overflow-x-auto">
  <table class="w-full min-w-[600px] text-left">
    <thead class="bg-gray-50 border-b border-gray-200">
      <tr>
        <th class="p-4 font-semibold text-sm text-gray-600">Name</th>
        <th class="p-4 font-semibold text-sm text-gray-600">Email</th>
        <th class="p-4 font-semibold text-sm text-gray-600">Unit</th>
        <th class="p-4 font-semibold text-sm text-gray-600 text-center"
          >Actions</th
        >
      </tr>
    </thead>
    <tbody>
      {#each users as user (user.id)}
        <tr class="border-t border-gray-200 hover:bg-gray-50">
          <td class="p-4 font-medium text-gray-800">{user.name}</td>
          <td class="p-4 text-gray-600">{user.email}</td>
          <td class="p-4 text-gray-600">{user.unit}</td>
          <td class="p-4 text-center space-x-2 whitespace-nowrap">
            <button
              on:click={() => dispatch("edit", user)}
              class="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-yellow-200"
            >
              Edit
            </button>
            <button
              on:click={() => dispatch("delete", user.id)}
              class="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-red-200"
            >
              Delete
            </button>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="4" class="p-8 text-center text-gray-500"
            >No users found.</td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>
