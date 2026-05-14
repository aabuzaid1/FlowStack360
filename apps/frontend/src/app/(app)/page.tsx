import React from 'react';
import Link from 'next/link';
import { getT } from '@gitroom/react/translation/get.translation.service.backend';
import { LandingPricing } from '@gitroom/frontend/components/billing/landing.pricing.component';

export const dynamic = 'force-dynamic';

const genericIcon = (letter: string, bg: string) => (
  <svg viewBox="0 0 24 24" className="w-full h-full rounded-full" style={{ backgroundColor: bg }}>
    <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
      {letter}
    </text>
  </svg>
);

const ICONS = {
  instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  youtube: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>,
  twitter: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  linkedin: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>,
  tiktok: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.86v-3.5a6.34 6.34 0 0 0-5.76 6.36 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.23-6.32V10.3a8.31 8.31 0 0 0 4.29 1.15V8a5.35 5.35 0 0 1-1-.07v-1.24z" /></svg>,
  discord: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>,
  facebook: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
  reddit: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" /></svg>,
  slack: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" /></svg>,
  pinterest: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z" /></svg>,
  telegram: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.676c.223-.198-.054-.31-.346-.116l-6.405 4.04-2.772-.87c-.602-.19-.611-.602.126-.893l10.826-4.17c.502-.18.966.115.823.905z" /></svg>,
};

const ALL_PLATFORMS = [
  { name: 'Instagram', icon: ICONS.instagram, color: 'text-pink-500' },
  { name: 'Reddit', icon: ICONS.reddit, color: 'text-orange-500' },
  { name: 'LinkedIn', icon: ICONS.linkedin, color: 'text-blue-500' },
  { name: 'Twitter/X', icon: ICONS.twitter, color: 'text-gray-900 dark:text-white' },
  { name: 'YouTube', icon: ICONS.youtube, color: 'text-red-500' },
  { name: 'Facebook', icon: ICONS.facebook, color: 'text-blue-600' },
  { name: 'Slack', icon: ICONS.slack, color: 'text-purple-500' },
  { name: 'Discord', icon: ICONS.discord, color: 'text-indigo-500' },
  { name: 'Pinterest', icon: ICONS.pinterest, color: 'text-red-600' },
  { name: 'TikTok', icon: ICONS.tiktok, color: 'text-gray-900 dark:text-white' },
  { name: 'Telegram', icon: ICONS.telegram, color: 'text-blue-400' },
  { name: 'Twitch', icon: genericIcon('T', '#9146FF'), color: 'text-purple-400' },
  { name: 'Threads', icon: genericIcon('@', '#000000'), color: 'text-gray-900 dark:text-white' },
  { name: 'Bluesky', icon: genericIcon('B', '#0085ff'), color: 'text-blue-500' },
  { name: 'Mastodon', icon: genericIcon('M', '#6364FF'), color: 'text-indigo-400' },
  { name: 'Medium', icon: genericIcon('M', '#000000'), color: 'text-gray-900 dark:text-white' },
  { name: 'WordPress', icon: genericIcon('W', '#21759b'), color: 'text-blue-600' },
  { name: 'Hashnode', icon: genericIcon('H', '#2962FF'), color: 'text-blue-500' },
  { name: 'Dev.to', icon: genericIcon('D', '#000000'), color: 'text-gray-900 dark:text-white' },
  { name: 'Google My Business', icon: genericIcon('G', '#4285F4'), color: 'text-blue-500' },
  { name: 'Kick', icon: genericIcon('K', '#53fc18'), color: 'text-green-500' },
  { name: 'Nostr', icon: genericIcon('N', '#7C3AED'), color: 'text-purple-500' },
  { name: 'Farcaster', icon: genericIcon('F', '#8a2be2'), color: 'text-purple-500' },
  { name: 'Moltbook', icon: genericIcon('M', '#ef4444'), color: 'text-red-500' },
  { name: 'ListMonk', icon: genericIcon('L', '#3b82f6'), color: 'text-blue-500' },
  { name: 'VK', icon: genericIcon('V', '#4c75a3'), color: 'text-blue-600' },
  { name: 'Lemmy', icon: genericIcon('L', '#000000'), color: 'text-gray-900 dark:text-white' },
  { name: 'MeWe', icon: genericIcon('M', '#0a1638'), color: 'text-indigo-900 dark:text-indigo-400' },
  { name: 'Skool', icon: genericIcon('S', '#FDE047'), color: 'text-yellow-500' },
  { name: 'Whop', icon: genericIcon('W', '#FF4500'), color: 'text-orange-500' },
];

