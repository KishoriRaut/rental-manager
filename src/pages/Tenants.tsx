import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tenant {
  id: string;
  name: string;
  phone: string | null;
  citizenship_number: string | null;
  address: string | null;
  occupation: string | null;
  family_members: number | null;
  house_id: string;
  room_number: string;
  monthly_rent: number;
  move_in_date: string;
  is_active: boolean;
  remarks: string | null;
}

const emptyForm = {
  name: "", phone: "", citizenship_number: "", address: "", occupation: "",
  family_members: 0, house_id: "", room_number: "", monthly_rent: 0,
  move_in_date: new Date().toISOString().split("T")[0], is_active: true, remarks: "",
};

export default function Tenants() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterHouse, setFilterHouse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: houses = [] } = useQuery({
    queryKey: ["houses"],
    queryFn: async () => {
      if (!user) {
        console.log("No user authenticated, skipping houses query");
        return [];
      }
      try {
        const { data, error } = await supabase.from("houses").select("id, name");
        if (error) {
          if (error.code === '400' || error.message?.includes('invalid input syntax')) {
            console.warn("Houses query validation error:", error);
            return [];
          }
          console.error("Houses query error:", error);
          return [];
        }
        return data;
      } catch (err) {
        console.error("Houses fetch error:", err);
        return [];
      }
    },
    enabled: !!user,
  });

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      if (!user) {
        console.log("No user authenticated, skipping tenants query");
        return [];
      }
      try {
        const { data, error } = await supabase.from("tenants").select("*").order("created_at", { ascending: false });
        if (error) {
          if (error.code === 'PGRST301' || error.message?.includes('JWT expired')) {
            console.warn("JWT token expired in tenants query, attempting refresh...");
            const { data: { session } } = await supabase.auth.refreshSession();
            if (session) {
              // Retry the query with refreshed token
              const { data: retryData, error: retryError } = await supabase.from("tenants").select("*").order("created_at", { ascending: false });
              if (retryError) {
                console.error("Tenants query retry error:", retryError);
                return [];
              }
              return retryData as Tenant[];
            }
          }
          if (error.code === '400' || error.message?.includes('invalid input syntax')) {
            console.warn("Tenants query validation error:", error);
            return [];
          }
          console.error("Tenants query error:", error);
          return [];
        }
        return data as Tenant[];
      } catch (err) {
        console.error("Tenants fetch error:", err);
        return [];
      }
    },
    enabled: !!user,
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name, phone: form.phone || null, citizenship_number: form.citizenship_number || null,
        address: form.address || null, occupation: form.occupation || null, family_members: form.family_members,
        house_id: form.house_id, room_number: form.room_number, monthly_rent: form.monthly_rent,
        move_in_date: form.move_in_date, is_active: form.is_active, remarks: form.remarks || null,
      };
      if (editing) {
        const { error } = await supabase.from("tenants").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tenants").insert({ ...payload, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tenants"] });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
      toast({ title: editing ? "Tenant updated" : "Tenant added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tenants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tenants"] }); toast({ title: "Tenant deleted" }); },
  });

  const filtered = tenants.filter(t => {
    const matchSearch = t.room_number ? t.room_number.toLowerCase().includes(search.toLowerCase()) : false;
    const matchName = filterName === "" || (t.name && t.name.toLowerCase().includes(filterName.toLowerCase()));
    const matchHouse = filterHouse === "all" || t.house_id === filterHouse;
    const matchStatus = filterStatus === "all" || (filterStatus === "active" ? t.is_active : !t.is_active);
    return matchSearch && matchName && matchHouse && matchStatus;
  });

  const openEdit = (t: Tenant) => {
    setEditing(t);
    setForm({
      name: t.name, phone: t.phone || "", citizenship_number: t.citizenship_number || "",
      address: t.address || "", occupation: t.occupation || "", family_members: t.family_members || 0,
      house_id: t.house_id, room_number: t.room_number, monthly_rent: t.monthly_rent,
      move_in_date: t.move_in_date, is_active: t.is_active, remarks: t.remarks || "",
    });
    setDialogOpen(true);
  };

  const openNew = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };

  const houseName = (id: string) => houses.find(h => h.id === id)?.name || "—";

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Tenants</h2>
          <p className="text-muted-foreground text-sm">{tenants.length} tenants</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Tenant</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? "Edit Tenant" : "Add Tenant"}</DialogTitle>
              <DialogDescription>
                {editing ? "Edit the tenant's information and details." : "Add a new tenant to the system."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={e => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2"><Label>Full Name *</Label><Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Citizenship No.</Label><Input value={form.citizenship_number} onChange={e => setForm(f => ({ ...f, citizenship_number: e.target.value }))} /></div>
                <div className="space-y-2 col-span-2"><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Occupation</Label><Input value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Family Members</Label><Input type="number" min={0} value={form.family_members} onChange={e => setForm(f => ({ ...f, family_members: +e.target.value }))} /></div>
                <div className="space-y-2">
                  <Label>House *</Label>
                  <Select value={form.house_id} onValueChange={v => setForm(f => ({ ...f, house_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select house" /></SelectTrigger>
                    <SelectContent>{houses.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Room No. *</Label><Input required value={form.room_number} onChange={e => setForm(f => ({ ...f, room_number: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Monthly Rent (Rs.) *</Label><Input type="number" min={0} required value={form.monthly_rent} onChange={e => setForm(f => ({ ...f, monthly_rent: +e.target.value }))} /></div>
                <div className="space-y-2"><Label>Move-in Date *</Label><Input type="date" required value={form.move_in_date} onChange={e => setForm(f => ({ ...f, move_in_date: e.target.value }))} /></div>
                <div className="space-y-2 col-span-2"><Label>Remarks</Label><Textarea value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} /></div>
                <div className="flex items-center gap-2 col-span-2">
                  <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
                  <Label>Active</Label>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={save.isPending}>{save.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search room number..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Filter by tenant name..." className="pl-9" value={filterName} onChange={e => setFilterName(e.target.value)} />
        </div>
        <Select value={filterHouse} onValueChange={setFilterHouse}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Houses</SelectItem>
            {houses.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>House</TableHead>
                <TableHead>Room</TableHead>
                <TableHead className="text-right">Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{isLoading ? "Loading..." : "No tenants found"}</TableCell></TableRow>
              ) : filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{houseName(t.house_id)}</TableCell>
                  <TableCell>{t.room_number}</TableCell>
                  <TableCell className="text-right">Rs. {Number(t.monthly_rent).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={t.is_active ? "status-paid border-0" : "status-unpaid border-0"}>
                      {t.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove.mutate(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
