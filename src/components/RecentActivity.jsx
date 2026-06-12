const activities = [
  { user: "Alice Johnson", action: "Placed a new order",    time: "2 mins ago",  avatar: "AJ" },
  { user: "Bob Smith",     action: "Registered an account", time: "15 mins ago", avatar: "BS" },
  { user: "Carol White",   action: "Updated their profile", time: "1 hour ago",  avatar: "CW" },
  { user: "David Lee",     action: "Cancelled an order",    time: "3 hours ago", avatar: "DL" },
  { user: "Eva Martinez",  action: "Left a review",         time: "5 hours ago", avatar: "EM" },
];

export default function RecentActivity() {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
      <div className="flex flex-col gap-3">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
              {a.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{a.user}</p>
              <p className="text-xs text-gray-400">{a.action}</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}