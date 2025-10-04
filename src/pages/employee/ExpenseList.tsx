import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import ProgressTracker from "@/components/ProgressTracker";
import { Search, Calendar, DollarSign } from "lucide-react";

interface Expense {
  id: string;
  amount: string;
  currency: string;
  category: string;
  date: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("expenses") || "[]");
    setExpenses(stored);
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || expense.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getProgressSteps = (status: string) => {
    const steps = [
      { name: "Submitted", status: "complete" as const },
      { name: "Manager Review", status: status === "pending" ? "current" as const : "complete" as const },
      { name: "Approved", status: status === "approved" ? "complete" as const : "upcoming" as const },
    ];
    return steps;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">My Expenses</h2>
        <p className="text-muted-foreground mt-1">Track and manage your submitted expenses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No expenses found</p>
              <Button className="mt-4" onClick={() => window.location.href = "/employee/submit"}>
                Submit Your First Expense
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredExpenses.map((expense) => (
            <Card key={expense.id} className="hover:shadow-elevated transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-foreground capitalize">
                            {expense.category}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{expense.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                    <StatusBadge status={expense.status} />
                  </div>

                  <div className="pt-4 border-t">
                    <ProgressTracker steps={getProgressSteps(expense.status)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
