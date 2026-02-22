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
  const [filterName, setFilterName] = useState("all");
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
        const { error, data } = await supabase.from("tenants").update(payload).eq("id", editing.id).select();
        if (error) throw error;
      } else {
        const { error, data } = await supabase.from("tenants").insert({ ...payload, user_id: user!.id }).select();
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
    onError: (e: any) => {
      console.error("Tenant save error:", e);
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
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
    const matchName = filterName === "all" || (t.name && t.name.toLowerCase().includes(filterName.toLowerCase()));
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
    <div className="space-responsive-y-4 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-responsive-xl font-display font-bold">Tenants</h2>
          <p className="text-muted-foreground text-sm">{tenants.length} tenants</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="touch-target">
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-responsive max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Tenant" : "Add New Tenant"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update tenant information" : "Add a new tenant to the system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={e => { e.preventDefault(); save.mutate(); }} className="form-responsive">
              <div className="form-grid-responsive">
                <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Citizenship Number</Label><Input value={form.citizenship_number} onChange={e => setForm(f => ({ ...f, citizenship_number: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Occupation</Label><Input value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Family Members</Label><Input type="number" min={0} value={form.family_members} onChange={e => setForm(f => ({ ...f, family_members: +e.target.value }))} /></div>
                <div className="space-y-2"><Label>House *</Label>
                  <Select value={form.house_id} onValueChange={v => setForm(f => ({ ...f, house_id: v, room_number: "" }))}>
                    <SelectTrigger><SelectValue placeholder="Select house" /></SelectTrigger>
                    <SelectContent>{houses.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Room Number</Label><Input value={form.room_number} onChange={e => setForm(f => ({ ...f, room_number: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Monthly Rent (Rs.)</Label><Input type="number" min={0} value={form.monthly_rent} onChange={e => setForm(f => ({ ...f, monthly_rent: +e.target.value }))} /></div>
                <div className="space-y-2"><Label>Move-in Date</Label><Input type="date" value={form.move_in_date} onChange={e => setForm(f => ({ ...f, move_in_date: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Remarks</Label><Input value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} /></div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded border-gray-300" />
                <Label htmlFor="is_active" className="text-sm font-medium">Active Tenant</Label>
              </div>
              <Button type="submit" className="w-full" disabled={save.isPending}>
                {save.isPending ? "Saving..." : (editing ? "Update" : "Create")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by room number..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative flex-1 min-w-[200px] sm:hidden">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name..." className="pl-9" value={filterName} onChange={e => setFilterName(e.target.value)} />
        </div>
        <Select value={filterHouse} onValueChange={setFilterHouse}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Houses</SelectItem>
            {houses.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <div className="hidden sm:block">
          <Select value={filterName} onValueChange={setFilterName}>
            <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Search by name" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Names</SelectItem>
              {Array.from(new Set(tenants.map(t => t.name))).filter(Boolean).map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">House</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead className="text-right hidden xs:table-cell">Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {isLoading ? "Loading..." : "No tenants found"}
                    </TableCell>
                  </TableRow>
                ) : filtered.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-sm text-muted-foreground sm:hidden">{t.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{t.phone || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell">{houseName(t.house_id)}</TableCell>
                    <TableCell>{t.room_number}</TableCell>
                    <TableCell className="text-right hidden xs:table-cell">Rs. {Number(t.monthly_rent).toLocaleString()}</TableCell>
                    <TableCell><Badge className={t.is_active ? "status-paid border-0" : "status-unpaid border-0"}>
                      {t.is_active ? "Active" : "Inactive"}
                    </Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(t)} className="touch-target">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => remove.mutate(t.id)} className="touch-target">
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
    </div>
  );
}
