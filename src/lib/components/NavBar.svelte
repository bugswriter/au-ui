<script lang="ts">
	import { logout, user } from '$lib/stores/auth';

	export let isMobileNavOpen = false;
	export let currentPath: string;

	const navItems = [
		{ href: '/', label: 'Dashboard' },
		{ href: '/subscribers', label: 'Subscribers' },
		{ href: '/payments', label: 'Payments' },
		{ href: '/reports', label: 'Reports' },
		{ href: '/complaints', label: 'Complaints' }
	];

	const adminNavItems = [{ href: '/users', label: 'Manage Users' }];

	const isActive = (href: string) => {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	};
</script>

<!-- Backdrop for mobile nav -->
{#if isMobileNavOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		on:click={() => (isMobileNavOpen = false)}
		class="fixed inset-0 bg-black/60 z-30 lg:hidden"
		aria-hidden="true"
	></div>
{/if}

<!-- Sidebar Navigation -->
<aside
	class="fixed top-0 left-0 h-full w-64 bg-gray-900 text-gray-300
           flex flex-col z-40 transition-transform transform
           {isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0"
>
	<!-- Logo / Header -->
	<div class="h-16 flex items-center px-4">
		<a href="/" class="text-xl font-bold text-white">ISP Panel</a>
	</div>

	<!-- Main Navigation Links -->
	<nav class="flex-1 px-2 py-4 space-y-1">
		{#each navItems as item}
			<a href={item.href} class="nav-link" class:nav-link-active={isActive(item.href)}>
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>

	<!-- Admin Section / User Profile -->
	<div class="px-2 py-4">
		<div class="mb-4">
			{#each adminNavItems as item}
				<a href={item.href} class="nav-link" class:nav-link-active={isActive(item.href)}>
					<span>{item.label}</span>
				</a>
			{/each}
		</div>

		<!-- User Profile & Logout -->
		<div class="flex items-center justify-between p-3 bg-gray-800 rounded-md">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
					{$user?.initial ?? 'A'}
				</div>
				<div>
					<p class="text-sm font-semibold text-white">{$user?.name ?? 'Admin'}</p>
					<p class="text-xs text-gray-400">{$user?.email ?? ''}</p>
				</div>
			</div>
			<button on:click={logout} class="text-sm text-indigo-300 hover:underline" aria-label="Logout">
				Logout
			</button>
		</div>
	</div>
</aside>

<style>
	@reference '../../app.css';
	.nav-link { @apply block px-3 py-2.5 rounded-md text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white; }
	.nav-link-active { @apply bg-gray-800 text-white; }
</style>