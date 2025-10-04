import { useState } from "react";
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
          <StatCard title="Total Users" value="24" />
          <StatCard title="Active Employees" value="18" />
          <StatCard title="Managers" value="4" />
          <StatCard title="Total Expenses" value="$45,230" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Create a new user account and assign role</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input id="user-email" type="email" placeholder="user@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input id="user-name" type="text" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select required>
                    <SelectTrigger id="user-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Add User</Button>
              </form>
            </CardContent>
          </Card>

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
              <ActivityItem
                user="John Doe"
                action="submitted an expense"
                amount="$245.00"
                time="2 minutes ago"
              />
              <ActivityItem
                user="Jane Smith"
                action="approved an expense"
                amount="$89.50"
                time="15 minutes ago"
              />
              <ActivityItem
                user="Mike Johnson"
                action="submitted an expense"
                amount="$1,250.00"
                time="1 hour ago"
              />
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
