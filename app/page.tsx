'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiCheck, FiLock, FiStar, FiUsers } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSignup = () => {
    if (email) {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">
            Need
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 text-amber-900 font-medium hover:bg-amber-50 rounded-lg transition"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-700 to-yellow-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-amber-400/30 transition transform hover:scale-105"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
              Get Tasks Done.
              <span className="block bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">
                Pay What It's Worth.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with skilled professionals who deliver excellence. Fair prices. Real results. No middleman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-3 rounded-lg border-2 border-amber-200 focus:border-amber-700 focus:outline-none transition text-gray-900 flex-1"
              />
              <button
                onClick={handleSignup}
                className="px-8 py-3 bg-gradient-to-r from-amber-700 to-yellow-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-400/40 transition transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                Get Started <FiArrowRight size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500">✓ Free to sign up • No credit card required</p>
          </div>
          
          {/* Hero Image Placeholder */}
          <div className="bg-gradient-to-br from-amber-100 to-yellow-50 rounded-2xl h-96 flex items-center justify-center border-2 border-amber-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-amber-900 font-semibold">Premium Services</p>
              <p className="text-amber-700 text-sm">Fair Pricing</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-24 py-12 border-y border-amber-100">
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-700 mb-2">28+</div>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-700 mb-2">12+</div>
            <p className="text-gray-600">Needs Posted</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-700 mb-2">100%</div>
            <p className="text-gray-600">Secure Payments</p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: FiUsers, title: 'Post a Need', desc: 'Describe what you need done' },
              { icon: FiStar, title: 'Get Bids', desc: 'Receive offers from pros' },
              { icon: FiCheck, title: 'Choose Winner', desc: 'Pick the best match' },
              { icon: FiLock, title: 'Secure Payment', desc: 'Pay when work is done' }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-xl border-2 border-amber-100 hover:border-amber-300 hover:shadow-lg transition">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-24 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-12 border-2 border-amber-200">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Trusted by Professionals</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah K.', role: 'Home Owner', quote: 'Found amazing painters in minutes. Work was flawless.' },
              { name: 'Marco D.', role: 'Freelancer', quote: 'Most reliable platform. Fair bidding process. Repeat clients.' },
              { name: 'Lisa M.', role: 'Business Owner', quote: 'Saved us thousands. Quality professionals, transparent pricing.' }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border-2 border-amber-100">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} size={18} className="fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of satisfied users. No credit card required.</p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-gradient-to-r from-amber-700 to-yellow-600 text-white font-bold text-lg rounded-lg hover:shadow-xl hover:shadow-amber-400/40 transition transform hover:scale-105"
          >
            Sign Up for Free <FiArrowRight className="inline ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 Need Platform. Connecting people who need help with people who can help.</p>
        </div>
      </footer>
    </div>
  );
}
