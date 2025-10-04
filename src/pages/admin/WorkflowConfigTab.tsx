import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { GripVertical, Plus, Trash2 } from "lucide-react";

interface ApprovalStep {
  id: string;
  level: number;
  approver: string;
}

const WorkflowConfigTab = () => {
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>([
    { id: "1", level: 1, approver: "Manager" },
    { id: "2", level: 2, approver: "Finance" },
  ]);
  const [autoApproveThreshold, setAutoApproveThreshold] = useState("100");
  const [approvalRule, setApprovalRule] = useState("all");
  const [percentageRequired, setPercentageRequired] = useState("60");
  const [usePercentageRule, setUsePercentageRule] = useState(false);
  const [useSpecificApprover, setUseSpecificApprover] = useState(false);

  const addApprovalStep = () => {
    const newStep: ApprovalStep = {
      id: Date.now().toString(),
      level: approvalSteps.length + 1,
      approver: "",
    };
    setApprovalSteps([...approvalSteps, newStep]);
  };

  const removeApprovalStep = (id: string) => {
    setApprovalSteps(approvalSteps.filter((step) => step.id !== id));
  };

  const handleSaveConfiguration = () => {
    toast.success("Workflow configuration saved!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground">Workflow Configuration</h3>
        <p className="text-muted-foreground mt-1">Configure approval workflows and rules</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Auto-Approval Settings</CardTitle>
            <CardDescription>Set threshold for automatic approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">Auto-Approve Under ($)</Label>
              <Input
                id="threshold"
                type="number"
                value={autoApproveThreshold}
                onChange={(e) => setAutoApproveThreshold(e.target.value)}
                placeholder="100"
              />
              <p className="text-xs text-muted-foreground">
                Expenses below this amount are auto-approved
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Rules</CardTitle>
            <CardDescription>Define how approvals are processed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="approval-rule">Rule Type</Label>
              <Select value={approvalRule} onValueChange={setApprovalRule}>
                <SelectTrigger id="approval-rule">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All approvers must approve</SelectItem>
                  <SelectItem value="majority">Majority approval</SelectItem>
                  <SelectItem value="any">Any approver can approve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Steps</CardTitle>
          <CardDescription>Configure multi-level approval workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {approvalSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <div className="flex-1 space-y-2">
                <Label>Step {index + 1}</Label>
                <Select defaultValue={step.approver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select approver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="CFO">CFO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeApprovalStep(step.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addApprovalStep} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Approval Step
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Rules</CardTitle>
          <CardDescription>Configure hybrid approval rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Percentage-Based Approval</Label>
              <p className="text-sm text-muted-foreground">
                Require specific percentage of approvers
              </p>
            </div>
            <Switch checked={usePercentageRule} onCheckedChange={setUsePercentageRule} />
          </div>
          {usePercentageRule && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="percentage">Required Percentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                value={percentageRequired}
                onChange={(e) => setPercentageRequired(e.target.value)}
                placeholder="60"
                min="1"
                max="100"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Specific Approver Override</Label>
              <p className="text-sm text-muted-foreground">
                CFO approval auto-validates all expenses
              </p>
            </div>
            <Switch checked={useSpecificApprover} onCheckedChange={setUseSpecificApprover} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveConfiguration} className="w-full">
        Save Configuration
      </Button>
    </div>
  );
};

export default WorkflowConfigTab;
