import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-padding py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Need</h3>
              <p className="text-sm text-gray-400">
                Find local services and connect with skilled professionals in Belgium.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/browse" className="hover:text-primary transition-colors">Browse Needs</Link></li>
                <li><Link href="/post-need" className="hover:text-primary transition-colors">Post a Need</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © {currentYear} Need Platform. All rights reserved.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <FiFacebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <FiInstagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <FiTwitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <FiLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
