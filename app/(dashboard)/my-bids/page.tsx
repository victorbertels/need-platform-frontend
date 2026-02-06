'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiExternalLink, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';

interface Bid {
  id: string;
  need_id: string;
  need_title: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
}

export default function MyBidsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/me/bids');
      setBids(response.data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to load your bids');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBid = async (bidId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this bid?')) return;

    try {
      await api.delete(`/bids/${bidId}`);
      toast.success('Bid withdrawn successfully');
      fetchMyBids();
    } catch (error) {
      console.error('Error deleting bid:', error);
      toast.error('Failed to withdraw bid');
    }
  };

  const filteredBids = bids.filter(bid => {
    if (filter === 'all') return true;
    return bid.status === filter;
  });

  const stats = {
    total: bids.length,
    pending: bids.filter(b => b.status === 'pending').length,
    accepted: bids.filter(b => b.status === 'accepted').length,
    rejected: bids.filter(b => b.status === 'rejected').length,
    totalValue: bids.reduce((sum, b) => sum + b.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bids</h1>
            <p className="text-gray-600">Track all your bids and their status</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="card text-center">
              <p className="text-gray-600 text-sm">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-600 text-sm">Accepted</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.accepted}</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-600 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-primary mt-1">€{stats.totalValue}</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {(['all', 'pending', 'accepted', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Bids List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading your bids...</p>
            </div>
          ) : filteredBids.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No bids found</p>
              <Link href="/browse" className="btn-primary">
                Browse Needs to Place Bids
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBids.map((bid) => (
                <div key={bid.id} className="card hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Bid Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 truncate">
                          {bid.need_title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          bid.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : bid.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {bid.description}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Bid placed {formatDate(bid.created_at)}
                      </p>
                    </div>

                    {/* Bid Amount */}
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary mb-2">
                        €{bid.amount}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/need/${bid.need_id}`}
                        className="btn-secondary px-4 py-2 flex items-center gap-2"
                      >
                        <FiExternalLink size={16} /> View
                      </Link>
                      {bid.status === 'pending' && (
                        <button
                          onClick={() => handleDeleteBid(bid.id)}
                          className="btn-secondary px-4 py-2 text-red-600 hover:bg-red-50"
                          title="Withdraw bid"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
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
