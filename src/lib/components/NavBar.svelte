<script lang="ts">
  // We no longer need to import 'page' here
  import { logout } from "$lib/stores/auth";

  export let isMobileNavOpen = false;
  export let currentPath: string; // <-- 1. Accept the path as a prop

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/users", label: "Users" },
    { href: "/subscribers", label: "Subscribers" },
    { href: "/payments", label: "Payments" },
    { href: "/reports", label: "Reports" },
    { href: "/complaints", label: "Complaints" },
  ];
</script>

<!-- Backdrop for mobile nav -->
{#if isMobileNavOpen}
  <div
    on:click={() => (isMobileNavOpen = false)}
    on:keydown
    class="fixed inset-0 bg-black/60 z-30 lg:hidden"
    aria-hidden="true"
  ></div>
{/if}

<!-- Sidebar Navigation -->
<aside
  class="fixed top-0 left-0 h-full w-64 bg-gray-800 text-gray-200 p-4
           flex flex-col z-40 transition-transform transform
           {isMobileNavOpen
    ? 'translate-x-0'
    : '-translate-x-full'} lg:translate-x-0"
>
  <div class="mb-8 text-center">
    <a
      href="/"
      class="font-script text-4xl font-extrabold tracking-tight text-white drop-shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out glow"
    >
      <span
        class="bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent"
      >
        amar ujala
      </span>
    </a>
  </div>
  <!-- Navigation Links -->
  <ul class="flex-grow space-y-2">
    {#each navItems as item}
      <li>
        <!-- 2. Use the 'currentPath' prop for comparison -->
        <a
          href={item.href}
          class="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700"
          class:bg-blue-600={currentPath === item.href}
          class:text-white={currentPath === item.href}
          class:hover:bg-blue-700={currentPath === item.href}
        >
          {item.label}
        </a>
      </li>
    {/each}
  </ul>

  <!-- Admin Section -->
  <div class="mt-auto">
    <div class="p-2 border-t border-gray-700 flex justify-between items-center">
      <p class="font-semibold text-white">Admin</p>
      <button on:click={logout} class="text-sm text-red-400 hover:underline">
        Logout
      </button>
    </div>
  </div>
</aside>
