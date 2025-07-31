<script lang="ts">
  import "../app.css";
  import { user } from "$lib/stores/auth";
  import NavBar from "$lib/components/NavBar.svelte";
  import { page } from "$app/stores";

  let isMobileNavOpen = false;
</script>

<div class="antialiased text-gray-800">
  {#if $user}
    <div class="relative min-h-screen lg:flex">
      <!-- The NavBar is our sidebar. It has a high z-index for mobile. -->
      <NavBar bind:isMobileNavOpen currentPath={$page.url.pathname} />

      <!-- This main content wrapper now has a left margin on large screens to make space for the fixed sidebar -->
      <div class="flex-1 flex flex-col lg:ml-64">
        <!-- Top bar for mobile hamburger button. This will be above the main content on mobile. -->
        <header
          class="sticky top-0 bg-white/80 backdrop-blur-sm z-10 flex justify-between items-center p-4 border-b border-gray-200 lg:hidden"
        >
          <button
            on:click={() => (isMobileNavOpen = true)}
            class="text-gray-500 focus:outline-none"
            aria-label="Open sidebar"
          >
            <!-- Standard hamburger SVG icon -->
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        <!-- The page content itself, with a light gray background -->
        <main class="flex-1 p-6 bg-gray-100">
          <slot />
        </main>
      </div>
    </div>
  {:else}
    <!-- User is not logged in, render the login page -->
    <slot />
  {/if}
</div>
