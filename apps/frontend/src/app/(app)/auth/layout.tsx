import { getT } from '@gitroom/react/translation/get.translation.service.backend';
export const dynamic = 'force-dynamic';
import { ReactNode } from 'react';
import loadDynamic from 'next/dynamic';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';
const ReturnUrlComponent = loadDynamic(() => import('./return.url.component'));

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getT();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050507] px-4 font-sans">
      <ReturnUrlComponent />

      {/* ===== GLOBAL BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Mesh Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30 mix-blend-screen animate-aurora"
             style={{
               background: 'linear-gradient(to top, rgba(124,58,237,0.3) 0%, rgba(59,130,246,0.2) 40%, transparent 100%)',
             }} />
        
        {/* Ambient Glowing Spheres */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[150px] animate-float" style={{animationDuration: '25s'}} />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[150px] animate-float" style={{animationDuration: '30s', animationDelay: '-5s'}} />
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full bg-pink-600/15 blur-[150px] animate-float" style={{animationDuration: '35s', animationDelay: '-10s'}} />
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] animate-float" style={{animationDuration: '20s', animationDelay: '-15s'}} />

        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}} />

        {/* Particle Field (Pure CSS simulation) */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} 
               className="absolute rounded-full bg-white/40 animate-particle-float"
               style={{
                 width: Math.random() * 4 + 1 + 'px',
                 height: Math.random() * 4 + 1 + 'px',
                 left: Math.random() * 100 + '%',
                 bottom: '-10%',
                 animationDuration: Math.random() * 15 + 10 + 's',
                 animationDelay: Math.random() * -20 + 's',
                 opacity: Math.random() * 0.5 + 0.2,
               }} />
        ))}
      </div>

      {/* ===== CENTERED AUTH CARD ===== */}
      <div className="relative z-10 w-full max-w-md animate-fade-scale-in">
        {/* Glassmorphic Container */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl shadow-[0_0_60px_-15px_rgba(124,58,237,0.25)] p-8 md:p-10 flex flex-col">
          
          {/* Card Header */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
              <LogoTextComponent />
            </div>
            {/* The child component (Login/Register) will handle its own title if needed, 
                but we provide a wrapper that enforces the premium styling for forms */}
          </div>

          {/* Form Content Wrapper */}
          <div className="flex-1 flex flex-col w-full auth-form-wrapper">
            {children}
          </div>
        </div>
      </div>

      {/* ===== ANIMATION STYLES ===== */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes particle-float {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-120vh) scale(1); opacity: 0; }
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes aurora {
          0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.3; }
          50% { transform: translateY(-5%) scaleY(1.1); opacity: 0.5; }
        }
        .animate-float { animation: float 20s infinite ease-in-out; }
        .animate-particle-float { animation: particle-float linear infinite; }
        .animate-fade-scale-in { animation: fadeScaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-aurora { animation: aurora 15s ease-in-out infinite; }
        
        /* Global override for inner form elements to match the requested premium style */
        .auth-form-wrapper input {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important; /* xl */
          color: white !important;
          transition: all 0.3s ease !important;
        }
        .auth-form-wrapper input:focus {
          border-color: rgba(168, 85, 247, 0.5) !important;
          box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
        }
        .auth-form-wrapper input::placeholder {
          color: #6b7280 !important; /* gray-500 */
        }
        .auth-form-wrapper label {
          color: #d1d5db !important; /* gray-300 */
          font-size: 0.875rem !important; /* text-sm */
          font-weight: 500 !important; /* font-medium */
          margin-bottom: 0.375rem !important; /* mb-1.5 */
        }
        .auth-form-wrapper button[type="submit"] {
          background: linear-gradient(135deg, #7c3aed, #3b82f6) !important;
          border-radius: 0.75rem !important;
          transition: all 0.3s ease !important;
        }
        .auth-form-wrapper button[type="submit"]:hover {
          box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.25) !important;
          transform: scale(1.02) !important;
        }
        .auth-form-wrapper button[type="submit"]:active {
          transform: scale(0.98) !important;
        }
        .auth-form-wrapper .divider {
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: #6b7280 !important;
        }
      `}} />
    </div>
  );
}
