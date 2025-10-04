import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Home, Users, Settings, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import UserManagementTab from "./UserManagementTab";
import WorkflowConfigTab from "./WorkflowConfigTab";
import ReportsTab from "./ReportsTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [activeEmployees, setActiveEmployees] = useState<number | null>(null);
  const [managersCount, setManagersCount] = useState<number | null>(null);
  const [totalExpensesValue, setTotalExpensesValue] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<Array<any>>([]);

  const base = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <Home className="w-5 h-5" />,
      current: true,
    },
  ];

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("User added successfully!");
    e.currentTarget.reset();
  };

  useEffect(() => {
    // fetch users to compute stats
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${base}/api/admin/manage/users`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.users)) {
          const users = data.users;
          setTotalUsers(users.length);
          setManagersCount(users.filter((u: any) => u.role === 'manager').length);
          setActiveEmployees(users.filter((u: any) => u.role === 'employee').length);
        } else {
          setTotalUsers(null);
          setManagersCount(null);
          setActiveEmployees(null);
        }
      } catch (err) {
        setTotalUsers(null);
        setManagersCount(null);
        setActiveEmployees(null);
      }
    };

    // load expenses from localStorage for recent activity and total
    const loadExpenses = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
          // total expenses sum
          const total = stored.reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0);
          setTotalExpensesValue(total);
          // recent activities — take last 5
          const recent = stored.slice(-5).reverse().map((e: any) => ({
            user: e.submittedBy || e.user || 'Unknown',
            action: e.status === 'approved' ? 'approved an expense' : 'submitted an expense',
            amount: `${e.currency || '$'} ${e.amount}`,
            time: e.timeAgo || new Date(e.date || Date.now()).toLocaleString(),
          }));
          setRecentActivities(recent);
        } else {
          setTotalExpensesValue(null);
          setRecentActivities([]);
        }
      } catch (err) {
        setTotalExpensesValue(null);
        setRecentActivities([]);
      }
    };

    fetchUsers();
    loadExpenses();

    const onUsersUpdated = () => {
      fetchUsers();
    };
    window.addEventListener('users-updated', onUsersUpdated as EventListener);

    return () => {
      window.removeEventListener('users-updated', onUsersUpdated as EventListener);
    };
  }, []);

  return (
    <DashboardLayout role="admin" navigation={navigation}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground mt-1">Manage users, configure workflows, and oversee expenses</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="workflow">Workflow Config</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">

        <div className="grid gap-6 md:grid-cols-4">
          <StatCard title="Total Users" value={totalUsers !== null ? totalUsers.toString() : '—'} />
          <StatCard title="Active Employees" value={activeEmployees !== null ? activeEmployees.toString() : '—'} />
          <StatCard title="Managers" value={managersCount !== null ? managersCount.toString() : '—'} />
          <StatCard title="Total Expenses" value={totalExpensesValue !== null ? `$${totalExpensesValue.toLocaleString()}` : '—'} />
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
              <CardDescription>Configure expense approval rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="approval-threshold">Auto-Approve Under</Label>
                  <Input id="approval-threshold" type="number" placeholder="100" />
                  <p className="text-xs text-muted-foreground">Expenses below this amount are auto-approved</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approval-steps">Approval Steps</Label>
                  <Select defaultValue="2">
                    <SelectTrigger id="approval-steps">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Single Step (Manager)</SelectItem>
                      <SelectItem value="2">Two Steps (Manager → Finance)</SelectItem>
                      <SelectItem value="3">Three Steps (Manager → Finance → Director)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approval-rule">Approval Rule</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="approval-rule">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All approvers must approve</SelectItem>
                      <SelectItem value="majority">Majority approval (60%)</SelectItem>
                      <SelectItem value="any">Any approver can approve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest expense submissions and approvals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((a, i) => (
                  <ActivityItem key={i} user={a.user} action={a.action} amount={a.amount} time={a.time} />
                ))
              ) : (
                <p className="text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagementTab />
          </TabsContent>

          <TabsContent value="workflow" className="mt-6">
            <WorkflowConfigTab />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <Card>
    <CardContent className="p-6">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold text-foreground mt-2">{value}</h3>
    </CardContent>
  </Card>
);

const ActivityItem = ({
  user,
  action,
  amount,
  time,
}: {
  user: string;
  action: string;
  amount: string;
  time: string;
}) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0">
    <div>
      <p className="text-sm font-medium text-foreground">
        {user} <span className="text-muted-foreground">{action}</span>
      </p>
      <p className="text-xs text-muted-foreground mt-1">{time}</p>
    </div>
    <span className="text-sm font-semibold text-primary">{amount}</span>
  </div>
);

export default AdminDashboard;
