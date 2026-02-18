import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, Save, Upload, ExternalLink } from "lucide-react";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string | null;
  proof_url: string | null;
}

const normalizeUrl = (url: string) => {
  if (!url) return url;
  if (/^(https?:\/\/)/.test(url)) return url;
  return `https://${url}`;
};

const CertificatesTab = () => {
  const [items, setItems] = useState<Certificate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", issuer: "", date: "", proof_url: "" });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let proofUrl: string | null = null;

    if (proofFile) {
      setUploading(true);
      const ext = proofFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("cert-proofs").upload(path, proofFile);
      if (error) { toast.error("Upload failed"); setUploading(false); return; }
      const { data } = supabase.storage.from("cert-proofs").getPublicUrl(path);
      proofUrl = data.publicUrl;
      setUploading(false);
    }

    const payload: { name: string; issuer: string; date: string | null; proof_url?: string } = { 
      name: form.name, 
      issuer: form.issuer, 
      date: form.date || null 
    };
    if (proofUrl) payload.proof_url = proofUrl;
    else if (form.proof_url) payload.proof_url = form.proof_url;

    if (editing) {
      const { error } = await supabase.from("certificates").update(payload).eq("id", editing);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Updated!");
    } else {
      const { error } = await supabase.from("certificates").insert([payload]);
      if (error) { toast.error("Insert failed"); return; }
      toast.success("Added!");
    }
    resetForm();
    fetchItems();
  };

  const startEdit = (item: Certificate) => {
    setEditing(item.id);
    setForm({ name: item.name, issuer: item.issuer, date: item.date || "", proof_url: item.proof_url || "" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted!"); fetchItems(); }
  };

  const resetForm = () => {
    setShowForm(false); setEditing(null);
    setForm({ name: "", issuer: "", date: "", proof_url: "" }); setProofFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Certificates ({items.length})</h2>
        <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="btn-gradient flex items-center gap-2 text-sm !px-4 !py-2">
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Certificate</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Certificate Name" className="bg-zinc-900 border-white/10" required />
          <Input value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} placeholder="Issuer (e.g. DeepLearning.AI)" className="bg-zinc-900 border-white/10" required />
          <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="Date" className="bg-zinc-900 border-white/10" />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
              <Upload size={16} /> {proofFile ? proofFile.name : "Upload Proof"}
              <input type="file" accept="image/*,.pdf" onChange={e => setProofFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
            <span className="text-xs text-muted-foreground">or</span>
            <Input value={form.proof_url || ""} onChange={e => setForm({ ...form, proof_url: e.target.value })} placeholder="Proof URL" className="bg-zinc-900 border-white/10 flex-1" />
          </div>
          <button type="submit" disabled={uploading} className="btn-gradient flex items-center gap-2 text-sm disabled:opacity-50">
            <Save size={16} /> {uploading ? "Uploading..." : editing ? "Update" : "Add"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="glass-card p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.issuer} {item.date && `· ${item.date}`}</p>
            </div>
            <div className="flex gap-2">
              {item.proof_url && (
                <a href={normalizeUrl(item.proof_url)} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-cyan/20 text-muted-foreground hover:text-cyan transition-all">
                  <ExternalLink size={14} />
                </a>
              )}
              <button onClick={() => startEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-cyan/20 text-muted-foreground hover:text-cyan transition-all"><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && <p className="text-muted-foreground text-sm">No certificates yet.</p>}
      </div>
    </div>
  );
};

export default CertificatesTab;
