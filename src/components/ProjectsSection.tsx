import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ExternalLink, Github, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  live_url?: string | null;
  github_url?: string | null;
  featured?: boolean;
}

interface Media {
  id: string;
  project_id: string;
  url: string;
  type: string;
  caption: string | null;
  sort_order: number;
}

const normalizeUrl = (url: string) => {
  if (!url) return url;
  if (/^(https?:\/\/)/.test(url)) return url;
  return `https://${url}`;
};

const ProjectsSection = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [mediaIndex, setMediaIndex] = useState(0);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const { data: allMedia } = useQuery({
    queryKey: ["project_media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_media").select("*").order("sort_order");
      if (error) throw error;
      return data as unknown as (Media & { project_id: string })[];
    },
  });

  const getThumb = (projectId: string) => {
    const media = allMedia?.filter(m => m.project_id === projectId);
    return media?.[0]?.url;
  };

  const openProject = (project: Project) => {
    setSelected(project);
    const media = allMedia?.filter(m => m.project_id === project.id) || [];
    setSelectedMedia(media);
    setMediaIndex(0);
  };

  if (!projects || projects.length === 0) {
    return (
      <section id="work" className="py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-bold mb-2">Selected <span className="gradient-text">Work</span></h2>
          <p className="text-muted-foreground">Projects coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="font-heading text-4xl font-bold mb-2">Selected <span className="gradient-text">Work</span></h2>
          <p className="text-muted-foreground">Projects that showcase my capabilities.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project, i) => {
            const thumb = getThumb(project.id);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => openProject(project)}
                className={`glass-card p-6 cursor-pointer group hover:border-cyan/30 transition-all duration-300 ${project.featured ? "md:col-span-2" : ""}`}
                style={{ boxShadow: "0 0 0 0 transparent" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 20px hsl(183 100% 50% / 0.15)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 0 transparent"; }}
              >
                {thumb && <img src={thumb} alt={project.title} loading="lazy" className="w-full h-40 object-cover rounded-xl mb-4" />}
                <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-cyan transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-cyan">{tag}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal via Portal to escape stacking context */}
      {selected && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20} /></button>

            {selectedMedia.length > 0 && (
              <div className="relative mb-6">
                {selectedMedia[mediaIndex].type === "video" ? (
                  <video src={selectedMedia[mediaIndex].url} controls className="w-full rounded-xl max-h-64 object-contain" />
                ) : (
                  <img src={selectedMedia[mediaIndex].url} alt="" className="w-full rounded-xl max-h-64 object-contain" />
                )}
                {selectedMedia.length > 1 && (
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
                    <button onClick={() => setMediaIndex(i => (i - 1 + selectedMedia.length) % selectedMedia.length)} className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70"><ChevronLeft size={18} /></button>
                    <button onClick={() => setMediaIndex(i => (i + 1) % selectedMedia.length)} className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70"><ChevronRight size={18} /></button>
                  </div>
                )}
              </div>
            )}

            <h3 className="font-heading text-2xl font-bold mb-3">{selected.title}</h3>
            <p className="text-muted-foreground mb-4">{selected.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selected.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-cyan">{tag}</span>
              ))}
            </div>
            <div className="flex gap-3">
              {selected.github_url && (
                <a href={normalizeUrl(selected.github_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm hover:bg-white/5 transition-colors">
                  <Github size={16} /> GitHub
                </a>
              )}
              {selected.live_url && (
                <a href={normalizeUrl(selected.live_url)} target="_blank" rel="noopener noreferrer" className="btn-gradient inline-flex items-center gap-2 text-sm !px-4 !py-2">
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default ProjectsSection;
