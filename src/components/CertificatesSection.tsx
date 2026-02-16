import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Award, ExternalLink } from "lucide-react";

const CertificatesSection = () => {
  const { data: certificates } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-heading text-4xl font-bold mb-2">
            <span className="gradient-text">Certificates</span>
          </h2>
          <p className="text-muted-foreground">Professional certifications and credentials.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex flex-col gap-3"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan/20 to-violet/20 w-fit">
                <Award className="text-cyan" size={22} />
              </div>
              <h3 className="font-heading text-lg font-semibold">{cert.name}</h3>
              <p className="text-sm text-muted-foreground">{cert.issuer} {cert.date && `· ${cert.date}`}</p>
              {cert.proof_url && (
                <a
                  href={cert.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-cyan hover:underline mt-auto"
                >
                  <ExternalLink size={14} /> View Proof
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
