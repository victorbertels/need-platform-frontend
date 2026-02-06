'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome } from 'react-icons/fi';
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
    { label: 'About', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container-padding">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FiHome className="text-primary" />
            <span className="text-primary">Need</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <FiUser />
                  {user.full_name || user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary transition-colors font-semibold">
                  Login
                </Link>
                <Link href="/register" className="btn-primary px-6 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4 border-t border-gray-200 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <Link
                    href={`/profile/${user.id}`}
                    className="block text-gray-600 hover:text-primary transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-red-600 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-gray-600 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block btn-primary text-center py-2"
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
