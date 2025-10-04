import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent mb-6">
            <Building2 className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            ExpenseFlow
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Modern expense management that streamlines approvals, tracks spending, and keeps your team productive
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Lightning Fast"
            description="Submit and approve expenses in seconds with our intuitive interface and smart workflows"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Secure & Compliant"
            description="Bank-level security with role-based access controls and full audit trails"
          />
          <FeatureCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Smart Approvals"
            description="Configurable approval workflows with multi-level rules and automatic notifications"
          />
        </div>

        {/* Stats Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="500+" label="Companies" />
            <StatCard number="50K+" label="Expenses Processed" />
            <StatCard number="95%" label="Approval Rate" />
            <StatCard number="2min" label="Avg. Response Time" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="group p-6 rounded-2xl border bg-card hover:shadow-elevated transition-all hover:border-primary/50">
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{number}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default Index;
