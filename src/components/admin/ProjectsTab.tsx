import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, Save, Upload, Image } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
}

interface Media {
  id: string;
  project_id: string;
  type: string;
  url: string;
  caption: string | null;
  sort_order: number;
}

const ProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", tags: "", live_url: "", github_url: "", featured: false });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data as any);
  };

  const fetchMedia = async (projectId: string) => {
    const { data } = await supabase.from("project_media").select("*").eq("project_id", projectId).order("sort_order");
    if (data) setExistingMedia(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      featured: form.featured,
    };

    let projectId = editing;

    if (editing) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing);
      if (error) { toast.error("Update failed"); return; }
    } else {
      const { data, error } = await supabase.from("projects").insert([payload]).select().single();
      if (error) { toast.error("Insert failed"); return; }
      projectId = data.id;
    }

    // Upload media files
    if (mediaFiles.length > 0 && projectId) {
      setUploading(true);
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        const ext = file.name.split(".").pop();
        const path = `${projectId}/${Date.now()}-${i}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("project-media").upload(path, file);
        if (uploadError) { toast.error(`Failed to upload ${file.name}`); continue; }
        const { data: urlData } = supabase.storage.from("project-media").getPublicUrl(path);
        await supabase.from("project_media").insert([{
          project_id: projectId,
          type: file.type.startsWith("video") ? "video" : "image",
          url: urlData.publicUrl,
          sort_order: i,
        }]);
      }
      setUploading(false);
    }

    toast.success(editing ? "Project updated!" : "Project added!");
    resetForm();
    fetchProjects();
  };

  const startEdit = async (project: Project) => {
    setEditing(project.id);
    setForm({
      title: project.title,
      description: project.description,
      tags: project.tags.join(", "),
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      featured: project.featured,
    });
    await fetchMedia(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted!"); fetchProjects(); }
  };

  const deleteMedia = async (mediaId: string) => {
    const { error } = await supabase.from("project_media").delete().eq("id", mediaId);
    if (error) toast.error("Failed to delete media");
    else {
      toast.success("Media deleted");
      setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", description: "", tags: "", live_url: "", github_url: "", featured: false });
    setMediaFiles([]);
    setExistingMedia([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Projects</h2>
        <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="btn-gradient flex items-center gap-2 text-sm !px-4 !py-2">
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="bg-white/5 border-white/10" required />
          <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="bg-white/5 border-white/10 resize-none" required />
          <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma-separated)" className="bg-white/5 border-white/10" />
          <Input value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} placeholder="Live URL" className="bg-white/5 border-white/10" />
          <Input value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} placeholder="GitHub URL" className="bg-white/5 border-white/10" />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded" />
            Featured project
          </label>

          {/* Existing media */}
          {existingMedia.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Media</p>
              <div className="flex gap-2 flex-wrap">
                {existingMedia.map(m => (
                  <div key={m.id} className="relative group">
                    <img src={m.url} alt="" className="w-20 h-20 object-cover rounded-lg border border-white/10" />
                    <button type="button" onClick={() => deleteMedia(m.id)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload new media */}
          <div>
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer w-fit">
              <Image size={16} /> {mediaFiles.length > 0 ? `${mediaFiles.length} files selected` : "Add Media"}
              <input type="file" accept="image/*,video/*" multiple onChange={e => setMediaFiles(Array.from(e.target.files || []))} className="hidden" />
            </label>
          </div>

          <button type="submit" disabled={uploading} className="btn-gradient flex items-center gap-2 text-sm disabled:opacity-50">
            <Save size={16} /> {uploading ? "Uploading..." : editing ? "Update" : "Add Project"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {projects.map(p => (
          <div key={p.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{p.title} {p.featured && <span className="text-xs text-cyan ml-1">★ Featured</span>}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="text-muted-foreground hover:text-cyan transition-colors"><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-muted-foreground text-sm">No projects yet.</p>}
      </div>
    </div>
  );
};

export default ProjectsTab;
