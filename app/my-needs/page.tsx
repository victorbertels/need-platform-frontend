'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiMessageSquare, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  starting_bid?: number;
  status: string;
  bids?: any[];
  created_at?: string;
  auction_end?: string;
}

const statusColors: Record<string, string> = {
  Active: 'bg-green-500/20 text-green-300 border-green-500/30',
  Completed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const statusIcons: Record<string, JSX.Element> = {
  Active: <FiClock className="w-4 h-4" />,
  Completed: <FiCheck className="w-4 h-4" />,
  Cancelled: <FiAlertCircle className="w-4 h-4" />,
};

export default function MyNeedsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'budget-high' | 'budget-low'>('newest');
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch needs
  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const response = await api.get('/users/me/needs');
        setNeeds(response.data || []);
      } catch (error: any) {
        toast.error('Failed to load your needs');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchNeeds();
    }
  }, [isAuthenticated]);

  // Filter and sort
  useEffect(() => {
    let filtered = needs;

    // Filter by status
    if (filter === 'active') {
      filtered = filtered.filter((n) => n.status === 'Active');
    } else if (filter === 'completed') {
      filtered = filtered.filter((n) => n.status === 'Completed');
    }

    // Sort
    if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
    } else if (sort === 'budget-high') {
      filtered.sort((a, b) => (b.starting_bid || 0) - (a.starting_bid || 0));
    } else if (sort === 'budget-low') {
      filtered.sort((a, b) => (a.starting_bid || 0) - (b.starting_bid || 0));
    }

    setFilteredNeeds(filtered);
  }, [needs, filter, sort]);

  const handleDelete = async (needId: string) => {
    if (!confirm('Are you sure you want to delete this need? This cannot be undone.')) {
      return;
    }

    try {
      setDeleting(needId);
      await api.delete(`/needs/${needId}`);
      setNeeds((prev) => prev.filter((n) => n.id !== needId));
      toast.success('Need deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete need');
    } finally {
      setDeleting(null);
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/30 backdrop-blur-2xl border-b border-slate-700/50">
        <div className="container-padding max-w-7xl mx-auto py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                My Needs
              </h1>
              <p className="text-slate-400 mt-2">Manage your posted tasks and view bids</p>
            </div>
            <Link
              href="/post-need"
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <FiPlus /> Post New Need
            </Link>
          </div>

          {/* Filters & Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filter === f
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="input-base px-4 py-2 h-10"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-padding max-w-7xl mx-auto py-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-purple-500 rounded-full"></div>
            </div>
          </div>
        ) : filteredNeeds.length > 0 ? (
          <div className="space-y-6">
            {filteredNeeds.map((need) => (
              <div key={need.id} className="card hover:border-purple-500/50 transition group">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-white truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition">
                          {need.title}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                          {need.category} • {need.location}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-lg border text-sm font-semibold whitespace-nowrap flex items-center gap-2 ${
                          statusColors[need.status] || statusColors.Active
                        }`}
                      >
                        {statusIcons[need.status]}
                        {need.status}
                      </span>
                    </div>

                    <p className="text-slate-300 line-clamp-2 mb-4">{need.description}</p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div>
                        <p className="text-slate-400">Budget</p>
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                          €{need.starting_bid || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Bids Received</p>
                        <p className="text-xl font-bold text-cyan-300">{need.bids?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Posted</p>
                        <p className="text-sm text-slate-300">
                          {need.created_at
                            ? new Date(need.created_at).toLocaleDateString()
                            : 'Recently'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 lg:flex-col justify-end">
                    <Link
                      href={`/need/${need.id}`}
                      className="btn-secondary px-4 py-2 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                    >
                      <FiMessageSquare className="w-4 h-4" /> View Bids
                    </Link>
                    {need.status === 'Active' && (
                      <>
                        <Link
                          href={`/need/${need.id}/edit`}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                        >
                          <FiEdit className="w-4 h-4" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(need.id)}
                          disabled={deleting === need.id}
                          className="bg-red-900/30 hover:bg-red-900/50 text-red-300 px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                        >
                          <FiTrash2 className="w-4 h-4" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-3xl font-bold text-white mb-3">No Needs Yet</h3>
            <p className="text-slate-400 mb-8 text-lg max-w-md mx-auto">
              {filter === 'all'
                ? "You haven't posted any needs yet. Create one to start receiving bids from professionals."
                : `No ${filter} needs found.`}
            </p>
            <Link href="/post-need" className="btn-primary inline-flex items-center gap-2">
              <FiPlus /> Post Your First Need
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
