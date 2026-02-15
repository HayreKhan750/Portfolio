import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  content: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

type FormData = z.infer<typeof schema>;

const ContactSection = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from("messages").insert([{
      name: data.name,
      email: data.email,
      content: data.content,
    }]);
    if (error) {
      toast.error("Failed to send message. Please try again.");
      return;
    }
    toast.success("Message sent! I'll get back to you soon.");
    reset();
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-heading text-4xl font-bold mb-2">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground">Have a project or idea? Let's talk.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div>
              <Input
                placeholder="Your Name"
                {...register("name")}
                className="bg-white/5 border-white/10 focus:border-cyan/50 placeholder:text-muted-foreground"
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="Your Email"
                type="email"
                {...register("email")}
                className="bg-white/5 border-white/10 focus:border-cyan/50 placeholder:text-muted-foreground"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Textarea
                placeholder="Your Message"
                rows={5}
                {...register("content")}
                className="bg-white/5 border-white/10 focus:border-cyan/50 placeholder:text-muted-foreground resize-none"
              />
              {errors.content && (
                <p className="text-destructive text-xs mt-1">{errors.content.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient w-full disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan/20 to-violet/20">
                <Mail className="text-cyan" size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground">hayredin.950@gmail.com</p>
              </div>
            </div>
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan/20 to-violet/20">
                <Phone className="text-cyan" size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-foreground">+251 940 522 137</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
