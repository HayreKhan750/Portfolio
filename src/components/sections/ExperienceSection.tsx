import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Award, Briefcase, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const ExperienceSection = () => {
  const { data: experiences = [] } = useQuery({
    queryKey: ['experience'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="experience" className="section-spacing relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            My Academic Journey & Credentials
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Professional experience and certifications
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Experience Timeline */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-cyan-400 flex items-center gap-2 mb-6">
              <Briefcase className="w-6 h-6" />
              Work Experience
            </h3>
            
            <div className="relative space-y-8">
              {/* Timeline Line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-violet-500 to-pink-500" />
              
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-2 -translate-x-[5px] w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-zinc-900" />
                  
                  <div className="glass-card rounded-lg p-6 space-y-3">
                    <div>
                      <h4 className="text-xl font-bold text-white">{exp.position}</h4>
                      <p className="text-cyan-400 font-medium">{exp.company}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date!)}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                    
                    {exp.description && (
                      <p className="text-gray-400 text-sm">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}

              {experiences.length === 0 && (
                <p className="text-gray-500 pl-8">No experience entries yet.</p>
              )}
            </div>
          </div>

          {/* Certificates */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-violet-400 flex items-center gap-2 mb-6">
              <Award className="w-6 h-6" />
              Certifications
            </h3>
            
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="glass-card glass-card-hover rounded-lg p-6 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white">{cert.name}</h4>
                      <p className="text-violet-400">{cert.issuer}</p>
                    </div>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors"
                      >
                        <Award className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(cert.issue_date)}
                  </div>

                  {cert.proof_url && (
                    <div className="mt-3">
                      <img
                        src={cert.proof_url}
                        alt={cert.name}
                        className="rounded-lg w-full h-32 object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}

              {certificates.length === 0 && (
                <p className="text-gray-500">No certificates yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
