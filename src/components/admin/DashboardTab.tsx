import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FolderOpen, Award, Code2, Briefcase } from "lucide-react";

const stats = [
  { key: "projects", label: "Projects", icon: FolderOpen, color: "from-cyan/20 to-cyan/5 text-cyan" },
  { key: "certificates", label: "Certificates", icon: Award, color: "from-violet/20 to-violet/5 text-violet" },
  { key: "skills", label: "Skills", icon: Code2, color: "from-emerald-500/20 to-emerald-500/5 text-emerald-400" },
  { key: "experience", label: "Experience", icon: Briefcase, color: "from-amber-500/20 to-amber-500/5 text-amber-400" },
];

const DashboardTab = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      const tables = ["projects", "certificates", "skills", "experience"] as const;
      const results: Record<string, number> = {};
      await Promise.all(
        tables.map(async (table) => {
          const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
          results[table] = count ?? 0;
        })
      );
      setCounts(results);
    };
    fetchCounts();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="glass-card p-6 flex flex-col items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${s.color}`}>
                <Icon size={24} />
              </div>
              <span className="font-heading text-3xl font-bold">{counts[s.key] ?? "–"}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardTab;
