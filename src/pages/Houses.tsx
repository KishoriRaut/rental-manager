import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface House {
  id: string;
  name: string;
  address: string;
  floors: number;
  rooms: number;
  remarks: string | null;
}

const emptyHouse = { name: "", address: "", floors: 1, rooms: 1, remarks: "" };

export default function Houses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<House | null>(null);
  const [form, setForm] = useState(emptyHouse);

  const { data: houses = [], isLoading } = useQuery({
    queryKey: ["houses"],
    queryFn: async () => {
      if (!user) {
        console.log("No user authenticated, skipping houses query");
        return [];
      }
      try {
        const { data, error } = await supabase.from("houses").select("*").order("created_at", { ascending: false });
        if (error) {
          if (error.code === '400' || error.message?.includes('invalid input syntax')) {
            console.warn("Houses query validation error:", error);
            return [];
          }
          console.error("Houses query error:", error);
          return [];
        }
        return data as House[];
      } catch (err) {
        console.error("Houses fetch error:", err);
        return [];
      }
    },
    enabled: !!user,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("houses").update({ name: form.name, address: form.address, floors: form.floors, rooms: form.rooms, remarks: form.remarks || null }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("houses").insert({ ...form, remarks: form.remarks || null, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["houses"] });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyHouse);
      toast({ title: editing ? "House updated" : "House added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("houses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["houses"] });
      toast({ title: "House deleted" });
    },
  });

  const filtered = houses.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.address.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (h: House) => {
    setEditing(h);
    setForm({ name: h.name, address: h.address, floors: h.floors, rooms: h.rooms, remarks: h.remarks || "" });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyHouse);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-responsive-xl font-display font-bold">Houses</h2>
          <p className="text-muted-foreground text-sm">{houses.length} houses</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="touch-target">
              <Plus className="h-4 w-4 mr-2" />
              Add House
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-responsive max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit House" : "Add New House"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update house information" : "Add a new house to the system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={e => { e.preventDefault(); save.mutate(); }} className="form-responsive">
              <div className="form-grid-responsive">
                <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Floors</Label><Input type="number" min={1} value={form.floors} onChange={e => setForm(f => ({ ...f, floors: +e.target.value }))} /></div>
                <div className="space-y-2"><Label>Rooms</Label><Input type="number" min={1} value={form.rooms} onChange={e => setForm(f => ({ ...f, rooms: +e.target.value }))} /></div>
                <div className="space-y-2"><Label>Remarks</Label><Input value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} /></div>
              </div>
              <Button type="submit" className="w-full" disabled={save.isPending}>
                {save.isPending ? "Saving..." : (editing ? "Update" : "Create")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or address..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Address</TableHead>
                  <TableHead className="text-right hidden xs:table-cell">Floors</TableHead>
                  <TableHead className="text-right hidden xs:table-cell">Rooms</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {isLoading ? "Loading..." : "No houses found"}
                    </TableCell>
                  </TableRow>
                ) : filtered.map(h => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{h.name}</div>
                        <div className="text-sm text-muted-foreground sm:hidden">{h.address}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{h.address || "—"}</TableCell>
                    <TableCell className="text-right hidden xs:table-cell">{h.floors}</TableCell>
                    <TableCell className="text-right hidden xs:table-cell">{h.rooms}</TableCell>
                    <TableCell><Badge className={h.is_active ? "status-paid border-0" : "status-unpaid border-0"}>
                      {h.is_active ? "Active" : "Inactive"}
                    </Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(h)} className="touch-target">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => remove.mutate(h.id)} className="touch-target">
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
