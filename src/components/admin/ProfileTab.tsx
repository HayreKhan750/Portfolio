import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Save } from "lucide-react";

const ProfileTab = () => {
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profile").select("*").limit(1).single();
    if (data) {
      setProfileId(data.id);
      setName((data as any).name || "");
      setHeadline(data.headline || "");
      setBio(data.bio || "");
      setResumeUrl(data.resume_url || "");
      setAvatarUrl(data.avatar_url || "");
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file);
    if (error) { toast.error("Avatar upload failed"); setUploadingAvatar(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploadingAvatar(false);
    toast.success("Avatar uploaded!");
  };

  const handleCvUpload = async (file: File) => {
    setUploadingCv(true);
    const ext = file.name.split(".").pop();
    const path = `cv-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("cv-docs").upload(path, file);
    if (error) { toast.error("CV upload failed"); setUploadingCv(false); return; }
    const { data } = supabase.storage.from("cv-docs").getPublicUrl(path);
    setResumeUrl(data.publicUrl);
    setUploadingCv(false);
    toast.success("CV uploaded!");
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { name, headline, bio, resume_url: resumeUrl, avatar_url: avatarUrl } as any;
    
    let error;
    if (profileId) {
      ({ error } = await supabase.from("profile").update(payload).eq("id", profileId));
    } else {
      ({ error } = await supabase.from("profile").insert([payload]));
    }
    
    setSaving(false);
    if (error) { toast.error("Failed to save profile"); return; }
    toast.success("Profile saved!");
    fetchProfile();
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold">Edit Profile</h2>
      
      <div className="flex items-center gap-6">
        {avatarUrl && (
          <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-white/10" />
        )}
        <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
          <Upload size={16} /> {uploadingAvatar ? "Uploading..." : "Upload Avatar"}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} className="hidden" />
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Display Name (shown on Hero section)</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hayredin Mohammed" className="bg-zinc-900 border-white/10" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Sub-headline (small text above your name on Hero)</label>
          <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. AI / ML Engineer" className="bg-zinc-900 border-white/10" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Bio</label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Your bio..." rows={4} className="bg-zinc-900 border-white/10 resize-none" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">CV / Resume</label>
          <div className="flex items-center gap-3">
            {resumeUrl && <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan hover:underline truncate max-w-xs">Current CV</a>}
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
              <Upload size={16} /> {uploadingCv ? "Uploading..." : "Upload CV"}
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files?.[0] && handleCvUpload(e.target.files[0])} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-gradient flex items-center gap-2 disabled:opacity-50">
        <Save size={16} /> {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
};

export default ProfileTab;
