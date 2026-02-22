import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { Plus, Search, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

interface BillingRecord {
  id: string;
  tenant_id: string;
  house_id: string;
  billing_month: number;
  billing_year: number;
  rent_amount: number;
  water_bill_type: string;
  water_fixed_amount: number;
  water_units: number;
  water_rate: number;
  water_total: number;
  electricity_bill_type: string;
  electricity_fixed_amount: number;
  electricity_units: number;
  electricity_rate: number;
  electricity_total: number;
  sanitation_charge: number;
  extra_charges: any;
  total_amount: number;
  previous_month_dues?: number;
  grand_total?: number;
  paid_amount: number;
  remaining_due: number;
  payment_status: string;
  payment_date: string | null;
  payment_mode: string | null;
  created_at: string;
}

export default function Billing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const now = new Date();
  const [search, setSearch] = useState("");
  const [filterHouse, setFilterHouse] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<BillingRecord | null>(null);

  const initForm = () => ({
    tenant_id: "", house_id: "",
    billing_month: now.getMonth() + 1, billing_year: now.getFullYear(),
    rent_amount: 0,
    water_bill_type: "fixed", water_fixed_amount: 0, water_units: 0, water_rate: 0,
    electricity_bill_type: "fixed", electricity_fixed_amount: 0, electricity_units: 0, electricity_rate: 0,
    sanitation_charge: 0,
    extra_charges: [] as { label: string; amount: number }[],
    paid_amount: 0, payment_date: "", payment_mode: "cash" as string,
  });
  const [form, setForm] = useState(initForm());

  const { data: houses = [] } = useQuery({
    queryKey: ["houses"],
    queryFn: async () => {
      if (!user) return [];
      try {
        const { data, error } = await supabase.from("houses").select("id, name");
        if (error) return [];
        return data || [];
      } catch (err) {
        return [];
      }
    },
    enabled: !!user,
    staleTime: 15000,
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      if (!user) return [];
      try {
        const { data, error } = await supabase.from("tenants").select("id, name, house_id, monthly_rent, room_number");
        if (error) return [];
        return data || [];
      } catch (err) {
        return [];
      }
    },
    enabled: !!user,
    staleTime: 15000,
  });

  const { data: billing = [], isLoading } = useQuery({
    queryKey: ["billing"],
    queryFn: async () => {
      if (!user) return [];
      try {
        const { data, error } = await supabase.from("monthly_billing").select("*").order("billing_year, billing_month", { ascending: true });
        if (error) return [];
        return data as BillingRecord[];
      } catch (err) {
        return [];
      }
    },
    enabled: !!user,
    staleTime: 10000,
  });

  const tenantName = (id: string) => tenants.find(t => t.id === id)?.name || "—";
  const houseName = (id: string) => houses.find(h => h.id === id)?.name || "—";
  const filteredTenants = form.house_id ? tenants.filter(t => t.house_id === form.house_id) : tenants;

  const onTenantSelect = (tid: string) => {
    const t = tenants.find(x => x.id === tid);
    setForm(f => ({ ...f, tenant_id: tid, house_id: t?.house_id || f.house_id, rent_amount: Number(t?.monthly_rent) || 0 }));
  };

  const calcTotal = (f: typeof form) => {
    const waterTotal = f.water_bill_type === "meter_based" ? f.water_units * f.water_rate : f.water_fixed_amount;
    const electricityTotal = f.electricity_bill_type === "meter_based" ? f.electricity_units * f.electricity_rate : f.electricity_fixed_amount;
    return f.rent_amount + waterTotal + electricityTotal + f.sanitation_charge + f.extra_charges.reduce((s, e) => s + e.amount, 0);
  };

  const calcStatus = (total: number, paid: number) => {
    if (paid >= total) return "paid";
    if (paid > 0) return "partial";
    return "unpaid";
  };

  const liveTotal = calcTotal(form);

  const filtered = billing.filter(b => {
    const tenant = tenants.find(t => t.id === b.tenant_id);
    const tenantDisplayName = tenant?.name || "Unknown Tenant";
    const matchSearch = search === "" || tenantDisplayName.toLowerCase().includes(search.toLowerCase());
    const matchHouse = filterHouse === "all" || b.house_id === filterHouse;
    const matchMonth = filterMonth === "all" || b.billing_month === +filterMonth;
    const matchYear = filterYear === "all" || b.billing_year === +filterYear;
    const matchStatus = filterStatus === "all" || b.payment_status === filterStatus;
    return matchSearch && matchHouse && matchMonth && matchYear && matchStatus;
  });

  const save = useMutation({
    mutationFn: async () => {
      const total = calcTotal(form);
      const { error } = await supabase.from("monthly_billing").insert({
        user_id: user!.id,
        tenant_id: form.tenant_id,
        house_id: form.house_id,
        billing_month: form.billing_month,
        billing_year: form.billing_year,
        rent_amount: form.rent_amount,
        water_bill_type: form.water_bill_type,
        water_fixed_amount: form.water_fixed_amount || 0,
        water_units: form.water_units || 0,
        water_rate: form.water_rate || 0,
        electricity_bill_type: form.electricity_bill_type,
        electricity_fixed_amount: form.electricity_fixed_amount || 0,
        electricity_units: form.electricity_units || 0,
        electricity_rate: form.electricity_rate || 0,
        sanitation_charge: form.sanitation_charge || 0,
        extra_charges: form.extra_charges || [],
        total_amount: total,
        paid_amount: form.paid_amount || 0,
        payment_status: calcStatus(total, form.paid_amount),
        payment_date: form.payment_date || null,
        payment_mode: form.payment_mode || null,
        previous_month_dues: 0,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing"] });
      setDialogOpen(false);
      setForm(initForm());
      toast({ title: "Billing record created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("monthly_billing").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing"] });
      toast({ title: "Record deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Billing</h2>
          <p className="text-muted-foreground">Manage monthly billing and payments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Billing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Billing Record</DialogTitle>
              <DialogDescription>Add a new monthly billing record for a tenant</DialogDescription>
            </DialogHeader>
            <form onSubmit={e => { e.preventDefault(); save.mutate(); }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>House *</Label>
                  <Select value={form.house_id} onValueChange={v => setForm(f => ({ ...f, house_id: v, tenant_id: "" }))}>
                    <SelectTrigger><SelectValue placeholder="Select house" /></SelectTrigger>
                    <SelectContent>{houses.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tenant *</Label>
                  <Select value={form.tenant_id} onValueChange={onTenantSelect}>
                    <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                    <SelectContent>{filteredTenants.map(t => <SelectItem key={t.id} value={t.id}>{t.name} (Room {t.room_number})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select value={String(form.billing_month)} onValueChange={v => setForm(f => ({ ...f, billing_month: +v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{months.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={String(form.billing_year)} onValueChange={v => setForm(f => ({ ...f, billing_year: +v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rent Amount (Rs.)</Label>
                <Input type="number" min={0} value={form.rent_amount} onChange={e => setForm(f => ({ ...f, rent_amount: +e.target.value }))} />
              </div>
              <div className="rounded-lg border p-3 space-y-3">
                <Label className="font-semibold">Water Bill</Label>
                <Select value={form.water_bill_type} onValueChange={v => setForm(f => ({ ...f, water_bill_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="lump_sum">Lump Sum</SelectItem>
                    <SelectItem value="meter_based">Meter Based</SelectItem>
                  </SelectContent>
                </Select>
                {form.water_bill_type === "meter_based" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Units</Label>
                      <Input type="number" min={0} value={form.water_units} onChange={e => setForm(f => ({ ...f, water_units: +e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Rate</Label>
                      <Input type="number" min={0} value={form.water_rate} onChange={e => setForm(f => ({ ...f, water_rate: +e.target.value }))} />
                    </div>
                  </div>
                )}
                {form.water_bill_type !== "meter_based" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Fixed Amount</Label>
                    <Input type="number" min={0} value={form.water_fixed_amount} onChange={e => setForm(f => ({ ...f, water_fixed_amount: +e.target.value }))} />
                  </div>
                )}
              </div>
              <div className="rounded-lg border p-3 space-y-3">
                <Label className="font-semibold">Electricity Bill</Label>
                <Select value={form.electricity_bill_type} onValueChange={v => setForm(f => ({ ...f, electricity_bill_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="meter_based">Meter Based</SelectItem>
                  </SelectContent>
                </Select>
                {form.electricity_bill_type === "meter_based" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Units</Label>
                      <Input type="number" min={0} value={form.electricity_units} onChange={e => setForm(f => ({ ...f, electricity_units: +e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Rate</Label>
                      <Input type="number" min={0} value={form.electricity_rate} onChange={e => setForm(f => ({ ...f, electricity_rate: +e.target.value }))} />
                    </div>
                  </div>
                )}
                {form.electricity_bill_type !== "meter_based" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Fixed Amount</Label>
                    <Input type="number" min={0} value={form.electricity_fixed_amount} onChange={e => setForm(f => ({ ...f, electricity_fixed_amount: +e.target.value }))} />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Sanitation Charge (Rs.)</Label>
                <Input type="number" min={0} value={form.sanitation_charge} onChange={e => setForm(f => ({ ...f, sanitation_charge: +e.target.value }))} />
              </div>
              <div className="rounded-lg border p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Extra Charges</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setForm(f => ({ ...f, extra_charges: [...f.extra_charges, { label: "", amount: 0 }] }))}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {form.extra_charges.map((ex, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <Input 
                      placeholder="Label" 
                      value={ex.label} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updated = form.extra_charges.map((item, idx) => 
                          idx === i ? { ...item, label: e.target.value } : item
                        );
                        setForm(f => ({ ...f, extra_charges: updated }));
                      }} 
                    />
                    <Input 
                      type="number" 
                      placeholder="Amount" 
                      value={ex.amount} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updated = form.extra_charges.map((item, idx) => 
                          idx === i ? { ...item, amount: +e.target.value } : item
                        );
                        setForm(f => ({ ...f, extra_charges: updated }));
                      }} 
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm(f => ({ ...f, extra_charges: f.extra_charges.filter((_, idx) => idx !== i) }))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Paid Amount (Rs.)</Label>
                <Input type="number" min={0} value={form.paid_amount} onChange={e => setForm(f => ({ ...f, paid_amount: +e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Payment Date</Label>
                  <Input type="date" value={form.payment_date} onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Mode</Label>
                  <Select value={form.payment_mode} onValueChange={v => setForm(f => ({ ...f, payment_mode: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">Grand Total</p>
                <p className="text-3xl font-bold font-display">Rs. {liveTotal.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Remaining: Rs. {(liveTotal - form.paid_amount).toLocaleString()}</p>
              </div>
              <Button type="submit" className="w-full" disabled={save.isPending}>
                {save.isPending ? "Saving..." : "Create Bill"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by tenant..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterHouse} onValueChange={setFilterHouse}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Houses</SelectItem>
            {houses.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>House</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {isLoading ? "Loading..." : "No billing records"}
                    </TableCell>
                  </TableRow>
                ) : filtered.map(b => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{tenantName(b.tenant_id)}</TableCell>
                    <TableCell>{houseName(b.house_id)}</TableCell>
                    <TableCell>{months[b.billing_month - 1]} {b.billing_year}</TableCell>
                    <TableCell className="text-right">Rs. {Number(b.total_amount).toLocaleString()}</TableCell>
                    <TableCell className="text-right">Rs. {Number(b.paid_amount).toLocaleString()}</TableCell>
                    <TableCell className="text-right">Rs. {Number(b.remaining_due).toLocaleString()}</TableCell>
                    <TableCell><StatusBadge status={b.payment_status as any} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setViewRecord(b)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => remove.mutate(b.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!viewRecord} onOpenChange={open => !open && setViewRecord(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Billing Details</DialogTitle>
            <DialogDescription>View billing details</DialogDescription>
          </DialogHeader>
          {viewRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-muted-foreground">Tenant</p><p className="font-medium">{tenantName(viewRecord.tenant_id)}</p>
                <p className="text-muted-foreground">House</p><p className="font-medium">{houseName(viewRecord.house_id)}</p>
                <p className="text-muted-foreground">Period</p><p className="font-medium">{months[viewRecord.billing_month - 1]} {viewRecord.billing_year}</p>
                <p className="text-muted-foreground">Rent</p><p>Rs. {Number(viewRecord.rent_amount).toLocaleString()}</p>
                <p className="text-muted-foreground">Total</p><p>Rs. {Number(viewRecord.total_amount).toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-sm text-muted-foreground">Grand Total</p>
                <p className="text-2xl font-bold font-display">Rs. {Number(viewRecord.total_amount).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
