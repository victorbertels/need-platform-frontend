'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import NeedCard from '@/components/NeedCard';
import { formatDate } from '@/lib/utils';

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  status: string;
  created_at: string;
  bid_count?: number;
  image_url?: string;
}

export default function MyNeedsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchMyNeeds();
  }, []);

  const fetchMyNeeds = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/me/needs');
      setNeeds(response.data || []);
    } catch (error) {
      console.error('Error fetching needs:', error);
      toast.error('Failed to load your needs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (needId: string) => {
    if (!window.confirm('Are you sure you want to delete this need?')) return;

    try {
      await api.delete(`/needs/${needId}`);
      toast.success('Need deleted successfully');
      fetchMyNeeds();
    } catch (error) {
      console.error('Error deleting need:', error);
      toast.error('Failed to delete need');
    }
  };

  const filteredNeeds = needs.filter(need => {
    if (filter === 'all') return true;
    return need.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Posted Needs</h1>
              <p className="text-gray-600 mt-1">{filteredNeeds.length} needs</p>
            </div>
            <Link href="/post-need" className="btn-primary">
              + Post New Need
            </Link>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-8 flex-wrap">
            {/* Filter */}
            <div className="flex gap-2">
              {(['all', 'open', 'in_progress', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading your needs...</p>
            </div>
          ) : filteredNeeds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No needs found</p>
              <Link href="/post-need" className="btn-primary">
                Post Your First Need
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNeeds.map((need) => (
                <div key={need.id} className="relative">
                  <NeedCard need={need} />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Link
                      href={`/need/${need.id}`}
                      className="btn-secondary w-10 h-10 flex items-center justify-center rounded-full"
                      title="View need"
                    >
                      <FiEye size={16} />
                    </Link>
                    <Link
                      href={`/need/${need.id}/edit`}
                      className="btn-secondary w-10 h-10 flex items-center justify-center rounded-full"
                      title="Edit need"
                    >
                      <FiEdit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(need.id)}
                      className="btn-secondary w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-100"
                      title="Delete need"
                    >
                      <FiTrash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNeeds.map((need) => (
                <div key={need.id} className="card flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{need.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-600 mb-2">
                      <span>{need.category}</span>
                      <span>{need.location}</span>
                      <span>€{need.budget}</span>
                      <span className={`font-semibold ${
                        need.status === 'open'
                          ? 'text-green-600'
                          : need.status === 'in_progress'
                          ? 'text-blue-600'
                          : 'text-gray-600'
                      }`}>
                        {need.status === 'in_progress' ? 'In Progress' : need.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">
                      Posted {formatDate(need.created_at)} • {need.bid_count || 0} bids
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/need/${need.id}`}
                      className="btn-secondary px-3 py-2 flex items-center gap-2 text-sm"
                    >
                      <FiEye size={14} /> View
                    </Link>
                    <Link
                      href={`/need/${need.id}/edit`}
                      className="btn-secondary px-3 py-2 flex items-center gap-2 text-sm"
                    >
                      <FiEdit size={14} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(need.id)}
                      className="btn-secondary px-3 py-2 text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
