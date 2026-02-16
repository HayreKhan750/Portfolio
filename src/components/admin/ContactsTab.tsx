import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, Save } from "lucide-react";

interface ContactMethod {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  sort_order: number;
}

const ContactsTab = () => {
  const [items, setItems] = useState<ContactMethod[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ platform: "", url: "", icon: "", sort_order: 0 });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from("contact_methods").select("*").order("sort_order");
    if (data) setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { platform: form.platform, url: form.url, icon: form.icon || null, sort_order: form.sort_order };

    if (editing) {
      const { error } = await supabase.from("contact_methods").update(payload).eq("id", editing);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Updated!");
    } else {
      const { error } = await supabase.from("contact_methods").insert([payload]);
      if (error) { toast.error("Insert failed"); return; }
      toast.success("Added!");
    }
    resetForm();
    fetchItems();
  };

  const startEdit = (item: ContactMethod) => {
    setEditing(item.id);
    setForm({ platform: item.platform, url: item.url, icon: item.icon || "", sort_order: item.sort_order });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("contact_methods").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted!"); fetchItems(); }
  };

  const resetForm = () => {
    setShowForm(false); setEditing(null);
    setForm({ platform: "", url: "", icon: "", sort_order: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Contact Methods ({items.length})</h2>
        <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="btn-gradient flex items-center gap-2 text-sm !px-4 !py-2">
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Platform</label>
            <Input value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} placeholder="e.g. Email, GitHub, LinkedIn" className="bg-zinc-900 border-white/10" required />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">URL</label>
            <Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="e.g. mailto:... or https://..." className="bg-zinc-900 border-white/10" required />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Icon (Lucide name)</label>
            <Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="e.g. Mail, Github, Linkedin" className="bg-zinc-900 border-white/10" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Sort Order</label>
            <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="bg-zinc-900 border-white/10 w-28" />
          </div>
          <button type="submit" className="btn-gradient flex items-center gap-2 text-sm">
            <Save size={16} /> {editing ? "Update" : "Add"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="glass-card p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{item.platform}</p>
              <p className="text-xs text-muted-foreground truncate max-w-xs">{item.url}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-cyan transition-all"><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-destructive transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && <p className="text-muted-foreground text-sm">No contact methods yet.</p>}
      </div>
    </div>
  );
};

export default ContactsTab;
