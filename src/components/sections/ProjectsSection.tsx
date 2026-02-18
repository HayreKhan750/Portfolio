import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Github, Briefcase } from 'lucide-react';

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

const ProjectsSection = () => {
  const { data: projects = [] } = useQuery<ProjectWithMedia[]>({
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

  return (
    <section id="projects" className="section-spacing relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card glass-card-hover rounded-xl p-6 space-y-4"
            >
              {project.media && project.media.length > 0 && (
                <div className="aspect-video rounded-lg overflow-hidden bg-zinc-800">
                  <img
                    src={project.media[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                
                {project.description && (
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {project.description}
                  </p>
                )}

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
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
