'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiZap } from 'react-icons/fi';
import { useAuthStore } from '@/lib/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navLinks = [
    { label: 'Browse', href: '/browse' },
    { label: 'How it Works', href: '#features' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/30 backdrop-blur-2xl border-b border-slate-700/50">
      <div className="container-padding">
        <div className="flex justify-between items-center h-20">
          {/* Logo - LARGE AND BOLD */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
              <FiZap className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
              NEED
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white font-medium transition-colors duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-300 hover:to-pink-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 font-medium"
                >
                  <FiUser size={18} />
                  <span className="hidden lg:inline">{user.full_name || user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors duration-300 font-medium"
                >
                  <FiLogOut size={18} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-slate-300 hover:text-white transition-colors duration-300 font-semibold"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary px-6 py-2.5 text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FiX className="text-2xl text-white" />
            ) : (
              <FiMenu className="text-2xl text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-4 border-t border-slate-700/50 pt-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-slate-300 hover:text-white transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-6 border-t border-slate-700/50 space-y-3">
              {user ? (
                <>
                  <Link
                    href={`/profile/${user.id}`}
                    className="block text-slate-300 hover:text-white transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-pink-400 hover:text-pink-300 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-slate-300 hover:text-white transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block btn-primary text-center py-2.5 font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
