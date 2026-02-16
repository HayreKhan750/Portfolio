import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificatesSection from "@/components/CertificatesSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <ProjectsSection />
        <ExperienceSection />
        <CertificatesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