export default async function LandingPage() {
  const t = await getT();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050507] text-gray-900 dark:text-white overflow-hidden relative font-sans transition-colors duration-500">
      {/* ===== GLOBAL BACKGROUND EFFECTS ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Gradient Mesh Overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(236,72,153,0.1) 0%, transparent 50%)',
          }} />
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="relative z-10 min-h-screen flex flex-col pt-6 pb-24">
        {/* Hero Background Orbs (Optimized for Performance) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] animate-float opacity-70" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', animationDuration: '25s', willChange: 'transform' }} />
          <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] animate-float opacity-70" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', animationDuration: '28s', animationDelay: '-5s', willChange: 'transform' }} />
          <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] animate-float opacity-70" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', animationDuration: '30s', animationDelay: '-10s', willChange: 'transform' }} />
          {/* Subtle Grid overlay fading at edges */}
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
          }} />
        </div>

        {/* ===== PLATFORM NETWORK MAP (BEHIND TEXT) ===== */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] hidden md:block">
          {(() => {
            const positions = [
              { top: '15%', left: '12%', size: 'w-16 h-16', iconSize: 'w-8 h-8', delay: '0s' },
              { top: '20%', left: '85%', size: 'w-20 h-20', iconSize: 'w-10 h-10', delay: '-5s' },
              { top: '55%', left: '8%', size: 'w-14 h-14', iconSize: 'w-6 h-6', delay: '-12s' },
              { top: '45%', left: '90%', size: 'w-16 h-16', iconSize: 'w-8 h-8', delay: '-8s' },
              { top: '80%', left: '20%', size: 'w-18 h-18', iconSize: 'w-10 h-10', delay: '-16s' },
              { top: '75%', left: '82%', size: 'w-16 h-16', iconSize: 'w-8 h-8', delay: '-3s' },
              { top: '30%', left: '25%', size: 'w-12 h-12', iconSize: 'w-6 h-6', delay: '-7s' },
              { top: '35%', left: '75%', size: 'w-14 h-14', iconSize: 'w-7 h-7', delay: '-10s' },
              { top: '65%', left: '28%', size: 'w-16 h-16', iconSize: 'w-8 h-8', delay: '-2s' },
              { top: '60%', left: '70%', size: 'w-12 h-12', iconSize: 'w-6 h-6', delay: '-14s' },
              { top: '10%', left: '35%', size: 'w-14 h-14', iconSize: 'w-7 h-7', delay: '-6s' },
              { top: '12%', left: '65%', size: 'w-16 h-16', iconSize: 'w-8 h-8', delay: '-9s' },
              { top: '85%', left: '40%', size: 'w-12 h-12', iconSize: 'w-6 h-6', delay: '-1s' },
              { top: '88%', left: '60%', size: 'w-18 h-18', iconSize: 'w-10 h-10', delay: '-11s' },
              { top: '48%', left: '18%', size: 'w-12 h-12', iconSize: 'w-6 h-6', delay: '-4s' },
            ];

            const connections = [
              { from: 0, to: 6, delay: '0s' }, { from: 6, to: 10, delay: '1s' },
              { from: 1, to: 7, delay: '0.5s' }, { from: 7, to: 11, delay: '1.5s' },
              { from: 2, to: 14, delay: '2s' }, { from: 14, to: 8, delay: '0.8s' }, { from: 8, to: 4, delay: '1.2s' }, { from: 4, to: 12, delay: '2.5s' },
              { from: 3, to: 9, delay: '1.8s' }, { from: 9, to: 5, delay: '0.3s' }, { from: 5, to: 13, delay: '2.1s' },
              { from: 6, to: 7, delay: '3s' }, { from: 8, to: 9, delay: '2.8s' }, { from: 10, to: 11, delay: '1.9s' }, { from: 12, to: 13, delay: '0.6s' },
              { from: 14, to: 6, delay: '1.4s' }, { from: 9, to: 14, delay: '2.3s' }, { from: 7, to: 8, delay: '0.9s' }
            ];

            return (
              <>
                <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#EC4899" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Data flow lines */}
                  <g strokeWidth="1.5" fill="none">
                    {/* Static faint connection lines */}
                    <g stroke="rgba(124,58,237,0.15)" className="dark:stroke-white/10">
                      {connections.map((conn, i) => (
                        <line key={`static-${i}`} x1={positions[conn.from].left} y1={positions[conn.from].top} x2={positions[conn.to].left} y2={positions[conn.to].top} />
                      ))}
                    </g>
                    {/* Flowing animated data packets */}
                    <g stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" className="opacity-90">
                      {connections.map((conn, i) => (
                        <line key={`flow-${i}`} x1={positions[conn.from].left} y1={positions[conn.from].top} x2={positions[conn.to].left} y2={positions[conn.to].top} strokeDasharray="30 1000" className="animate-data-flow" style={{ animationDelay: conn.delay, animationDuration: '4s' }} />
                      ))}
                    </g>
                  </g>
                </svg>

                {/* Floating Platform Nodes */}
                {ALL_PLATFORMS.slice(0, 15).map((platform, i) => {
                  const node = positions[i];
                  return (
                    <div key={i}
                      className={`absolute ${node.size} -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-lg dark:shadow-[0_0_30px_rgba(124,58,237,0.15)] animate-float overflow-hidden group`}
                      style={{ top: node.top, left: node.left, animationDelay: node.delay, willChange: 'transform' }}>
                      <div className="absolute inset-0 bg-gray-50/50 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow" />
                      <div className={`${node.iconSize} ${platform.color} drop-shadow-sm dark:drop-shadow-[0_0_8px_currentColor] transform group-hover:scale-110 transition-transform duration-300 relative z-10 flex items-center justify-center`}>
                        {platform.icon}
                      </div>
                    </div>
                  );
                })}
              </>
            );
          })()}
        </div>

        {/* ===== FLOATING NAVBAR ===== */}
        <nav className="flex items-center justify-between px-6 py-3 max-w-5xl mx-auto w-full rounded-[2rem] backdrop-blur-2xl bg-white/70 dark:bg-black/40 border border-gray-200 dark:border-white/10 mt-6 mb-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(124,58,237,0.1)] transition-all sticky top-6 z-50" style={{ direction: 'ltr' }}>
          <div className="flex items-center gap-2.5 group cursor-pointer pl-2">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent transition-colors duration-300">
              FlowStack360
            </span>
          </div>

          {/* Centered Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <Link href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="text-sm font-bold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-300 px-4 py-2 hidden sm:block">
              {t('sign_in', 'Sign In')}
            </Link>
            <Link href="/auth">
              <button className="relative group overflow-hidden text-sm font-bold text-white rounded-[1.5rem] px-7 py-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(124,58,237,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-shift bg-[length:200%_200%]" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {t('get_started', 'Get Started')}
                </span>
              </button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="relative flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto z-10">


          {/* Headline & Badge */}
          <div className="animate-fade-slide-up mb-6 flex justify-center" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-sm font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              FlowStack360 AI Platform
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight mb-8 leading-[1.05] max-w-5xl drop-shadow-2xl">
            <div className="animate-fade-slide-up text-gray-900 dark:text-white" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              {t('hero_title_1', 'Automate Your Social Media')}
            </div>
            <div className="animate-fade-slide-up bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent pb-4 pt-2" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              {t('hero_title_2', 'with AI Intelligence')}
            </div>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in drop-shadow-lg font-medium" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            {t('hero_description', 'Plan, generate, and schedule posts automatically across 30+ social media platforms — powered by AI that perfectly understands your brand.')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-slide-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
            <Link href="/auth">
              <button className="relative group overflow-hidden text-white rounded-2xl px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(124,58,237,0.6)]">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 animate-gradient-shift bg-[length:200%_200%]" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {t('start_now', 'Start Now — It\'s Free')}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-2xl px-10 py-4 text-lg font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/10 shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                {t('sign_in', 'Sign In')}
              </button>
            </Link>
          </div>



          {/* 3D App Dashboard Mockup (Calendar View) */}
          <div id="how-it-works" className="mt-20 relative w-full max-w-5xl mx-auto perspective-1000 animate-fade-slide-up scroll-mt-32" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
            {/* Glow behind mockup */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 to-blue-600/0 blur-[80px] rounded-[40px] transform rotate-x-12 translate-y-10" />

            <div className="relative rounded-t-[20px] border-x border-t border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#050507]/90 backdrop-blur-3xl shadow-[0_-20px_60px_rgba(124,58,237,0.1)] dark:shadow-[0_-20px_60px_rgba(124,58,237,0.2)] overflow-hidden transition-all duration-700 ease-out hover:shadow-[0_-20px_80px_rgba(124,58,237,0.2)] dark:hover:shadow-[0_-20px_80px_rgba(124,58,237,0.35)]"
              style={{ transform: 'perspective(1200px) rotateX(8deg) scale(0.95)', transformOrigin: 'top center', direction: 'ltr' }} dir="ltr">

              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]" style={{ direction: 'ltr', flexDirection: 'row' }}>
                <div className="flex gap-1.5" style={{ flexDirection: 'row' }}>
                  <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
                <div className="mx-auto px-16 py-1.5 rounded-lg bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 text-xs text-gray-500 font-medium flex items-center gap-2" style={{ flexDirection: 'row' }}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  flowstack360.app/calendar
                </div>
              </div>

              {/* App Body */}
              <div className="flex min-h-[500px]" style={{ direction: 'ltr', flexDirection: 'row' }}>
                {/* Left Sidebar */}
                <div className="w-20 border-r border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.01] flex flex-col items-center py-6 gap-6 shrink-0 z-10" style={{ borderRightWidth: '1px' }}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-[0_0_15px_rgba(124,58,237,0.4)] flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-lg">O</span>
                  </div>
                  {/* Active Calendar Icon */}
                  <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  {/* Inactive Icons */}
                  {[
                    <svg key="1" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                    <svg key="2" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
                    <svg key="3" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ].map((icon, i) => (
                    <div key={i} className="w-10 h-10 rounded-lg bg-white/[0.02] text-gray-500 flex items-center justify-center hover:bg-white/[0.05] hover:text-gray-300 transition-colors cursor-pointer">
                      {icon}
                    </div>
                  ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0" style={{ direction: 'ltr' }}>
                  {/* Top Bar */}
                  <div className="h-16 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-8 bg-white dark:bg-white/[0.01]" style={{ flexDirection: 'row' }}>
                    <div className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3" style={{ flexDirection: 'row' }}>
                      Calendar
                    </div>
                    <div className="flex items-center gap-4" style={{ flexDirection: 'row' }}>
                      <div className="px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/5 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-colors" style={{ flexDirection: 'row' }}>
                        <span>May 2026</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white font-bold shadow-[0_0_10px_rgba(124,58,237,0.5)] cursor-pointer">
                        A
                      </div>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="flex-1 p-6" style={{ direction: 'ltr' }}>
                    <div className="grid grid-cols-7 gap-3 h-full min-h-[300px]" style={{ direction: 'ltr' }}>
                      {/* Days Header */}
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                        <div key={i} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{day}</div>
                      ))}
                      {/* Grid Cells */}
                      {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 flex flex-col gap-2 hover:bg-white/[0.04] transition-colors relative group">
                          <span className="text-gray-500 text-xs font-medium">{i + 1}</span>

                          {/* Scheduled Posts Mockup */}
                          {i === 9 && <div className="w-full h-6 rounded bg-purple-500/20 border border-purple-500/30 flex items-center px-2 animate-pulse"><div className="w-2.5 h-2.5 rounded-full bg-purple-400 mr-2 shrink-0" /> <div className="w-1/2 h-1.5 bg-purple-300/50 rounded" /></div>}
                          {i === 12 && <div className="w-full h-6 rounded bg-blue-500/20 border border-blue-500/30 flex items-center px-2 animate-pulse" style={{ animationDelay: '0.5s' }}><div className="w-2.5 h-2.5 rounded-full bg-blue-400 mr-2 shrink-0" /> <div className="w-2/3 h-1.5 bg-blue-300/50 rounded" /></div>}
                          {i === 15 && (
                            <>
                              <div className="w-full h-6 rounded bg-pink-500/20 border border-pink-500/30 flex items-center px-2 animate-pulse" style={{ animationDelay: '1s' }}><div className="w-2.5 h-2.5 rounded-full bg-pink-400 mr-2 shrink-0" /> <div className="w-1/3 h-1.5 bg-pink-300/50 rounded" /></div>
                              <div className="w-full h-6 rounded bg-white/10 flex items-center px-2"><div className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-2 shrink-0" /> <div className="w-1/2 h-1.5 bg-gray-400/50 rounded" /></div>
                            </>
                          )}
                          {i === 22 && <div className="w-full h-6 rounded bg-green-500/20 border border-green-500/30 flex items-center px-2 animate-pulse" style={{ animationDelay: '1.5s' }}><div className="w-2.5 h-2.5 rounded-full bg-green-400 mr-2 shrink-0" /> <div className="w-1/2 h-1.5 bg-green-300/50 rounded" /></div>}

                          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Glass Reflection Overlay */}
              <div className="absolute inset-0 pointer-events-none rounded-t-[20px] bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0" />
            </div>
          </div>
        </main>
      </div>

      {/* ===== PREMIUM SOCIAL PROOF (All Platforms) ===== */}
      <section className="relative z-10 py-24 border-y border-gray-200/50 dark:border-white/5 bg-gray-50/50 dark:bg-[#0a0a0f]/50 overflow-hidden" dir="ltr">
        {/* Abstract Background Glows */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(124,58,237,0.05)_0%,transparent_70%)] -translate-y-1/2 -translate-x-1/2 pointer-events-none will-change-transform" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.05)_0%,transparent_70%)] -translate-y-1/2 translate-x-1/2 pointer-events-none will-change-transform" />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600" />
            <h3 className="text-xs sm:text-sm font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-gray-400 dark:via-gray-100 dark:to-gray-400 uppercase">
              Connect all your platforms in one place
            </h3>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600" />
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {ALL_PLATFORMS.map((platform, i) => (
              <div key={i} className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/5 hover:border-purple-500/30 dark:hover:border-purple-500/40 hover:bg-white dark:hover:bg-purple-500/10 hover:-translate-y-1 transition-all duration-300 cursor-default shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(124,58,237,0.2)] backdrop-blur-sm">
                <div className={`w-5 h-5 ${platform.color} group-hover:scale-110 transition-transform duration-300 flex items-center justify-center drop-shadow-sm`}>
                  {platform.icon}
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PREMIUM SERVICES BENTO GRID ===== */}
      <section id="features" className="relative z-10 py-32 px-6 scroll-mt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">
              Everything you need to <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">dominate social media</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-xl leading-relaxed">
              FlowStack360 combines AI power with smart scheduling to help you grow your audience effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">

            {/* 1. AI Content Creation (Span 2 Cols) */}
            <div className="md:col-span-2 group relative rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_-10px_rgba(124,58,237,0.2)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute right-0 top-0 w-2/3 h-full overflow-hidden pointer-events-none mask-edges">
                {/* Visual: AI Text Generation Mockup */}
                <div className="absolute right-[-10%] top-[20%] w-[120%] h-[120%] bg-gradient-to-l from-white dark:from-[#050507] to-transparent z-10" />
                <div className="absolute top-[30%] left-[20%] w-full flex flex-col gap-4 transform group-hover:translate-x-4 transition-transform duration-700 ease-out">
                  <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse"><div className="w-3 h-3 bg-purple-500 rounded-full" /></div><div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded-full" /></div>
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/10 rounded-full ml-9" />
                  <div className="h-4 w-4/6 bg-gray-200 dark:bg-white/10 rounded-full ml-9" />
                </div>
              </div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-end w-2/3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">AI-Powered Content Creation</h3>
                <p className="text-gray-600 dark:text-gray-400">Generate captions, threads, and visuals tailored for each platform. Our AI perfectly understands your brand voice.</p>
              </div>
            </div>

            {/* 2. Intelligent Scheduling (Span 1 Col, 2 Rows) */}
            <div className="md:row-span-2 group relative rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] transition-all duration-500 flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex-1 p-8 pb-0 overflow-hidden pointer-events-none flex justify-center">
                {/* Visual: Vertical Stack of scheduled posts */}
                <div className="w-full max-w-[200px] flex flex-col gap-3 transform group-hover:-translate-y-4 transition-transform duration-700 ease-out mt-10">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm relative overflow-hidden" style={{ transform: `scale(${1 - i * 0.05})`, opacity: 1 - i * 0.2 }}>
                      <div className="w-1/2 h-3 bg-blue-500/30 rounded-full mb-3" />
                      <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full mb-2" />
                      <div className="w-3/4 h-2 bg-gray-200 dark:bg-white/10 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 p-10 mt-auto">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Intelligent Scheduling</h3>
                <p className="text-gray-600 dark:text-gray-400">Schedule posts across 30+ platforms from one unified calendar effortlessly.</p>
              </div>
            </div>

            {/* 3. Deep Analytics & Insights (Span 1 Col) */}
            <div className="group relative rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.2)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none flex items-end justify-between px-10 pb-20">
                {/* Visual: Bar Chart */}
                {[40, 70, 45, 90, 60].map((h, i) => (
                  <div key={i} className="w-8 bg-gradient-to-t from-pink-500 to-orange-400 rounded-t-md transform origin-bottom group-hover:scale-y-110 transition-transform duration-500 ease-out" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Deep Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Measure ROI and get actionable insights to grow faster.</p>
              </div>
            </div>

            {/* 4. One-Click Publishing (Span 1 Col) */}
            <div className="group relative rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute right-0 top-0 w-full h-full flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-48 h-48 animate-[spin_20s_linear_infinite]">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                </svg>
              </div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Publish Everywhere</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Automatically adapt content format for each social network.</p>
              </div>
            </div>

            {/* 5. AI Media Generation (Span 2 Cols) */}
            <div className="md:col-span-2 group relative rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-bl from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute right-[-5%] bottom-[-20%] w-[60%] h-[120%] overflow-hidden pointer-events-none transform group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-700 ease-out">
                {/* Visual: Media Generation */}
                <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 opacity-80 blur-sm mix-blend-overlay dark:mix-blend-color" />
                <div className="absolute inset-4 rounded-[1.5rem] bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
                  <svg className="w-16 h-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              </div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-end w-1/2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">AI Media Generation</h3>
                <p className="text-gray-600 dark:text-gray-400">Create stunning visuals and short videos with AI. Built-in Canva-like editor for quick design tweaks.</p>
              </div>
            </div>

            {/* 6. Team Workspaces (Span 1 Col) */}
            <div className="group relative rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-10 right-10 flex -space-x-3 pointer-events-none transform group-hover:scale-110 transition-transform duration-500 ease-out">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#050507] bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    U{i}
                  </div>
                ))}
              </div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Team Workspaces</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Collaborate seamlessly and assign roles efficiently.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== PREMIUM DYNAMIC PRICING ===== */}
      <LandingPricing />

      {/* ===== PREMIUM CTA FOOTER ===== */}
      <section className="relative z-10 py-32 px-6 overflow-hidden" dir="ltr">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-black/5 dark:bg-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/20 via-blue-600/5 to-transparent blur-[80px] pointer-events-none rounded-[100%]" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="relative rounded-[3rem] overflow-hidden bg-white/60 dark:bg-white/[0.02] border border-white/40 dark:border-white/10 backdrop-blur-2xl shadow-2xl p-12 md:p-20 text-center">

            {/* Inner Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/30 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/30 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
                Automate your entire <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
                  social media strategy
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                Join thousands of creators using FlowStack360 to grow their audience with AI. Start your journey today and never worry about content again.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link href="/auth">
                  <button className="relative group overflow-hidden text-white rounded-[2rem] px-12 py-5 text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(124,58,237,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-shift bg-[length:200%_200%]" />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center gap-3">
                      Get Started For Free
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MINIMAL PREMIUM FOOTER ===== */}
      <footer className="relative z-10 py-8 px-6 border-t border-gray-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-xl" style={{ direction: 'ltr' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              FlowStack360
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            &copy; 2026 FlowStack360. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ===== ANIMATION STYLES ===== */}
      <style dangerouslySetInnerHTML={{
        __html: `
        html { scroll-behavior: smooth; }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        @keyframes dataFlow {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 1500; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-float { animation: float 20s infinite ease-in-out; }
        .animate-gradient-shift { animation: gradient-shift 4s ease infinite; }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite ease-in-out; }
        .animate-fade-slide-up { animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-fade-slide-down { animation: fadeSlideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; opacity: 0; }
        .animate-dash { animation: dash 5s linear infinite; }
        .animate-data-flow { animation: dataFlow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-draw-line { animation: drawLine 2.5s ease-out forwards; animation-delay: 1s; }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        .mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
    </div>
  );
}

