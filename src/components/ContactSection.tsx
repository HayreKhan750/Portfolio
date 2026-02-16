import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Github, Linkedin, Globe, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  content: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

type FormData = z.infer<typeof schema>;

const iconMap: Record<string, any> = {
  Mail, Phone, Github, Linkedin, Globe, Twitter,
  mail: Mail, phone: Phone, github: Github, linkedin: Linkedin, globe: Globe, twitter: Twitter,
  X: Twitter, x: Twitter,
};

const socialPlatforms = ["github", "linkedin", "x", "twitter"];

const normalizeUrl = (url: string, platform: string) => {
  if (!url) return url;
  const lower = platform.toLowerCase();
  if (lower === "email" || lower === "mail") {
    return url.startsWith("mailto:") ? url : `mailto:${url}`;
  }
  if (lower === "phone") {
    return url.startsWith("tel:") ? url : `tel:${url}`;
  }
  if (/^(https?:\/\/|mailto:|tel:)/.test(url)) return url;
  return `https://${url}`;
};

const ContactSection = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { data: contactMethods } = useQuery({
    queryKey: ["contact_methods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_methods").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from("messages").insert([{ name: data.name, email: data.email, content: data.content }]);
    if (error) { toast.error("Failed to send message. Please try again."); return; }
    toast.success("Message sent! I'll get back to you soon.");
    reset();
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Globe;
    return iconMap[iconName] || iconMap[iconName.toLowerCase()] || Globe;
  };

  const isSocial = (platform: string) => socialPlatforms.includes(platform.toLowerCase());
  const isEmailOrPhone = (platform: string) => ["email", "mail", "phone"].includes(platform.toLowerCase());

  const socials = contactMethods?.filter(m => isSocial(m.platform)) || [];
  const directContacts = contactMethods?.filter(m => !isSocial(m.platform)) || [];

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="font-heading text-4xl font-bold mb-2">Get in <span className="gradient-text">Touch</span></h2>
          <p className="text-muted-foreground">Have a project or idea? Let's talk.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.form initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Input placeholder="Your Name" {...register("name")} className="bg-white/5 border-white/10 focus:border-cyan/50 placeholder:text-muted-foreground" />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Input placeholder="Your Email" type="email" {...register("email")} className="bg-white/5 border-white/10 focus:border-cyan/50 placeholder:text-muted-foreground" />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Textarea placeholder="Your Message" rows={5} {...register("content")} className="bg-white/5 border-white/10 focus:border-cyan/50 placeholder:text-muted-foreground resize-none" />
              {errors.content && <p className="text-destructive text-xs mt-1">{errors.content.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-gradient w-full disabled:opacity-50">
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </motion.form>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="space-y-4">
            {/* Direct contacts (Email, Phone) with text */}
            {directContacts.map((method) => {
              const Icon = getIcon(method.icon);
              const href = normalizeUrl(method.url, method.platform);
              const isContact = isEmailOrPhone(method.platform);
              return (
                <a
                  key={method.id}
                  href={href}
                  {...(!isContact ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="glass-card p-5 flex items-center gap-4 hover:border-cyan/30 transition-all duration-300 block"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan/20 to-violet/20">
                    <Icon className="text-cyan" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{method.platform}</p>
                    <p className="text-foreground text-sm">{method.url.replace(/^mailto:/, "").replace(/^tel:/, "")}</p>
                  </div>
                </a>
              );
            })}

            {/* Social icons only */}
            {socials.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socials.map((method) => {
                  const Icon = getIcon(method.icon);
                  const href = normalizeUrl(method.url, method.platform);
                  return (
                    <a
                      key={method.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card p-4 hover:border-cyan/30 transition-all duration-300 group"
                      title={method.platform}
                    >
                      <Icon className="text-muted-foreground group-hover:text-cyan transition-colors" size={22} />
                    </a>
                  );
                })}
              </div>
            )}

            {(!contactMethods || contactMethods.length === 0) && (
              <p className="text-muted-foreground text-sm">Contact info coming soon.</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
