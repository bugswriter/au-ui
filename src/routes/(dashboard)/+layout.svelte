<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte";
  import { page } from "$app/stores"; // <-- 1. Import 'page' store here
  import "../../app.css";

  let isMobileNavOpen = false;
</script>

<div class="min-h-screen bg-gray-100">
  <!-- 2. Pass the current path as a prop -->
  <NavBar bind:isMobileNavOpen currentPath={$page.url.pathname} />

  <!-- Main Content Area with padding for the fixed desktop sidebar -->
  <div class="lg:pl-64">
    <!-- Mobile-only Header -->
    <header
      class="lg:hidden sticky top-0 bg-white/90 backdrop-blur-sm
                   flex items-center justify-between h-16 px-4 border-b border-gray-200 z-20"
    >
      <a href="/" class="text-xl font-bold text-gray-900">Amar Ujala</a>
      <button
        on:click={() => (isMobileNavOpen = !isMobileNavOpen)}
        class="p-2"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-4 6h4"
          />
        </svg>
      </button>
    </header>

    <!-- Page Content -->
    <main class="p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
  </div>
</div>
