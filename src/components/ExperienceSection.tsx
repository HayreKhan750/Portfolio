import { motion } from "framer-motion";
import { GraduationCap, Award, BadgeCheck } from "lucide-react";

const items = [
  {
    icon: GraduationCap,
    title: "Addis Ababa University",
    subtitle: "BS in Computer Science — Expected 2027",
    description: "Top 10% of class. Coursework in AI, Machine Learning, Data Structures, and Algorithms.",
  },
  {
    icon: Award,
    title: "Kibur College Scholarship",
    subtitle: "Merit-Based Scholarship Recipient",
    description: "Awarded for outstanding academic performance and leadership in STEM.",
  },
  {
    icon: BadgeCheck,
    title: "Certifications",
    subtitle: "DeepLearning.AI · Udacity",
    description: "Deep Learning Specialization, Android Development Nanodegree, Data Analysis Professional.",
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-heading text-4xl font-bold mb-2">
            Experience & <span className="gradient-text">Education</span>
          </h2>
          <p className="text-muted-foreground">My academic journey and credentials.</p>
        </motion.div>

        <div className="space-y-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-6 flex gap-5 items-start"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan/20 to-violet/20 shrink-0">
                <item.icon className="text-cyan" size={24} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-cyan mb-1">{item.subtitle}</p>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
