export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Cross-client overview and system status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {["Total Clients", "Active Projects", "Revenue (MTD)", "System Health"].map((label) => (
          <div
            key={label}
            className="p-6 bg-card border border-border rounded-md"
          >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-display mt-2">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
