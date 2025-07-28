<script lang="ts">
  // This page is a "dead UI" for now, so no complex logic is needed.
  // We'll use hardcoded data for demonstration.

  const planStats = [
    { name: "Premium Plan", count: 450, color: "bg-blue-500" },
    { name: "Standard Plan", count: 621, color: "bg-green-500" },
    { name: "Basic Plan", count: 213, color: "bg-yellow-500" },
  ];

  const recentComplaints = [
    {
      id: "CMPT-0812",
      name: "Ramesh Singh",
      issue: "Network Connection Lost",
      status: "Open",
    },
    {
      id: "CMPT-0811",
      name: "Priya Sharma",
      issue: "Billing Discrepancy",
      status: "In Progress",
    },
    {
      id: "CMPT-0809",
      name: "Anjali Verma",
      issue: "Slow Speeds in Evening",
      status: "Open",
    },
    {
      id: "CMPT-0805",
      name: "Vikram Patel",
      issue: "Service Unavailable",
      status: "Resolved",
    },
  ];
</script>

<div class="space-y-8">
  <!-- Page Header -->
  <div>
    <h1 class="text-3xl font-bold text-gray-800">This Month's Summary</h1>
    <p class="mt-1 text-gray-500">Here you can visit the details.</p>
  </div>

  <!-- Stats Cards Grid -->
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
    <!-- Card 1: Total Subscribers -->
    <div
      class="bg-white p-6 rounded-lg shadow-md flex items-start justify-between"
    >
      <div>
        <h3 class="text-sm font-medium text-gray-500">Total Subscribers</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">1,284</p>
      </div>
      <div class="bg-blue-100 p-3 rounded-full">
        <!-- Heroicon: users -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197"
          /></svg
        >
      </div>
    </div>

    <!-- Card 2: Total Revenue -->
    <div
      class="bg-white p-6 rounded-lg shadow-md flex items-start justify-between"
    >
      <div>
        <h3 class="text-sm font-medium text-gray-500">Revenue (This Month)</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">₹ 8,42,500</p>
      </div>
      <div class="bg-green-100 p-3 rounded-full">
        <!-- Heroicon: bank-notes -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 004.5 3v-.75m0 0V3A.75.75 0 003.75 2.25h-.75m0 0h-.75A.75.75 0 002.25 3v.75m18 0V3a.75.75 0 00-.75-.75h-.75a.75.75 0 00-.75.75v.75m0 0v.75a.75.75 0 00.75.75h.75a.75.75 0 00.75-.75V4.5m0 0h.75a.75.75 0 00.75-.75V3a.75.75 0 00-.75-.75h-.75M6 13.5V12m0 1.5V12m0 1.5v-1.5m0 1.5a1.5 1.5 0 00-3 0m3 0a1.5 1.5 0 00-3 0m0 0V12m0 1.5a1.5 1.5 0 00-3 0m3 0V12m6-3V12m0 1.5V12m0 1.5v-1.5m0 1.5a1.5 1.5 0 00-3 0m3 0a1.5 1.5 0 00-3 0m0 0V12m0 1.5a1.5 1.5 0 00-3 0m3 0V12"
          /></svg
        >
      </div>
    </div>

    <!-- Card 3: Pending Payments -->
    <div
      class="bg-white p-6 rounded-lg shadow-md flex items-start justify-between"
    >
      <div>
        <h3 class="text-sm font-medium text-gray-500">Pending Payments</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">₹ 75,200</p>
      </div>
      <div class="bg-yellow-100 p-3 rounded-full">
        <!-- Heroicon: clock -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-yellow-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
      </div>
    </div>

    <!-- Card 4: Open Complaints -->
    <div
      class="bg-white p-6 rounded-lg shadow-md flex items-start justify-between"
    >
      <div>
        <h3 class="text-sm font-medium text-gray-500">Open Complaints</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">12</p>
      </div>
      <div class="bg-red-100 p-3 rounded-full">
        <!-- Heroicon: flag -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
          /></svg
        >
      </div>
    </div>
  </div>

  <!-- Lower Section Grid -->
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-5">
    <!-- Column 1: Plan Distribution -->
    <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Subscribers by Plan
      </h3>
      <div class="space-y-4">
        {#each planStats as plan}
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-gray-700">{plan.name}</span>
              <span class="text-sm font-medium text-gray-500">{plan.count}</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="{plan.color} h-2.5 rounded-full"
                style="width: {(plan.count / 1284) * 100}%"
              />
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Column 2: Recent Complaints Table -->
    <div class="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Recent Complaints
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th class="px-4 py-3">Complaint ID</th>
              <th class="px-4 py-3">Subscriber</th>
              <th class="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {#each recentComplaints as complaint}
              <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-900"
                  >{complaint.id}</td
                >
                <td class="px-4 py-3">{complaint.name}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 font-semibold leading-tight rounded-full text-xs
                                       {complaint.status === 'Open'
                      ? 'bg-red-100 text-red-700'
                      : ''}
                                       {complaint.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-700'
                      : ''}
                                       {complaint.status === 'Resolved'
                      ? 'bg-green-100 text-green-700'
                      : ''}"
                  >
                    {complaint.status}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
