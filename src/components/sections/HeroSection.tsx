import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ArrowDown } from 'lucide-react';
import HeroOrb from '../HeroOrb';

const HeroSection = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  });

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="block text-white mb-2">Hi, I'm</span>
                <span className="gradient-text">{profile?.name || 'Loading...'}</span>
              </h1>
              
              {profile?.headline && (
                <p className="text-2xl md:text-3xl text-cyan-400 font-medium">
                  {profile.headline}
                </p>
              )}
              
              {profile?.bio && (
                <p className="text-lg text-gray-400 max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToProjects}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                View My Work
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 rounded-lg border border-cyan-500/50 text-cyan-400 font-medium hover:bg-cyan-500/10 transition-all duration-300"
              >
                Get In Touch
              </button>
            </div>
          </div>

          {/* Right Content - Orb with Profile Picture */}
          <div className="flex justify-center lg:justify-end">
            <HeroOrb />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-cyan-400" />
      </div>
    </section>
  );
};

export default HeroSection;
