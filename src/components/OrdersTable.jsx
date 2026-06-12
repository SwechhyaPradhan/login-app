const orders = [
  { id: "#ORD001", customer: "Alice Johnson", product: "MacBook Pro",  amount: "$1,299", status: "Delivered", color: "bg-green-100 text-green-600"   },
  { id: "#ORD002", customer: "Bob Smith",     product: "iPhone 15",    amount: "$999",   status: "Pending",   color: "bg-yellow-100 text-yellow-600" },
  { id: "#ORD003", customer: "Carol White",   product: "AirPods Pro",  amount: "$249",   status: "Delivered", color: "bg-green-100 text-green-600"   },
  { id: "#ORD004", customer: "David Lee",     product: "iPad Air",     amount: "$599",   status: "Cancelled", color: "bg-red-100 text-red-600"       },
  { id: "#ORD005", customer: "Eva Martinez",  product: "Apple Watch",  amount: "$399",   status: "Pending",   color: "bg-yellow-100 text-yellow-600" },
];

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="py-3 font-medium text-blue-500">{order.id}</td>
                <td className="py-3 text-gray-700">{order.customer}</td>
                <td className="py-3 text-gray-600">{order.product}</td>
                <td className="py-3 font-medium text-gray-800">{order.amount}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.color}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}