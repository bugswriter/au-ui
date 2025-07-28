<script lang="ts">
  const fakePayments = [
    {
      id: "TXN12345",
      name: "Ramesh Kumar",
      plan: "Premium",
      amount: 799,
      date: "2025-07-25",
      status: "Paid",
    },
    {
      id: "TXN12346",
      name: "Priya Sharma",
      plan: "Standard",
      amount: 499,
      date: "2025-07-26",
      status: "Paid",
    },
    {
      id: "TXN12347",
      name: "Anjali Verma",
      plan: "Premium",
      amount: 799,
      date: "2025-07-27",
      status: "Paid",
    },
    {
      id: "TXN12348",
      name: "Sunita Devi",
      plan: "Basic",
      amount: 299,
      date: "2025-07-28",
      status: "Pending",
    },
    {
      id: "TXN12349",
      name: "Vikram Patel",
      plan: "Standard",
      amount: 499,
      date: "2025-07-28",
      status: "Failed",
    },
    {
      id: "TXN12350",
      name: "Amit Singh",
      plan: "Basic",
      amount: 299,
      date: "2025-07-29",
      status: "Paid",
    },
  ];
</script>

<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold text-gray-800">Payments History</h1>
    <p class="mt-1 text-gray-500">
      View and manage all subscriber payment transactions.
    </p>
  </div>

  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">All Transactions</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th class="px-4 py-3">Transaction ID</th>
            <th class="px-4 py-3">Subscriber Name</th>
            <th class="px-4 py-3">Plan</th>
            <th class="px-4 py-3">Amount</th>
            <th class="px-4 py-3">Date</th>
            <th class="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {#each fakePayments as payment}
            <tr class="border-b hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-900">{payment.id}</td>
              <td class="px-4 py-3">{payment.name}</td>
              <td class="px-4 py-3">{payment.plan}</td>
              <td class="px-4 py-3">₹ {payment.amount}</td>
              <td class="px-4 py-3">{payment.date}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 font-semibold leading-tight rounded-full text-xs
                                   {payment.status === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : ''}
                                   {payment.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : ''}
                                   {payment.status === 'Failed'
                    ? 'bg-red-100 text-red-700'
                    : ''}"
                >
                  {payment.status}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
