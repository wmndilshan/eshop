import React from 'react';

interface OverviewProps {
  shopName: string;
  ratings: number;
}

export function OverviewView({ shopName, ratings }: OverviewProps) {
  const stats = [
    { title: 'Total Sales Revenue', value: 'LKR 148,250', change: '+12.4% this month', icon: '💰' },
    { title: 'Completed Orders', value: '54', change: '+8 new orders today', icon: '📦' },
    { title: 'Average Shop Rating', value: `${ratings.toFixed(1)} / 5.0`, change: 'Based on 14 reviews', icon: '⭐' },
    { title: 'Active Listing Items', value: '18', change: 'Fully stocked in stock', icon: '🏷️' },
  ];

  const recentOrders = [
    { id: 'ORD-5542', customer: 'Nilantha Bandara', item: 'Organic Ceylon Cinnamon', amount: 'LKR 3,450', date: 'Today, 11:20 AM', status: 'Completed' },
    { id: 'ORD-5541', customer: 'Priyani Silva', item: 'Handmade Coconut Shell Teacup Set', amount: 'LKR 8,900', date: 'Today, 08:15 AM', status: 'Pending' },
    { id: 'ORD-5540', customer: 'Dulaj Perera', item: 'Pure Ceylon Black Tea 1kg', amount: 'LKR 5,200', date: 'Yesterday', status: 'Completed' },
    { id: 'ORD-5539', customer: 'Fathima Rizan', item: 'Traditional Brass Oil Lamp', amount: 'LKR 14,500', date: 'Yesterday', status: 'Completed' },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="p-6 bg-[var(--cultured)]/30 border border-[var(--cultured)] rounded-xl">
        <h3 className="text-xl font-bold text-[var(--eerie-black)] mb-1">Welcome back to {shopName}!</h3>
        <p className="text-sm text-[var(--sonic-silver)]">Here is what is happening with your storefront performance indicators today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="card p-6 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[var(--sonic-silver)] tracking-wider uppercase">
                {stat.title}
              </span>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-[var(--eerie-black)] tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs font-semibold text-[var(--salmon-pink)] mt-1">
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart using clean responsive SVGs */}
        <div className="card p-6 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-[var(--cultured)]">
            <h4 className="font-bold text-[var(--eerie-black)]">Sales Revenue Trend (LKR)</h4>
            <span className="text-xs text-[var(--sonic-silver)] font-bold bg-[var(--cultured)] px-2.5 py-1 rounded">Last 6 Months</span>
          </div>
          <div className="relative h-64 w-full flex items-end">
            {/* SVG graph representation */}
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--salmon-pink)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--salmon-pink)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="var(--cultured)" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="var(--cultured)" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="var(--cultured)" strokeWidth="1" strokeDasharray="5,5" />
              {/* Area path */}
              <path
                d="M 10 180 Q 90 140, 170 110 T 330 90 T 410 70 T 490 50 L 490 190 L 10 190 Z"
                fill="url(#chartGradient)"
              />
              {/* Line path */}
              <path
                d="M 10 180 Q 90 140, 170 110 T 330 90 T 410 70 T 490 50"
                fill="none"
                stroke="var(--eerie-black)"
                strokeWidth="3"
              />
              {/* Dots */}
              <circle cx="10" cy="180" r="4" fill="var(--white)" stroke="var(--eerie-black)" strokeWidth="2" />
              <circle cx="100" cy="140" r="4" fill="var(--white)" stroke="var(--eerie-black)" strokeWidth="2" />
              <circle cx="200" cy="100" r="4" fill="var(--white)" stroke="var(--eerie-black)" strokeWidth="2" />
              <circle cx="300" cy="92" r="4" fill="var(--white)" stroke="var(--eerie-black)" strokeWidth="2" />
              <circle cx="400" cy="72" r="4" fill="var(--white)" stroke="var(--eerie-black)" strokeWidth="2" />
              <circle cx="490" cy="50" r="4" fill="var(--white)" stroke="var(--eerie-black)" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-[var(--sonic-silver)] font-semibold px-2">
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="card p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-[var(--cultured)]">
            <h4 className="font-bold text-[var(--eerie-black)]">Order Categories</h4>
            <span className="text-xs text-[var(--sonic-silver)] font-bold">Share %</span>
          </div>
          <div className="space-y-4 pt-2">
            {[
              { category: 'Ceylon Tea & Groceries', count: 24, percent: 45, color: 'bg-green-500' },
              { category: 'Ceylon Handicrafts', count: 15, percent: 28, color: 'bg-orange-400' },
              { category: 'Fashion & Clothing', count: 9, percent: 17, color: 'bg-indigo-500' },
              { category: 'Other Accessories', count: 6, percent: 10, color: 'bg-slate-400' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--davys-gray)]">{cat.category}</span>
                  <span className="text-[var(--eerie-black)]">{cat.count} ({cat.percent}%)</span>
                </div>
                <div className="w-full h-2.5 bg-[var(--cultured)] rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="card p-6 space-y-4">
        <h4 className="font-bold text-[var(--eerie-black)] pb-4 border-b border-[var(--cultured)]">
          Recent Received Orders
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--cultured)] text-[var(--sonic-silver)] font-bold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Purchased Item</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Purchased Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--cultured)] hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[var(--eerie-black)]">{order.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-[var(--davys-gray)]">{order.customer}</td>
                  <td className="py-3.5 px-4 text-[var(--davys-gray)]">{order.item}</td>
                  <td className="py-3.5 px-4 font-bold text-[var(--eerie-black)]">{order.amount}</td>
                  <td className="py-3.5 px-4 text-[var(--sonic-silver)]">{order.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`
                        badge
                        ${order.status === 'Completed' ? 'badge-success' : 'badge-accent'}
                      `}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
