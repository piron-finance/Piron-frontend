const stats = [
  { label: "Total Value Locked", value: "$47.2M" },
  { label: "Active Pools", value: "12" },
  { label: "Average APY", value: "19.8%" },
  { label: "Total Users", value: "8,947" },
];

export function Stats() {
  return (
    <section className="py-16 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-white/60 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
