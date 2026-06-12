const stats = [
  { label: "New Users Today",  value: "48",    percent: 72, color: "bg-blue-500"   },
  { label: "Orders Completed", value: "134",   percent: 85, color: "bg-green-500"  },
  { label: "Pending Tickets",  value: "12",    percent: 30, color: "bg-orange-500" },
  { label: "Server Uptime",    value: "99.9%", percent: 99, color: "bg-purple-500" },
];

export default function QuickStats() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h2>
      <div className="flex flex-col gap-4">
        {stats.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-bold text-gray-800">{item.value}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`${item.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${item.percent}%` }}>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}