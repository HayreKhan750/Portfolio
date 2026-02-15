import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="glass-card p-8 w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan/20 to-violet/20">
            <Lock className="text-cyan" size={24} />
          </div>
        </div>
        <h1 className="font-heading text-2xl font-bold text-center mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border-white/10"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 border-white/10"
            required
          />
          <button type="submit" disabled={loading} className="btn-gradient w-full disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
