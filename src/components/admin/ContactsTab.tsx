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

const iconOptions = ["Mail", "Github", "Linkedin", "Twitter", "Phone", "Globe", "Instagram", "Youtube", "Facebook"];

const ContactsTab = () => {
  const [items, setItems] = useState<ContactMethod[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ platform: "", url: "", icon: "Globe" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase.from("contact_methods").select("*").order("sort_order");
    if (error) {
      console.error("Error fetching contact methods:", error);
      toast.error("Failed to load contact methods");
      return;
    }
    if (data) setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.platform || !form.url) return;
    
    // Auto-prepend https:// for non-email/phone URLs
    let url = form.url;
    const lower = form.platform.toLowerCase();
    if (lower !== "email" && lower !== "mail" && lower !== "phone") {
      if (!/^(https?:\/\/|mailto:|tel:)/.test(url)) {
        url = `https://${url}`;
      }
    }
    
    const payload = { platform: form.platform, url, icon: form.icon || null, sort_order: items.length };

    if (editing) {
      const { error } = await supabase.from("contact_methods").update(payload).eq("id", editing);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Updated!");
      setEditing(null);
    } else {
      const { error } = await supabase.from("contact_methods").insert([payload]);
      if (error) { toast.error("Insert failed"); return; }
      toast.success("Added!");
    }
    setForm({ platform: "", url: "", icon: "Globe" });
    fetchItems();
  };

  const startEdit = (item: ContactMethod) => {
    setEditing(item.id);
    setForm({ platform: item.platform, url: item.url, icon: item.icon || "Globe" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("contact_methods").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted!"); fetchItems(); }
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ platform: "", url: "", icon: "Globe" });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold">Contact Methods ({items.length})</h2>

      <form onSubmit={handleSubmit} className="glass-card p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs text-muted-foreground mb-1 block">Platform</label>
          <Input value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} placeholder="e.g. GitHub" className="bg-zinc-900 border-white/10 h-9 text-sm" required />
        </div>
        <div className="flex-[2] min-w-[180px]">
          <label className="text-xs text-muted-foreground mb-1 block">URL</label>
          <Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="bg-zinc-900 border-white/10 h-9 text-sm" required />
        </div>
        <div className="w-32">
          <label className="text-xs text-muted-foreground mb-1 block">Icon</label>
          <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-foreground h-9 focus:outline-none focus:ring-1 focus:ring-cyan/50">
            {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-gradient flex items-center gap-1.5 text-sm !px-3 !py-1.5 h-9">
            {editing ? <><Save size={14} /> Update</> : <><Plus size={14} /> Add</>}
          </button>
          {editing && (
            <button type="button" onClick={cancelEdit} className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-white/10 text-muted-foreground hover:bg-white/5 h-9">
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">{item.icon || "Globe"}</span>
              <span className="font-medium text-sm">{item.platform}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.url}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-cyan/20 text-muted-foreground hover:text-cyan transition-all"><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-sm">No contact methods yet.</p>}
      </div>
    </div>
  );
};

export default ContactsTab;
