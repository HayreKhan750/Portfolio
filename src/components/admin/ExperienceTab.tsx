import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, Save, GraduationCap, Briefcase, Award } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  organization: string;
  date_range: string;
  description: string;
  type: string;
  sort_order: number;
}

const typeIcons: Record<string, any> = { education: GraduationCap, work: Briefcase, award: Award };

const ExperienceTab = () => {
  const [items, setItems] = useState<Experience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", organization: "", date_range: "", description: "", type: "education", sort_order: 0 });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from("experience").select("*").order("sort_order");
    if (data) setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const { error } = await supabase.from("experience").update(form).eq("id", editing);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Updated!");
    } else {
      const { error } = await supabase.from("experience").insert([form]);
      if (error) { toast.error("Insert failed"); return; }
      toast.success("Added!");
    }
    resetForm();
    fetchItems();
  };

  const startEdit = (item: Experience) => {
    setEditing(item.id);
    setForm({ title: item.title, organization: item.organization, date_range: item.date_range, description: item.description || "", type: item.type, sort_order: item.sort_order });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted!"); fetchItems(); }
  };

  const resetForm = () => {
    setShowForm(false); setEditing(null);
    setForm({ title: "", organization: "", date_range: "", description: "", type: "education", sort_order: 0 });
  };

  const grouped = { education: items.filter(i => i.type === "education"), work: items.filter(i => i.type === "work"), award: items.filter(i => i.type === "award") };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Experience ({items.length})</h2>
        <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="btn-gradient flex items-center gap-2 text-sm !px-4 !py-2">
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="bg-zinc-900 border-white/10" required />
          <Input value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} placeholder="Organization" className="bg-zinc-900 border-white/10" required />
          <Input value={form.date_range} onChange={e => setForm({ ...form, date_range: e.target.value })} placeholder="Date Range (e.g. 2023-2027)" className="bg-zinc-900 border-white/10" required />
          <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="bg-zinc-900 border-white/10 resize-none" />
          <div className="flex gap-4">
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground">
              <option value="education">Education</option>
              <option value="work">Work</option>
              <option value="award">Award</option>
            </select>
            <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} placeholder="Sort Order" className="bg-zinc-900 border-white/10 w-28" />
          </div>
          <button type="submit" className="btn-gradient flex items-center gap-2 text-sm">
            <Save size={16} /> {editing ? "Update" : "Add"}
          </button>
        </form>
      )}

      {(["education", "work", "award"] as const).map(type => {
        const Icon = typeIcons[type];
        const list = grouped[type];
        if (list.length === 0) return null;
        return (
          <div key={type}>
            <h3 className="font-heading text-lg font-semibold mb-3 capitalize flex items-center gap-2">
              <Icon size={18} className="text-cyan" /> {type}
            </h3>
            <div className="space-y-2">
              {list.map(item => (
                <div key={item.id} className="glass-card p-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.organization} · {item.date_range}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-cyan transition-all"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-destructive transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {items.length === 0 && !showForm && <p className="text-muted-foreground text-sm">No experience entries yet.</p>}
    </div>
  );
};

export default ExperienceTab;
