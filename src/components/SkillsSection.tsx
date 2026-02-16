import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Skill {
  id: string;
  category: string;
  name: string;
  proficiency: number;
  sort_order: number;
}

const SkillsSection = () => {
  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order");
      if (error) throw error;
      return data as Skill[];
    },
  });

  if (!skills || skills.length === 0) return null;

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-heading text-4xl font-bold mb-2">
            Technical <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="text-muted-foreground">Skills & expertise I bring to every project.</p>
        </motion.div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-heading text-lg font-semibold text-cyan mb-4">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {items.map((skill, i) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="glass-card px-5 py-3 cursor-default group hover:border-cyan/40 transition-all duration-300"
                    style={{ boxShadow: "0 0 0 0 transparent" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 16px hsl(183 100% 50% / 0.2), 0 0 32px hsl(282 99% 53% / 0.1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 0 transparent"; }}
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-cyan transition-colors">{skill.name}</span>
                    {skill.proficiency > 0 && (
                      <div className="mt-1.5 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan to-violet"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
