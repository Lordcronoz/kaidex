export default function ClientDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your projects and activity</p>
      </div>

      {/* Placeholder — will be built out in Phase 4 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {["Active Projects", "Pending Invoices", "Unread Messages"].map((label) => (
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
