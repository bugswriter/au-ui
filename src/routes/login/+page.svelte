<script lang="ts">
  import { login } from "$lib/stores/auth";

  let email = ""; // Changed from 'username' to 'email'
  let password = "";
  let isLoading = false;
  let error: string | null = null;

  async function handleLogin() {
    isLoading = true;
    error = null;
    try {
      await login(email, password);
    } catch (e) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="p-8 bg-white rounded-lg shadow-xl w-full max-w-sm">
    <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
      e-rikshaw portal
    </h1>
    <form on:submit|preventDefault={handleLogin} class="space-y-4">
      <div>
        <!-- Changed label and input to be for 'email' -->
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <input
          type="email"
          id="email"
          bind:value={email}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Password</label
        >
        <input
          type="password"
          id="password"
          bind:value={password}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
          disabled={isLoading}
        />
      </div>

      <!-- Display login error message -->
      {#if error}
        <div class="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md">
          {error}
        </div>
      {/if}

      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Login"}
      </button>
    </form>
  </div>
</div>
