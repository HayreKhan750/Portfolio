import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Code2, Wrench } from 'lucide-react';

const SkillsSection = () => {
  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <section id="skills" className="section-spacing relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code2 className="w-8 h-8 text-cyan-400" />
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              Technical Arsenal
            </h2>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A comprehensive overview of my skills and expertise
          </p>
        </div>

        <div className="content-spacing">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="space-y-6">
              <h3 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                <Wrench className="w-6 h-6" />
                {category}
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group relative"
                  >
                    <div className="tech-pill">
                      <span className="relative z-10">{skill.name}</span>
                      
                      {skill.proficiency > 0 && (
                        <div className="ml-2 flex items-center gap-1">
                          <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full transition-all duration-500"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{skill.proficiency}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No skills added yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
