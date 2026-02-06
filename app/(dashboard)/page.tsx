'use client';




import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import NeedCard from '@/components/NeedCard';
import { FiPlus, FiMessageSquare, FiAward, FiDollarSign } from 'react-icons/fi';

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  budget?: number;
  location?: string;
  rating?: number;
  status?: string;
  image_url?: string;
}

interface Bid {
  id: string;
  need_id: string;
  amount: number;
  status: string;
}

interface Stats {
  posted_needs: number;
  active_bids: number;
  messages_unread: number;
  total_earnings: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    posted_needs: 0,
    active_bids: 0,
    messages_unread: 0,
    total_earnings: 0
  });
  const [myNeeds, setMyNeeds] = useState<Need[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's posted needs
      const needsResponse = await api.get('/users/me/needs');
      setMyNeeds(needsResponse.data || []);
      
      // Fetch user's bids
      const bidsResponse = await api.get('/users/me/bids');
      setMyBids(bidsResponse.data || []);
      
      // Calculate stats
      const stats: Stats = {
        posted_needs: needsResponse.data?.length || 0,
        active_bids: bidsResponse.data?.filter((b: any) => b.status === 'pending')?.length || 0,
        messages_unread: 0, // TODO: Fetch from notifications
        total_earnings: 0 // TODO: Calculate from completed bids
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-padding py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.full_name}</p>
              </div>
              <Link href="/post-need" className="btn-primary flex items-center gap-2">
                <FiPlus /> Post a Need
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Posted Needs</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stats.posted_needs}
                    </p>
                  </div>
                  <FiAward className="text-blue-600 text-4xl opacity-20" />
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Bids</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stats.active_bids}
                    </p>
                  </div>
                  <FiDollarSign className="text-green-600 text-4xl opacity-20" />
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Unread Messages</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stats.messages_unread}
                    </p>
                  </div>
                  <FiMessageSquare className="text-purple-600 text-4xl opacity-20" />
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Earnings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      €{stats.total_earnings}
                    </p>
                  </div>
                  <FiDollarSign className="text-yellow-600 text-4xl opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container-padding py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Posted Needs Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Posted Needs</h2>
              <Link href="/my-needs" className="text-primary font-semibold hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card h-80 animate-pulse"></div>
                ))}
              </div>
            ) : myNeeds.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">You haven't posted any needs yet</p>
                <Link href="/post-need" className="btn-primary">
                  Post Your First Need
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myNeeds.slice(0, 3).map((need) => (
                  <NeedCard key={need.id} need={need} />
                ))}
              </div>
            )}
          </div>

          {/* My Bids Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Bids</h2>
              <Link href="/my-bids" className="text-primary font-semibold hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card h-24 animate-pulse"></div>
                ))}
              </div>
            ) : myBids.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">You haven't placed any bids yet</p>
                <Link href="/browse" className="btn-primary">
                  Browse Needs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myBids.slice(0, 5).map((bid) => (
                  <div key={bid.id} className="card flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">Bid on Need #{bid.need_id}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Amount: €{bid.amount}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      bid.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : bid.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {bid.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/post-need">
              <div className="card text-center hover:shadow-lg transition-all cursor-pointer">
                <FiPlus className="text-4xl text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900">Post a Need</h3>
                <p className="text-sm text-gray-600 mt-2">Create a new task for others to bid on</p>
              </div>
            </Link>

            <Link href="/browse">
              <div className="card text-center hover:shadow-lg transition-all cursor-pointer">
                <FiAward className="text-4xl text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900">Browse Needs</h3>
                <p className="text-sm text-gray-600 mt-2">Find tasks you can help with</p>
              </div>
            </Link>

            <Link href="/messages">
              <div className="card text-center hover:shadow-lg transition-all cursor-pointer">
                <FiMessageSquare className="text-4xl text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600 mt-2">Chat with other users</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
