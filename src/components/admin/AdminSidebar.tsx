import { User, Briefcase, FolderOpen, Award, Phone, MessageSquare, LogOut } from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "contacts", label: "Contacts", icon: Phone },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

const AdminSidebar = ({ activeTab, onTabChange, onLogout }: AdminSidebarProps) => {
  return (
    <aside className="w-64 shrink-0 glass-card p-4 flex flex-col gap-2 h-fit sticky top-6">
      <h2 className="font-heading text-lg font-bold mb-4 px-2">
        <span className="gradient-text">Admin</span>
      </h2>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 w-full text-left ${
            activeTab === tab.id
              ? "bg-white/10 text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          <tab.icon size={18} />
          {tab.label}
        </button>
      ))}
      <div className="mt-auto pt-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
