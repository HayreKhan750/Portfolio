import { motion } from "framer-motion";
import { ArrowDown, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profile").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const avatarUrl = (profile as any)?.avatar_url;

  return (
    <section className="relative min-h-screen flex items-center pt-20 px-6">
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-cyan text-sm font-medium tracking-widest uppercase mb-4">
            {profile?.headline || "AI / ML Engineer"}
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-3">
            <span className="gradient-text">Hayredin</span>{" "}
            <span className="text-foreground">Mohammed</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">{profile?.headline || ""}</p>
          <p className="text-muted-foreground text-base max-w-md mb-8 leading-relaxed">
            {profile?.bio || "Loading..."}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#work" className="btn-gradient inline-flex items-center gap-2">
              View Work <ArrowDown size={16} />
            </a>
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-foreground hover:bg-white/5 transition-colors font-medium"
              >
                Download CV <FileDown size={16} />
              </a>
            )}
          </div>
        </motion.div>

        {/* Animated sphere with avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden md:flex items-center justify-center"
        >
          <div className="relative w-72 h-72 lg:w-96 lg:h-96">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan/20 to-violet/20 animate-pulse-glow blur-3xl" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan/10 to-violet/10 backdrop-blur-sm border border-white/10 animate-float" />
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-cyan/30 to-violet/30 blur-xl animate-float" style={{ animationDelay: "1s" }} />
            {avatarUrl && (
              <div className="absolute inset-12 lg:inset-16 rounded-full overflow-hidden flex items-center justify-center z-10">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  style={{ mask: "radial-gradient(circle, black 60%, transparent 100%)", WebkitMask: "radial-gradient(circle, black 60%, transparent 100%)" }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
