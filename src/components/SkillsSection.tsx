import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "AI / Machine Learning",
    skills: ["Python", "NLP", "Scikit-learn", "TensorFlow", "Deep Learning", "Computer Vision"],
  },
  {
    title: "Data Science",
    skills: ["Pandas", "NumPy", "Matplotlib", "Data Analysis", "Statistical Modeling", "Jupyter"],
  },
  {
    title: "Software Engineering",
    skills: ["Java", "MySQL", "Git", "REST APIs", "OOP", "Problem Solving"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-heading text-4xl font-bold mb-2">
            Technical <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="text-muted-foreground">Tools and technologies I work with.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-6"
            >
              <h3 className="font-heading text-lg font-semibold mb-4 text-cyan">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-foreground hover:border-cyan/30 hover:text-cyan transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
