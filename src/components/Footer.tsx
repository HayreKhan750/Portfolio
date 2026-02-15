import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-white/10 py-8 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Hayredin Mohammed. All rights reserved.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="text-muted-foreground/30 hover:text-muted-foreground transition-colors"
          aria-label="Admin Login"
        >
          <Lock size={14} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
