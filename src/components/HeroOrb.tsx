import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const HeroOrb = () => {
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

  return (
    <div className="relative orb-container">
      {/* Outer Glow Rings */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-3xl animate-glow-pulse" />
      <div className="absolute inset-4 rounded-full bg-gradient-to-r from-cyan-400/30 to-violet-400/30 blur-2xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Main Orb Container */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-2xl">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-violet-500/40 to-pink-500/40 animate-glow-pulse" />
        
        {/* Profile Image */}
        {profile?.avatar_url ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-full h-full object-cover rounded-full"
              style={{
                maskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl font-bold gradient-text">HM</div>
          </div>
        )}
        
        {/* Inner Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-cyan-500/20" />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-float opacity-60" />
      <div className="absolute bottom-16 right-12 w-3 h-3 bg-violet-400 rounded-full animate-float opacity-60" style={{ animationDelay: '2s' }} />
      <div className="absolute top-20 right-16 w-2 h-2 bg-pink-400 rounded-full animate-float opacity-60" style={{ animationDelay: '3s' }} />
    </div>
  );
};

export default HeroOrb;
