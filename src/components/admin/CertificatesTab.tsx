import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, Save, Upload } from "lucide-react";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string | null;
  proof_url: string | null;
}

const CertificatesTab = () => {
  const [items, setItems] = useState<Certificate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", issuer: "", date: "" });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
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

    const payload: any = { name: form.name, issuer: form.issuer, date: form.date || null };
    if (proofUrl) payload.proof_url = proofUrl;

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
    fetch();
  };

  const startEdit = (item: Certificate) => {
    setEditing(item.id);
    setForm({ name: item.name, issuer: item.issuer, date: item.date || "" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted!"); fetch(); }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", issuer: "", date: "" });
    setProofFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Certificates</h2>
        <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="btn-gradient flex items-center gap-2 text-sm !px-4 !py-2">
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Certificate Name" className="bg-white/5 border-white/10" required />
          <Input value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} placeholder="Issuer (e.g. DeepLearning.AI)" className="bg-white/5 border-white/10" required />
          <Input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="Date (e.g. 2024)" className="bg-white/5 border-white/10" />
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer w-fit">
            <Upload size={16} /> {proofFile ? proofFile.name : "Upload Proof"}
            <input type="file" accept="image/*,.pdf" onChange={e => setProofFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
          <button type="submit" disabled={uploading} className="btn-gradient flex items-center gap-2 text-sm disabled:opacity-50">
            <Save size={16} /> {uploading ? "Uploading..." : editing ? "Update" : "Add"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.issuer} {item.date && `· ${item.date}`}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="text-muted-foreground hover:text-cyan transition-colors"><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && <p className="text-muted-foreground text-sm">No certificates yet.</p>}
      </div>
    </div>
  );
};

export default CertificatesTab;
