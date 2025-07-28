<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { Subscriber } from "$lib/api/subscribers";

  export let subscriber: Subscriber | null = null;
  let formData: Subscriber;

  const dispatch = createEventDispatcher();

  const plans = ["Basic", "Standard", "Premium"];
  const products = ["Product A", "Product B", "Service C"];
  const branches = ["Main Branch", "East Wing", "West Wing"];

  $: formData = subscriber
    ? { ...subscriber }
    : {
        name: "",
        phone: "",
        email: "",
        erikshaw_no: "",
        centre_name: "",
        vendor_name: "",
        address: "",
        pincode: "",
        city: "",
        state: "",
        plan: "",
        product: "",
        branch: "",
      };

  function handleSubmit() {
    dispatch("save", formData);
  }
</script>

<div class="p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-xl font-semibold mb-4 text-gray-800">
    {subscriber?.id ? "Edit" : "Add New"} Subscriber
  </h2>
  <form
    on:submit|preventDefault={handleSubmit}
    class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
  >
    <!-- Required Fields -->
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
      <label for="phone" class="block text-sm font-medium text-gray-700"
        >Phone</label
      >
      <input
        id="phone"
        type="tel"
        bind:value={formData.phone}
        required
        class="mt-1 w-full p-2 border rounded-md"
      />
    </div>
    <!-- Dropdowns -->
    <div>
      <label for="plan" class="block text-sm font-medium text-gray-700"
        >Plan</label
      >
      <select
        id="plan"
        bind:value={formData.plan}
        class="mt-1 w-full p-2 border rounded-md bg-white"
      >
        <option value="" disabled>Select a plan</option>
        {#each plans as plan}
          <option value={plan}>{plan}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="product" class="block text-sm font-medium text-gray-700"
        >Product</label
      >
      <select
        id="product"
        bind:value={formData.product}
        class="mt-1 w-full p-2 border rounded-md bg-white"
      >
        <option value="" disabled>Select a product</option>
        {#each products as product}
          <option value={product}>{product}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="branch" class="block text-sm font-medium text-gray-700"
        >Branch</label
      >
      <select
        id="branch"
        bind:value={formData.branch}
        class="mt-1 w-full p-2 border rounded-md bg-white"
      >
        <option value="" disabled>Select a branch</option>
        {#each branches as branch}
          <option value={branch}>{branch}</option>
        {/each}
      </select>
    </div>
    <!-- Other Text Fields -->
    <div class="md:col-span-2">
      <label for="address" class="block text-sm font-medium text-gray-700"
        >Address</label
      >
      <input
        id="address"
        type="text"
        bind:value={formData.address}
        class="mt-1 w-full p-2 border rounded-md"
      />
    </div>
    <div>
      <label for="city" class="block text-sm font-medium text-gray-700"
        >City</label
      >
      <input
        id="city"
        type="text"
        bind:value={formData.city}
        class="mt-1 w-full p-2 border rounded-md"
      />
    </div>
    <div>
      <label for="state" class="block text-sm font-medium text-gray-700"
        >State</label
      >
      <input
        id="state"
        type="text"
        bind:value={formData.state}
        class="mt-1 w-full p-2 border rounded-md"
      />
    </div>
    <div>
      <label for="pincode" class="block text-sm font-medium text-gray-700"
        >Pincode</label
      >
      <input
        id="pincode"
        type="text"
        bind:value={formData.pincode}
        class="mt-1 w-full p-2 border rounded-md"
      />
    </div>
    <div>
      <label for="vendor_name" class="block text-sm font-medium text-gray-700"
        >Vendor Name</label
      >
      <input
        id="vendor_name"
        type="text"
        bind:value={formData.vendor_name}
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
        Save Subscriber
      </button>
    </div>
  </form>
</div>
