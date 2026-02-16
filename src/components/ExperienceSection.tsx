import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const typeIcons: Record<string, any> = { education: GraduationCap, work: Briefcase, award: Award };
const typeLabels: Record<string, string> = { education: "Education", work: "Work", award: "Awards" };

const ExperienceSection = () => {
  const { data: items } = useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data, error } = await supabase.from("experience").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  if (!items || items.length === 0) return null;

  const grouped = {
    education: items.filter(i => i.type === "education"),
    work: items.filter(i => i.type === "work"),
    award: items.filter(i => i.type === "award"),
  };

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <h2 className="font-heading text-4xl font-bold mb-2">Experience & <span className="gradient-text">Education</span></h2>
          <p className="text-muted-foreground">My journey and credentials.</p>
        </motion.div>

        {(["education", "work", "award"] as const).map(type => {
          const list = grouped[type];
          if (list.length === 0) return null;
          const Icon = typeIcons[type];
          return (
            <div key={type} className="mb-8">
              <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon size={20} className="text-cyan" /> {typeLabels[type]}
              </h3>
              <div className="space-y-4">
                {list.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6 flex gap-5 items-start"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan/20 to-violet/20 shrink-0">
                      <Icon className="text-cyan" size={24} />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-semibold">{item.title}</h4>
                      <p className="text-sm text-cyan mb-1">{item.organization} · {item.date_range}</p>
                      {item.description && <p className="text-muted-foreground text-sm">{item.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExperienceSection;
