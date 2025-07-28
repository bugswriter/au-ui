<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { User } from "$lib/api/users";

  export let user: User | null = null;
  let formData: Partial<User>;

  const dispatch = createEventDispatcher();

  $: isEditing = !!user?.id;
  $: formData = user
    ? { ...user }
    : { name: "", email: "", unit: "", password: "" };

  function handleSubmit() {
    // Only include the password if it's not empty
    const payload = { ...formData };
    if (!payload.password) {
      delete payload.password;
    }
    dispatch("save", payload);
  }
</script>

<div class="p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-xl font-semibold mb-4 text-gray-800">
    {isEditing ? "Edit" : "Create New"} User
  </h2>
  <form
    on:submit|preventDefault={handleSubmit}
    class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
  >
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700"
        >Name</label
      >
      <input
        id="name"
        type="text"
        bind:value={formData.name}
        required
        class="mt-1 w-full p-2 border rounded-md"
      />
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700"
        >Email</label
      >
      <input
        id="email"
        type="email"
        bind:value={formData.email}
        required
        class="mt-1 w-full p-2 border rounded-md"
      />
    </div>
    <div>
      <label for="unit" class="block text-sm font-medium text-gray-700"
        >Unit</label
      >
      <input
        id="unit"
        type="text"
        bind:value={formData.unit}
        required
        class="mt-1 w-full p-2 border rounded-md"
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700"
        >Password</label
      >
      <input
        id="password"
        type="password"
        bind:value={formData.password}
        placeholder={isEditing ? "Leave blank to keep current" : ""}
        required={!isEditing}
        class="mt-1 w-full p-2 border rounded-md"
      />
    </div>

    <!-- Actions -->
    <div class="md:col-span-2 flex justify-end gap-3 mt-4">
      <button
        type="button"
        on:click={() => dispatch("cancel")}
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Save User
      </button>
    </div>
  </form>
</div>
