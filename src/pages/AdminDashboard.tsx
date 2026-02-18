import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Briefcase, Award, Code2, Mail, User, Link as LinkIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/admin/DashboardStats';
import ProjectsTab from '@/components/admin/ProjectsTab';
import SkillsTab from '@/components/admin/SkillsTab';
import ExperienceTab from '@/components/admin/ExperienceTab';
import CertificatesTab from '@/components/admin/CertificatesTab';
import MessagesTab from '@/components/admin/MessagesTab';
import ProfileTab from '@/components/admin/ProfileTab';
import SocialLinksTab from '@/components/admin/SocialLinksTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch counts for stats
  const { data: projectsCount = 0 } = useQuery({
    queryKey: ['projects-count'],
    queryFn: async () => {
      const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: skillsCount = 0 } = useQuery({
    queryKey: ['skills-count'],
    queryFn: async () => {
      const { count } = await supabase.from('skills').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: experienceCount = 0 } = useQuery({
    queryKey: ['experience-count'],
    queryFn: async () => {
      const { count } = await supabase.from('experience').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: certificatesCount = 0 } = useQuery({
    queryKey: ['certificates-count'],
    queryFn: async () => {
      const { count } = await supabase.from('certificates').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your portfolio content</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="glass-card p-2 h-auto flex-wrap justify-start gap-2">
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                <Briefcase className="w-4 h-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-2">
                <Code2 className="w-4 h-4" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="experience" className="gap-2">
                <Briefcase className="w-4 h-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="certificates" className="gap-2">
                <Award className="w-4 h-4" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="social" className="gap-2">
                <LinkIcon className="w-4 h-4" />
                Social Links
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <Mail className="w-4 h-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardStats
                projectsCount={projectsCount}
                skillsCount={skillsCount}
                experienceCount={experienceCount}
                certificatesCount={certificatesCount}
              />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsTab count={projectsCount} />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsTab count={skillsCount} />
            </TabsContent>

            <TabsContent value="experience">
              <ExperienceTab count={experienceCount} />
            </TabsContent>

            <TabsContent value="certificates">
              <CertificatesTab count={certificatesCount} />
            </TabsContent>

            <TabsContent value="social">
              <SocialLinksTab />
            </TabsContent>

            <TabsContent value="messages">
              <MessagesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
