import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Home, FileText, Plus } from "lucide-react";
import ExpenseSubmission from "./ExpenseSubmission";
import ExpenseList from "./ExpenseList";

const EmployeeDashboard = () => {
  const location = useLocation();
  const [currentView, setCurrentView] = useState("overview");

  const navigation = [
    {
      name: "Overview",
      href: "/employee",
      icon: <Home className="w-5 h-5" />,
      current: currentView === "overview",
    },
    {
      name: "Submit Expense",
      href: "/employee/submit",
      icon: <Plus className="w-5 h-5" />,
      current: currentView === "submit",
    },
    {
      name: "My Expenses",
      href: "/employee/expenses",
      icon: <FileText className="w-5 h-5" />,
      current: currentView === "expenses",
    },
  ];

  // Simple routing based on pathname
  const renderContent = () => {
    if (location.pathname.includes("/submit")) {
      return <ExpenseSubmission />;
    }
    if (location.pathname.includes("/expenses")) {
      return <ExpenseList />;
    }
    return <EmployeeOverview setCurrentView={setCurrentView} />;
  };

  return <DashboardLayout role="employee" navigation={navigation}>{renderContent()}</DashboardLayout>;
};

const EmployeeOverview = ({ setCurrentView }: { setCurrentView: (view: string) => void }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Welcome back!</h2>
        <p className="text-muted-foreground mt-1">Manage your expenses and track approvals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Expenses"
          value="$12,450"
          description="All time"
          trend="+12% from last month"
        />
        <StatCard
          title="Pending Approval"
          value="3"
          description="Awaiting review"
          trend="2 in final stage"
        />
        <StatCard
          title="Approved This Month"
          value="$3,240"
          description="January 2025"
          trend="8 expenses approved"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <QuickActionCard
          title="Submit New Expense"
          description="Upload receipts and submit for approval"
          onClick={() => setCurrentView("submit")}
          icon={<Plus className="w-6 h-6" />}
        />
        <QuickActionCard
          title="View All Expenses"
          description="Track status and view history"
          onClick={() => setCurrentView("expenses")}
          icon={<FileText className="w-6 h-6" />}
        />
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  description,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  trend: string;
}) => (
  <div className="rounded-xl border bg-card p-6 shadow-card hover:shadow-elevated transition-shadow">
    <p className="text-sm font-medium text-muted-foreground">{title}</p>
    <h3 className="text-3xl font-bold text-foreground mt-2">{value}</h3>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
    <p className="text-xs text-primary mt-2">{trend}</p>
  </div>
);

const QuickActionCard = ({
  title,
  description,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  onClick: () => void;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="group rounded-xl border bg-card p-6 shadow-card hover:shadow-elevated transition-all hover:border-primary/50 text-left"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export default EmployeeDashboard;
