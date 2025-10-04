import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { DollarSign, TrendingUp, CheckCircle, XCircle } from "lucide-react";

interface Expense {
  category: string;
  amount: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  paidBy: string;
}

const ReportsTab = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("expenses") || "[]");
    setExpenses(stored);

    const approved = stored.filter((e: Expense) => e.status === "approved").length;
    const rejected = stored.filter((e: Expense) => e.status === "rejected").length;
    const pending = stored.filter((e: Expense) => e.status === "pending").length;

    setStats({
      total: stored.length,
      approved,
      rejected,
      pending,
    });
  }, []);

  const categoryData = expenses.reduce((acc: any[], expense) => {
    const existing = acc.find((item) => item.category === expense.category);
    const amount = parseFloat(expense.amount) || 0;
    if (existing) {
      existing.amount += amount;
    } else {
      acc.push({ category: expense.category, amount });
    }
    return acc;
  }, []);

  const statusData = [
    { name: "Approved", value: stats.approved, color: "hsl(var(--success))" },
    { name: "Rejected", value: stats.rejected, color: "hsl(var(--destructive))" },
    { name: "Pending", value: stats.pending, color: "hsl(var(--pending))" },
  ];

  const trendData = expenses
    .reduce((acc: any[], expense) => {
      const date = new Date(expense.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const existing = acc.find((item) => item.date === date);
      const amount = parseFloat(expense.amount) || 0;
      if (existing) {
        existing.amount += amount;
      } else {
        acc.push({ date, amount });
      }
      return acc;
    }, [])
    .slice(-7);

  const topEmployees = expenses.reduce((acc: any[], expense) => {
    const existing = acc.find((item) => item.name === expense.paidBy);
    const amount = parseFloat(expense.amount) || 0;
    if (existing) {
      existing.amount += amount;
      existing.count += 1;
    } else {
      acc.push({ name: expense.paidBy, amount, count: 1 });
    }
    return acc;
  }, [])
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground">Reports & Analytics</h3>
        <p className="text-muted-foreground mt-1">Real-time expense insights and trends</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{stats.total}</h3>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{stats.approved}</h3>
              </div>
              <div className="p-3 rounded-lg bg-success/10 text-success">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{stats.rejected}</h3>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{stats.pending}</h3>
              </div>
              <div className="p-3 rounded-lg bg-pending/10 text-pending">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Total spending across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Status</CardTitle>
            <CardDescription>Distribution of expense statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Trend</CardTitle>
          <CardDescription>Daily expense submissions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Employees by Expense Volume</CardTitle>
          <CardDescription>Employees with highest total expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEmployees.map((employee, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.count} expenses</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-primary">${employee.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
