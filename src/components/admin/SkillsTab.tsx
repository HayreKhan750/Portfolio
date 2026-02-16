import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, Save, Layers } from "lucide-react";

interface Skill {
  id: string;
  category: string;
  name: string;
  proficiency: number;
  sort_order: number;
}

const SkillsTab = () => {
  const [items, setItems] = useState<Skill[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ category: "", name: "", proficiency: 50 });
  const [batchMode, setBatchMode] = useState(false);
  const [batchNames, setBatchNames] = useState("");

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    const { data } = await supabase.from("skills").select("*").order("sort_order");
    if (data) setItems(data as Skill[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (batchMode) {
      const names = batchNames.split(",").map(n => n.trim()).filter(Boolean);
      if (names.length === 0) { toast.error("Enter at least one skill name"); return; }
      const payloads = names.map((name, i) => ({
        category: form.category,
        name,
        proficiency: form.proficiency,
        sort_order: items.length + i,
      }));
      const { error } = await supabase.from("skills").insert(payloads);
      if (error) { toast.error("Insert failed"); return; }
      toast.success(`Added ${names.length} skills!`);
    } else if (editing) {
      const payload = { category: form.category, name: form.name, proficiency: form.proficiency };
      const { error } = await supabase.from("skills").update(payload).eq("id", editing);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Updated!");
    } else {
      const payload = { category: form.category, name: form.name, proficiency: form.proficiency, sort_order: items.length };
      const { error } = await supabase.from("skills").insert([payload]);
      if (error) { toast.error("Insert failed"); return; }
      toast.success("Added!");
    }
    resetForm();
    fetchSkills();
  };

  const startEdit = (item: Skill) => {
    setEditing(item.id);
    setBatchMode(false);
    setForm({ category: item.category, name: item.name, proficiency: item.proficiency });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted!"); fetchSkills(); }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setBatchMode(false);
    setBatchNames("");
    setForm({ category: "", name: "", proficiency: 50 });
  };

  const grouped = items.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const categories = [...new Set(items.map(s => s.category))];

  const categoryColors: Record<string, string> = {};
  const colors = ["bg-cyan/20 text-cyan", "bg-violet/20 text-violet", "bg-emerald-500/20 text-emerald-400", "bg-amber-500/20 text-amber-400", "bg-rose-500/20 text-rose-400"];
  categories.forEach((cat, i) => { categoryColors[cat] = colors[i % colors.length]; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Skills ({items.length})</h2>
        <div className="flex gap-2">
          {!showForm && (
            <>
              <button onClick={() => { setShowForm(true); setBatchMode(true); }} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-white/10 text-muted-foreground hover:bg-white/5 transition-colors">
                <Layers size={14} /> Batch Add
              </button>
              <button onClick={() => setShowForm(true)} className="btn-gradient flex items-center gap-2 text-sm !px-4 !py-2">
                <Plus size={16} /> Add Skill
              </button>
            </>
          )}
          {showForm && (
            <button onClick={resetForm} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-white/10 text-muted-foreground hover:bg-white/5 transition-colors">
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Category</label>
            <Input
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Frontend, AI/ML, Backend"
              className="bg-zinc-900 border-white/10"
              list="skill-categories"
              required
            />
            <datalist id="skill-categories">
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          {batchMode ? (
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Skill Names (comma-separated)</label>
              <Input
                value={batchNames}
                onChange={e => setBatchNames(e.target.value)}
                placeholder="e.g. React, Vue, Angular, Svelte"
                className="bg-zinc-900 border-white/10"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Enter multiple skills separated by commas. All will share the same category and proficiency.</p>
            </div>
          ) : (
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Skill Name</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. React, PyTorch" className="bg-zinc-900 border-white/10" required />
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Proficiency ({form.proficiency}%)</label>
            <input
              type="range" min={0} max={100} value={form.proficiency}
              onChange={e => setForm({ ...form, proficiency: parseInt(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </div>

          <button type="submit" className="btn-gradient flex items-center gap-2 text-sm">
            <Save size={16} /> {editing ? "Update" : batchMode ? "Add All" : "Add Skill"}
          </button>
        </form>
      )}

      {Object.entries(grouped).map(([category, skills]) => (
        <div key={category}>
          <h3 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[category]}`}>{category}</span>
          </h3>
          <div className="space-y-2">
            {skills.map(skill => (
              <div key={skill.id} className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">{skill.name}</span>
                  {skill.proficiency > 0 && (
                    <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(skill)} className="p-2 rounded-lg bg-white/5 hover:bg-cyan/20 text-muted-foreground hover:text-cyan transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(skill.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {items.length === 0 && !showForm && <p className="text-muted-foreground text-sm">No skills yet.</p>}
    </div>
  );
};

export default SkillsTab;
