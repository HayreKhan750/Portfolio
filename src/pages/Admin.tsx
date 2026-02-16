import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProfileTab from "@/components/admin/ProfileTab";
import ExperienceTab from "@/components/admin/ExperienceTab";
import ProjectsTab from "@/components/admin/ProjectsTab";
import CertificatesTab from "@/components/admin/CertificatesTab";
import ContactsTab from "@/components/admin/ContactsTab";
import MessagesTab from "@/components/admin/MessagesTab";

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/login");
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/login");
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;

  const renderTab = () => {
    switch (tab) {
      case "profile": return <ProfileTab />;
      case "experience": return <ExperienceTab />;
      case "projects": return <ProjectsTab />;
      case "certificates": return <CertificatesTab />;
      case "contacts": return <ContactsTab />;
      case "messages": return <MessagesTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        <AdminSidebar activeTab={tab} onTabChange={setTab} onLogout={handleLogout} />
        <main className="flex-1 min-w-0">{renderTab()}</main>
      </div>
    </div>
  );
};

export default AdminPage;
