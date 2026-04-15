import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Github, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectWithMedia {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  created_at: string;
  media?: Array<{
    id: string;
    url: string;
    type: string;
  }>;
}

const normalizeUrl = (url: string) => {
  if (!url) return url;
  if (/^(https?:\/\/|mailto:|tel:)/.test(url)) return url;
  return `https://${url}`;
};

const ProjectsSection = () => {
  const { data: projects = [], isLoading } = useQuery<ProjectWithMedia[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch media for each project
      const projectsWithMedia = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: media } = await supabase
            .from('project_media')
            .select('id, url, type')
            .eq('project_id', project.id)
            .order('sort_order', { ascending: true });

          return { ...project, media: media || [] };
        })
      );

      return projectsWithMedia;
    },
  });

  if (isLoading) {
    return (
      <section id="projects" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Briefcase className="w-8 h-8 text-cyan-400" />
              <h2 className="text-4xl md:text-5xl font-bold gradient-text">
                Selected Work
              </h2>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A showcase of projects I've built and contributed to
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                <div className="aspect-video rounded-lg bg-zinc-800 mb-4"></div>
                <div className="h-6 bg-zinc-800 rounded mb-3"></div>
                <div className="h-4 bg-zinc-800 rounded w-3/4 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-zinc-800 rounded-full"></div>
                  <div className="h-6 w-20 bg-zinc-800 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="w-8 h-8 text-cyan-400" />
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              Selected Work
            </h2>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A showcase of projects I've built and contributed to
          </p>
        </motion.div>

        {/* Consistent grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-xl overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 flex flex-col"
            >
              {/* Image container with consistent aspect ratio (16:10) */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-800/50">
                {project.media && project.media.length > 0 ? (
                  <img
                    src={project.media[0].url}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Briefcase className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Content section with consistent padding */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {project.description}
                  </p>
                )}

                {/* Tags with limit */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 4).map((tech: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-gray-400">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-4 pt-2 border-t border-white/5 mt-auto">
                  {project.live_url && (
                    <a
                      href={normalizeUrl(project.live_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={normalizeUrl(project.github_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No projects added yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
