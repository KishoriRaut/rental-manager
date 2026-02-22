import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, DollarSign, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: houses } = useQuery({
    queryKey: ["houses"],
    queryFn: async () => {
      if (!user) {
        console.log("No user authenticated, skipping dashboard houses query");
        return [];
      }
      
      // Add small delay to ensure auth is fully ready
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        const { data, error } = await supabase.from("houses").select("id");
        if (error) {
          console.error("Dashboard houses query error:", error);
          return [];
        }
        return data || [];
      } catch (err) {
        console.error("Dashboard houses fetch error:", err);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 15000, // Cache for 15 seconds
  });

  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      if (!user) {
        console.log("No user authenticated, skipping dashboard tenants query");
        return [];
      }
      
      // Add small delay to ensure auth is fully ready
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        const { data, error } = await supabase.from("tenants").select("id, monthly_rent, is_active");
        if (error) {
          console.error("Dashboard tenants query error:", error);
          return [];
        }
        return data || [];
      } catch (err) {
        console.error("Dashboard tenants fetch error:", err);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 15000, // Cache for 15 seconds
  });

  const now = new Date();
  const { data: billing } = useQuery({
    queryKey: ["billing-summary", now.getMonth() + 1, now.getFullYear()],
    queryFn: async () => {
      if (!user) {
        console.log("No user authenticated, skipping dashboard billing query");
        return [];
      }
      
      // Add small delay to prevent multiple simultaneous requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        console.log("Dashboard billing query for month/year:", now.getMonth() + 1, now.getFullYear());
        const { data, error } = await supabase
          .from("monthly_billing")
          .select("total_amount, paid_amount, payment_status")
          .eq("billing_month", now.getMonth() + 1)
          .eq("billing_year", now.getFullYear());
        if (error) {
          console.error("Dashboard billing query error details:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            month: now.getMonth() + 1,
            year: now.getFullYear()
          });
          return [];
        }
        console.log("Dashboard billing query successful, data:", data);
        return data || [];
      } catch (err) {
        console.error("Dashboard billing fetch error:", err);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 10000, // Cache for 10 seconds to prevent rapid refetches
  });

  const totalHouses = houses?.length ?? 0;
  const activeTenants = tenants?.filter(t => t && t.is_active).length ?? 0;
  const expectedRent = tenants?.filter(t => t && t.is_active).reduce((s, t) => s + Number(t.monthly_rent), 0) ?? 0;
  const collected = billing?.reduce((s, b) => b && s + Number(b.paid_amount), 0) ?? 0;
  const totalDue = billing?.reduce((s, b) => b && s + Number(b.total_amount) - Number(b.paid_amount), 0) ?? 0;
  const paidCount = billing?.filter(b => b && b.payment_status === "paid").length ?? 0;
  const partialCount = billing?.filter(b => b && b.payment_status === "partial").length ?? 0;
  const unpaidCount = billing?.filter(b => b && b.payment_status === "unpaid").length ?? 0;

  const cards = [
    { title: "Total Houses", value: totalHouses, icon: Building2, color: "text-primary" },
    { title: "Active Tenants", value: activeTenants, icon: Users, color: "text-accent" },
    { title: "Expected Rent", value: `Rs. ${expectedRent.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { title: "Collected", value: `Rs. ${collected.toLocaleString()}`, icon: CheckCircle2, color: "text-status-paid" },
    { title: "Total Due", value: `Rs. ${totalDue.toLocaleString()}`, icon: AlertCircle, color: "text-status-unpaid" },
  ];

  return (
    <div className="space-responsive-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-responsive-xl font-display font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Overview for {now.toLocaleString("default", { month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(c => (
          <Card key={c.title} className="card-responsive">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-responsive-lg font-bold font-display">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="card-responsive">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-paid-bg">
              <CheckCircle2 className="h-5 w-5 text-status-paid" />
            </div>
            <div>
              <p className="text-responsive-lg font-bold font-display">{paidCount}</p>
              <p className="text-sm text-muted-foreground">Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-responsive">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-partial-bg">
              <Clock className="h-5 w-5 text-status-partial" />
            </div>
            <div>
              <p className="text-responsive-lg font-bold font-display">{partialCount}</p>
              <p className="text-sm text-muted-foreground">Partial</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-responsive">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-unpaid-bg">
              <AlertCircle className="h-5 w-5 text-status-unpaid" />
            </div>
            <div>
              <p className="text-responsive-lg font-bold font-display">{unpaidCount}</p>
              <p className="text-sm text-muted-foreground">Unpaid</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
