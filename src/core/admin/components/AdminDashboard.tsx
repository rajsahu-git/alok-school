import AdminCard from "@/core/admin/components/AdminCard";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, Admin
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminCard
          title="Total Users"
          value={1284}
          trend={{ value: 12, label: "from last month", positive: true }}
          description="+201 new this week"
        />
        <AdminCard
          title="Revenue"
          value="$24,580"
          trend={{ value: 8.2, label: "from last month", positive: true }}
          description="+3,420 this week"
        />
        <AdminCard
          title="Active Sessions"
          value={89}
          trend={{ value: 4, label: "from yesterday", positive: true }}
          description="Currently online"
        />
        <AdminCard
          title="Pending Orders"
          value={23}
          trend={{ value: 2, label: "from yesterday", positive: false }}
          description="Requires attention"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Recent Activity */}
        <div className="md:col-span-2 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="font-medium text-foreground">
                  New user registration
                </p>
                <p className="text-sm text-muted-foreground">
                  John Doe joined the platform
                </p>
              </div>
              <span className="text-sm text-muted-foreground">2 min ago</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="font-medium text-foreground">
                  Order completed
                </p>
                <p className="text-sm text-muted-foreground">
                  Order #12345 has been delivered
                </p>
              </div>
              <span className="text-sm text-muted-foreground">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="font-medium text-foreground">
                  Payment received
                </p>
                <p className="text-sm text-muted-foreground">
                  $1,250.00 from Jane Smith
                </p>
              </div>
              <span className="text-sm text-muted-foreground">3 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  New review posted
                </p>
                <p className="text-sm text-muted-foreground">
                  5-star review on Product X
                </p>
              </div>
              <span className="text-sm text-muted-foreground">5 hours ago</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <button className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New User
            </button>
            <button className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Create Order
            </button>
            <button className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              View Reports
            </button>
            <button className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
