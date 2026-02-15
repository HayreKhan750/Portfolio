import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, LogOut, MessageSquare, FolderOpen, X, Upload } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  featured: boolean;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"projects" | "messages">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/login");
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/login");
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    fetchProjects();
    fetchMessages();
  }, [user]);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl: string | null = null;

    if (imageFile) {
      setUploading(true);
      const ext = imageFile.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(path, imageFile);
      setUploading(false);
      if (uploadError) {
        toast.error("Image upload failed");
        return;
      }
      const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("projects").insert([{
      title,
      description,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      image_url: imageUrl,
      github_url: githubUrl || null,
      demo_url: demoUrl || null,
      featured,
    }]);

    if (error) {
      toast.error("Failed to add project");
      return;
    }
    toast.success("Project added!");
    resetForm();
    fetchProjects();
  };

  const resetForm = () => {
    setShowForm(false);
    setTitle("");
    setDescription("");
    setTags("");
    setGithubUrl("");
    setDemoUrl("");
    setFeatured(false);
    setImageFile(null);
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Project deleted");
      fetchProjects();
    }
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Message deleted");
      fetchMessages();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("projects")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${tab === "projects" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <FolderOpen size={16} /> Projects ({projects.length})
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${tab === "messages" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <MessageSquare size={16} /> Messages ({messages.length})
          </button>
        </div>

        {/* Projects Tab */}
        {tab === "projects" && (
          <div>
            <button onClick={() => setShowForm(!showForm)} className="btn-gradient mb-6 flex items-center gap-2 text-sm">
              {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Project</>}
            </button>

            {showForm && (
              <form onSubmit={handleAddProject} className="glass-card p-6 mb-6 space-y-4">
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white/5 border-white/10" required />
                <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white/5 border-white/10 resize-none" required />
                <Input placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="bg-white/5 border-white/10" />
                <Input placeholder="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="bg-white/5 border-white/10" />
                <Input placeholder="Demo URL" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} className="bg-white/5 border-white/10" />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded" />
                    Featured project
                  </label>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Project Image</label>
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer w-fit">
                    <Upload size={16} /> {imageFile ? imageFile.name : "Choose file"}
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                  </label>
                </div>
                <button type="submit" disabled={uploading} className="btn-gradient disabled:opacity-50">
                  {uploading ? "Uploading..." : "Add Project"}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="glass-card p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-semibold">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{p.description}</p>
                  </div>
                  <button onClick={() => deleteProject(p.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-4">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {projects.length === 0 && <p className="text-muted-foreground text-sm">No projects yet.</p>}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {tab === "messages" && (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="glass-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm">{m.name} <span className="text-muted-foreground font-normal">({m.email})</span></p>
                    <p className="text-sm text-muted-foreground mt-1">{m.content}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">{new Date(m.created_at).toLocaleString()}</p>
                  </div>
                  <button onClick={() => deleteMessage(m.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-4">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {messages.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
