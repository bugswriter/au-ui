<script lang="ts">
  import { onMount } from "svelte";
  import SubscriberList from "$lib/components/subscribers/SubscriberList.svelte";
  import SubscriberForm from "$lib/components/subscribers/SubscriberForm.svelte";
  import {
    getSubscribers,
    createSubscriber,
    updateSubscriber,
    deleteSubscriber,
    type Subscriber,
  } from "$lib/api/subscribers";

  let subscribers: Subscriber[] = [];
  let isLoading = true;
  let error: string | null = null;
  let showForm = false;
  let currentSubscriber: Subscriber | null = null;

  async function loadSubscribers() {
    isLoading = true;
    error = null;
    try {
      subscribers = await getSubscribers();
    } catch (e) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  }

  function handleAddNew() {
    currentSubscriber = null;
    showForm = true;
  }

  function handleEdit(event: CustomEvent<Subscriber>) {
    currentSubscriber = event.detail;
    showForm = true;
  }

  async function handleDelete(event: CustomEvent<string>) {
    const id = event.detail;
    if (confirm("Are you sure you want to delete this subscriber?")) {
      try {
        await deleteSubscriber(id);
        await loadSubscribers();
      } catch (e) {
        alert(e.message);
      }
    }
  }

  async function handleSave(event: CustomEvent<Subscriber>) {
    const subscriberData = event.detail;
    try {
      if (subscriberData.id) {
        await updateSubscriber(subscriberData.id, subscriberData);
      } else {
        await createSubscriber(subscriberData);
      }
      showForm = false;
      await loadSubscribers();
    } catch (e) {
      alert(e.message);
    }
  }

  onMount(loadSubscribers);
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-3xl font-bold text-gray-800">Subscribers</h1>
    {#if !showForm}
      <button
        on:click={handleAddNew}
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow"
      >
        Add New Subscriber
      </button>
    {/if}
  </div>

  {#if showForm}
    <SubscriberForm
      subscriber={currentSubscriber}
      on:save={handleSave}
      on:cancel={() => (showForm = false)}
    />
  {/if}

  {#if isLoading}
    <p
      class="p-4 text-center text-gray-500 flex items-center justify-center space-x-2"
    >
      <svg
        class="w-4 h-4 animate-spin text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
      <span>Loading subscribers...</span>
    </p>
  {:else if error}
    <p class="p-4 text-center text-red-500 bg-red-100 rounded-md">{error}</p>
  {:else if !showForm}
    <SubscriberList
      {subscribers}
      on:edit={handleEdit}
      on:delete={handleDelete}
    />
  {/if}
</div>
