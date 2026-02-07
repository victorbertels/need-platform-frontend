'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCheck, FiAlertCircle } from 'react-icons/fi';

const categories = [
  'Cleaning',
  'Assembly',
  'Handyman',
  'Moving',
  'Gardening',
  'Painting',
  'IT Support',
  'Photography',
  'Writing',
  'Tutoring',
  'Pet Care',
  'Delivery',
  'Other',
];

const locations = [
  'Brussels',
  'Antwerp',
  'Ghent',
  'Liège',
  'Charleroi',
  'Namur',
  'Mons',
  'Tournai',
  'Online',
];

const MINIMUM_BUDGET = 20;

export default function PostNeedPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0],
    budget: '',
    location: locations[0],
    deadline: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (formData.title.length < 5) {
      toast.error('Title must be at least 5 characters');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please describe what you need');
      return;
    }

    if (formData.description.length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }

    const budget = parseFloat(formData.budget);
    if (!formData.budget || isNaN(budget) || budget < MINIMUM_BUDGET) {
      toast.error(`Budget must be at least €${MINIMUM_BUDGET}`);
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/needs', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        starting_bid: budget,
        location: formData.location,
        auction_end: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      });

      toast.success('Need posted successfully! 🎉');
      router.push('/my-needs');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to post need');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/30 backdrop-blur-2xl border-b border-slate-700/50">
        <div className="container-padding max-w-4xl mx-auto py-6">
          <Link
            href="/my-needs"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-300 transition mb-4"
          >
            <FiArrowLeft /> Back
          </Link>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            Post a Need
          </h1>
          <p className="text-slate-400 mt-2">Describe what you need done and get bids from professionals</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-padding max-w-4xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Task Title <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Clean my apartment, Fix broken door, etc."
                  className="input-base w-full"
                  maxLength={100}
                />
                <p className="text-xs text-slate-400 mt-2">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Description <span className="text-pink-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide details about what needs to be done, any specific requirements, timeline, etc."
                  className="input-base w-full min-h-32 resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-slate-400 mt-2">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Category <span className="text-pink-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-base w-full"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Location <span className="text-pink-400">*</span>
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-base w-full"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget & Deadline */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Budget <span className="text-pink-400">*</span>
                    <span className="text-xs text-slate-400 font-normal ml-2">
                      (minimum €{MINIMUM_BUDGET})
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                      €
                    </span>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder={String(MINIMUM_BUDGET)}
                      min={MINIMUM_BUDGET}
                      step="0.01"
                      className="input-base w-full pl-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Deadline <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="input-base w-full"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin">⏳</div>
                    Posting...
                  </>
                ) : (
                  <>
                    <FiCheck /> Post Need
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="card sticky top-32 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <FiAlertCircle className="text-cyan-400" />
                  Tips
                </h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div>
                    <p className="font-semibold text-white mb-1">✓ Be Specific</p>
                    <p>
                      The more details you provide, the better bids you'll receive from professionals.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">💰 Fair Budget</p>
                    <p>
                      Set a realistic budget. Higher budgets attract more qualified professionals.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">⏰ Set Deadlines</p>
                    <p>
                      Add a deadline to create urgency and help professionals plan their schedules.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">⭐ Quality Matters</p>
                    <p>
                      Choose professionals with good ratings and reviews, not just the cheapest bid.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-6">
                <p className="text-xs text-slate-400 leading-relaxed">
                  By posting, you agree to our Terms of Service. Platform fee: 5% of final contract value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
