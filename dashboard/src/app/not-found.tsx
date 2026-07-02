import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Frown, ArrowLeft, LogIn } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center hero-gradient p-4 relative overflow-hidden">
      {/* Decorative Blur Background elements with slow pulse animations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-[pulse_6s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-error/10 rounded-full blur-[120px] pointer-events-none animate-[ping_8s_ease-in-out_infinite]" />

      <GlassCard className="relative z-10 p-12 max-w-lg w-full text-center shadow-2xl border-outline-variant/50 backdrop-blur-xl animate-[fade-in-up_0.6s_ease-out]">
        
        {/* Animated Floating Ghost / Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center animate-[bounce_3s_ease-in-out_infinite]">
            {/* Background glowing circle */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-[pulse_2s_ease-in-out_infinite]" />
            <Frown className="w-24 h-24 text-primary drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 tracking-tight drop-shadow-sm">
          404
        </h1>
        <h2 className="text-2xl font-bold text-on-surface mb-3">Page Not Found</h2>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          Oops! It looks like you've wandered into the unknown. 
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button variant="gradient" className="w-full sm:w-auto flex items-center gap-2 group shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Return to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 bg-surface/50 hover:bg-surface border-outline-variant/50 transition-all duration-300">
              <LogIn className="w-5 h-5" />
              Go to Login
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* Inline styles for custom animations that Tailwind might not have by default */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}
