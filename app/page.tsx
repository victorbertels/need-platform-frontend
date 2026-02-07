'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiCheck, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSignup = () => {
    if (email) {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-20 pb-20">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-fadeIn">
              <div className="mb-8 inline-block">
                <span className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  🚀 The Future of Services
                </span>
              </div>

              <h1 className="hero-heading mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 text-transparent bg-clip-text">
                Whatever You Need,
                <br />
                We've Got It.
              </h1>

              <p className="hero-subheading mb-12 max-w-3xl mx-auto">
                Post a task. Get bids from top professionals. Choose the best. Done. 
                <br className="hidden md:block" />
                No middleman. Just real work. Fair prices.
              </p>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-12">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                  className="input-base flex-1"
                />
                <button
                  onClick={handleSignup}
                  className="btn-primary whitespace-nowrap flex items-center justify-center gap-2"
                >
                  Get Started <FiArrowRight size={20} />
                </button>
              </div>

              <p className="text-slate-400 text-sm mb-12">
                ✓ Free to sign up • No credit card required • Join 500+ professionals
              </p>

              {/* Post a Need CTA - Very Prominent */}
              <div className="mb-20">
                <p className="text-center text-slate-400 text-sm mb-4">Already signed in?</p>
                <Link href="/post-need" className="inline-flex w-full sm:w-auto justify-center">
                  <div className="px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-black text-xl hover:from-green-400 hover:to-emerald-400 hover:shadow-2xl hover:shadow-green-500/50 transition-all shadow-xl">
                    ➕ POST A NEED NOW
                  </div>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="mt-20 max-w-4xl mx-auto">
              <div className="card-gradient hover:border-pink-500/50">
                <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                  <div className="text-center">
                    <div className="text-7xl mb-4 animate-pulse">✨</div>
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                      Get Premium Services
                    </p>
                    <p className="text-slate-400 mt-2">Fair Prices • Fast Results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  Why Choose Need?
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FiZap className="w-8 h-8" />,
                  title: 'Lightning Fast',
                  description: 'Post a task and get bids within minutes. Real people solving real problems.',
                },
                {
                  icon: <FiTrendingUp className="w-8 h-8" />,
                  title: 'Best Value',
                  description: 'Competitive pricing. No hidden fees. You pay only what you agree on.',
                },
                {
                  icon: <FiShield className="w-8 h-8" />,
                  title: 'Secure & Safe',
                  description: 'Verified professionals. Secure payments. Dispute resolution you can trust.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="card hover:border-purple-500/50 hover:-translate-y-2 group cursor-default">
                  <div className="mb-6 inline-block p-4 bg-gradient-to-br from-purple-600/30 to-pink-600/20 rounded-2xl group-hover:from-purple-600/50 group-hover:to-pink-600/40 transition">
                    <div className="text-gradient">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 relative">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  Simple as 1, 2, 3
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { num: '01', title: 'Post a Need', desc: 'Describe what you need. Set your budget. It only takes 2 minutes.' },
                { num: '02', title: 'Get Bids', desc: 'Pros bid on your task. Read reviews. Choose the best match.' },
                { num: '03', title: 'Get It Done', desc: 'Discuss details. Secure payment. Watch the magic happen.' },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="card">
                    <div className="text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent opacity-20">
                      {step.num}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-slate-400">{step.desc}</p>
                  </div>
                  {idx < 2 && <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-y-1/2"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative">
          <div className="container-padding max-w-4xl mx-auto">
            <div className="card-gradient text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300">
                  Ready to Get Started?
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals and customers getting amazing work done. Sign up today—it's free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="btn-primary">
                  Sign Up Now <FiArrowRight size={20} />
                </Link>
                <Link href="/browse" className="btn-secondary">
                  Browse Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
