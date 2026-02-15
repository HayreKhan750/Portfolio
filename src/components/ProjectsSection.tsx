import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image_url?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  featured?: boolean;
}

const seedProjects: Project[] = [
  {
    id: "1",
    title: "Twitter Sentiment Analyzer",
    description:
      "NLP pipeline classifying tweet sentiment using Naive Bayes & SVM models. Achieved 89% accuracy on 50k+ tweets with real-time streaming analysis.",
    tags: ["Python", "Scikit-learn", "NLP", "Pandas"],
    featured: true,
  },
  {
    id: "2",
    title: "Sales Data Analysis",
    description:
      "Interactive dashboard analyzing 3 years of retail sales data with trend forecasting using ARIMA models and Matplotlib visualizations.",
    tags: ["Python", "Pandas", "Matplotlib"],
  },
  {
    id: "3",
    title: "Student Attendance System",
    description:
      "Relational database system with normalized schema design, stored procedures, and automated reporting for university departments.",
    tags: ["MySQL", "Database Design", "SQL"],
  },
  {
    id: "4",
    title: "Banking Application",
    description:
      "Secure desktop banking app with transaction management, account handling, and role-based access control built with Java Swing.",
    tags: ["Java", "Swing", "Security"],
  },
];

const ProjectsSection = () => {
  const [selected, setSelected] = useState<Project | null>(null);

  const { data: dbProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const projects = dbProjects && dbProjects.length > 0 ? dbProjects : seedProjects;

  return (
    <section id="work" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-heading text-4xl font-bold mb-2">
            Selected <span className="gradient-text">Work</span>
          </h2>
          <p className="text-muted-foreground">Projects that showcase my capabilities.</p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setSelected(project)}
              className={`glass-card p-6 cursor-pointer group hover:border-cyan/30 transition-all duration-300 ${
                project.featured ? "md:col-span-2 md:row-span-1" : ""
              }`}
              style={{
                boxShadow: "0 0 0 0 transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 20px hsl(183 100% 50% / 0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 0 0 transparent";
              }}
            >
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}
              <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-cyan transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-cyan"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <h3 className="font-heading text-2xl font-bold mb-3">{selected.title}</h3>
            <p className="text-muted-foreground mb-4">{selected.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selected.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-cyan"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {selected.github_url && (
                <a
                  href={selected.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm hover:bg-white/5 transition-colors"
                >
                  <Github size={16} /> GitHub
                </a>
              )}
              {selected.demo_url && (
                <a
                  href={selected.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gradient inline-flex items-center gap-2 text-sm !px-4 !py-2"
                >
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
