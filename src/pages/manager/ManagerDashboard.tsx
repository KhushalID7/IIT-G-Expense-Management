import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Home, ClipboardCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Calendar, DollarSign, User } from "lucide-react";
import AllExpensesTab from "./AllExpensesTab";

interface Expense {
  id: string;
  amount: string;
  currency: string;
  category: string;
  date: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  paidBy: string;
}

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("approval");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("expenses") || "[]");
    setExpenses(stored.filter((e: Expense) => e.status === "pending"));
  }, []);

  const handleApprove = (id: string) => {
    const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const updated = allExpenses.map((e: Expense) =>
      e.id === id ? { ...e, status: "approved", managerComment: comment } : e
    );
    localStorage.setItem("expenses", JSON.stringify(updated));
    setExpenses(expenses.filter((e) => e.id !== id));
    toast.success("Expense approved successfully!");
    setComment("");
    setSelectedExpense(null);
  };

  const handleReject = (id: string) => {
    if (!comment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const updated = allExpenses.map((e: Expense) =>
      e.id === id ? { ...e, status: "rejected", managerComment: comment } : e
    );
    localStorage.setItem("expenses", JSON.stringify(updated));
    setExpenses(expenses.filter((e) => e.id !== id));
    toast.success("Expense rejected");
    setComment("");
    setSelectedExpense(null);
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/manager",
      icon: <Home className="w-5 h-5" />,
      current: true,
    },
  ];

  return (
    <DashboardLayout role="manager" navigation={navigation}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Manager Dashboard</h2>
          <p className="text-muted-foreground mt-1">Review and approve pending expense requests</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatCard title="Pending Approval" value={expenses.length.toString()} icon={<ClipboardCheck />} />
          <StatCard title="Approved Today" value="5" icon={<CheckCircle />} />
          <StatCard title="Total This Week" value="$8,420" icon={<DollarSign />} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approval">Approval Queue</TabsTrigger>
            <TabsTrigger value="all">All Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="approval" className="mt-6">
            <Card>
          <CardHeader>
            <CardTitle>Pending Expenses</CardTitle>
            <CardDescription>Review employee expense submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pending expenses to review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <Card key={expense.id} className="hover:shadow-elevated transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-semibold capitalize">{expense.category}</h4>
                              <StatusBadge status={expense.status} />
                            </div>
                            <p className="text-sm text-muted-foreground">{expense.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                Employee Name
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(expense.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {expense.currency} {expense.amount}
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedExpense === expense.id && (
                          <div className="space-y-3 pt-4 border-t">
                            <div className="space-y-2">
                              <Label htmlFor={`comment-${expense.id}`}>Comments (optional)</Label>
                              <Textarea
                                id={`comment-${expense.id}`}
                                placeholder="Add your comments..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          {selectedExpense === expense.id ? (
                            <>
                              <Button
                                onClick={() => handleApprove(expense.id)}
                                className="flex-1 bg-success hover:bg-success/90"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirm Approval
                              </Button>
                              <Button
                                onClick={() => handleReject(expense.id)}
                                variant="destructive"
                                className="flex-1"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Confirm Rejection
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedExpense(null);
                                  setComment("");
                                }}
                                variant="outline"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => setSelectedExpense(expense.id)}
                                variant="outline"
                                className="flex-1"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => setSelectedExpense(expense.id)}
                                variant="outline"
                                className="flex-1"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <AllExpensesTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mt-2">{value}</h3>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

export default ManagerDashboard;
