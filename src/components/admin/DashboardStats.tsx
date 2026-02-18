import { Briefcase, Award, Code2, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  projectsCount: number;
  skillsCount: number;
  experienceCount: number;
  certificatesCount: number;
}

const DashboardStats = ({
  projectsCount,
  skillsCount,
  experienceCount,
  certificatesCount,
}: DashboardStatsProps) => {
  const stats = [
    {
      label: 'Total Projects',
      value: projectsCount,
      icon: Briefcase,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
    },
    {
      label: 'Total Skills',
      value: skillsCount,
      icon: Code2,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-400',
    },
    {
      label: 'Total Certificates',
      value: certificatesCount,
      icon: Award,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400',
    },
    {
      label: 'Total Experience',
      value: experienceCount,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-6 space-y-4 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardStats;
