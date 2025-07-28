<script lang="ts">
  import { onMount } from "svelte";
  import UserList from "$lib/components/users/UserList.svelte";
  import UserForm from "$lib/components/users/UserForm.svelte";
  import {
    getUsers,
    createUser, // <-- 1. Import 'createUser' instead of 'registerUser'
    updateUser,
    deleteUser,
    type User,
  } from "$lib/api/users";

  let users: User[] = [];
  let isLoading = true;
  let error: string | null = null;
  let showForm = false;
  let currentUser: User | null = null;

  async function loadUsers() {
    isLoading = true;
    error = null;
    try {
      users = await getUsers();
    } catch (e) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  }

  function handleAddNew() {
    currentUser = null;
    showForm = true;
  }

  function handleEdit(event: CustomEvent<User>) {
    currentUser = event.detail;
    showForm = true;
  }

  async function handleDelete(event: CustomEvent<string>) {
    const id = event.detail;
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        await loadUsers();
      } catch (e) {
        alert(e.message);
      }
    }
  }

  async function handleSave(event: CustomEvent<Partial<User>>) {
    const userData = event.detail;
    try {
      if (userData.id) {
        await updateUser(userData.id, userData);
      } else {
        // <-- 2. Call the corrected 'createUser' function
        await createUser(userData);
      }
      showForm = false;
      await loadUsers();
    } catch (e) {
      alert(e.message);
    }
  }

  onMount(loadUsers);
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-3xl font-bold text-gray-800">User Management</h1>
    {#if !showForm}
      <button
        on:click={handleAddNew}
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow"
      >
        Add New User
      </button>
    {/if}
  </div>

  {#if showForm}
    <UserForm
      user={currentUser}
      on:save={handleSave}
      on:cancel={() => (showForm = false)}
    />
  {/if}

  {#if isLoading}
    <p class="p-4 text-center text-gray-500">Loading users...</p>
  {:else if error}
    <p class="p-4 text-center text-red-500 bg-red-100 rounded-md">{error}</p>
  {:else if !showForm}
    <UserList {users} on:edit={handleEdit} on:delete={handleDelete} />
  {/if}
</div>
