'use client';

export const dynamic = 'force-dynamic';





import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiMapPin, FiStar, FiMessageCircle, FiCheck, FiX } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  creator: {
    id: string;
    full_name: string;
    profile_pic?: string;
  };
  rating?: number;
  status: string;
  created_at: string;
  image_url?: string;
}

interface Bid {
  id: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    profile_pic?: string;
  };
}

export default function NeedDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [need, setNeed] = useState<Need | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDescription, setBidDescription] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    fetchNeed();
  }, [params.id]);

  const fetchNeed = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/needs/${params.id}`);
      setNeed(response.data);
      
      // Fetch bids for this need
      const bidsResponse = await api.get(`/needs/${params.id}/bids`);
      setBids(bidsResponse.data || []);
    } catch (error) {
      console.error('Error fetching need:', error);
      toast.error('Failed to load need details');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bidAmount || !bidDescription) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!user) {
      toast.error('Please login to submit a bid');
      return;
    }

    try {
      setSubmittingBid(true);
      await api.post(`/needs/${params.id}/bids`, {
        amount: parseFloat(bidAmount),
        description: bidDescription
      });
      
      toast.success('Bid submitted successfully!');
      setBidAmount('');
      setBidDescription('');
      fetchNeed();
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Failed to submit bid');
    } finally {
      setSubmittingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-padding">
          <div className="max-w-4xl mx-auto">
            <div className="card h-96 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!need) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-padding">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Need not found</p>
            <Link href="/browse" className="btn-primary">
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card">
              {/* Image */}
              {need.image_url && (
                <div className="relative w-full h-96 mb-6 -m-6 mb-6">
                  <Image
                    src={need.image_url}
                    alt={need.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Title & Status */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{need.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="bg-primary-light text-primary px-3 py-1 rounded-full">
                      {need.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-white ${
                      need.status === 'open' ? 'bg-green-500' : 'bg-orange-500'
                    }`}>
                      {need.status === 'open' ? 'Open' : 'In Progress'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary mb-2">
                    €{need.budget}
                  </div>
                  <p className="text-gray-600 text-sm">Budget</p>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-4 py-4 border-t border-b border-gray-200">
                <div className="w-12 h-12 bg-gray-300 rounded-full">
                  {need.creator.profile_pic && (
                    <Image
                      src={need.creator.profile_pic}
                      alt={need.creator.full_name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{need.creator.full_name}</h3>
                  <p className="text-sm text-gray-600">
                    Posted {formatDate(need.created_at)}
                  </p>
                </div>
                {user?.id !== need.creator.id && (
                  <Link
                    href={`/messages?user=${need.creator.id}&need=${need.id}`}
                    className="btn-secondary px-4 py-2 flex items-center gap-2"
                  >
                    <FiMessageCircle /> Message
                  </Link>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{need.description}</p>
            </div>

            {/* Details */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <FiMapPin /> {need.location}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="text-gray-900 font-semibold">{need.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Posted</p>
                  <p className="text-gray-900 font-semibold">{formatDate(need.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Budget</p>
                  <p className="text-primary font-bold text-lg">€{need.budget}</p>
                </div>
              </div>
            </div>

            {/* Bids */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Bids ({bids.length})
              </h2>
              
              {bids.length === 0 ? (
                <p className="text-gray-600">No bids yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div key={bid.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{bid.user.full_name}</h4>
                            <p className="text-sm text-gray-600">{formatDate(bid.created_at)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">€{bid.amount}</div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            bid.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : bid.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {bid.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{bid.description}</p>
                      {user?.id === need.creator.id && bid.status === 'pending' && (
                        <div className="flex gap-2">
                          <button className="btn-primary py-2 px-4 flex items-center gap-2 text-sm">
                            <FiCheck /> Accept
                          </button>
                          <button className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm">
                            <FiX /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bid Form */}
            {user && user.id !== need.creator.id && (
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Submit a Bid</h3>
                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Your Bid Amount (€)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`e.g., ${need.budget}`}
                      className="input-base"
                      disabled={submittingBid}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      value={bidDescription}
                      onChange={(e) => setBidDescription(e.target.value)}
                      placeholder="Tell the poster why you're the best fit for this job..."
                      rows={4}
                      className="input-base"
                      disabled={submittingBid}
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submittingBid}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {submittingBid ? 'Submitting...' : 'Submit Bid'}
                  </button>
                </form>
              </div>
            )}

            {/* Need Info Card */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">About This Need</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Status</p>
                  <p className="text-gray-900 font-semibold capitalize">{need.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Category</p>
                  <p className="text-gray-900 font-semibold">{need.category}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Location</p>
                  <p className="text-gray-900 font-semibold">{need.location}</p>
                </div>
              </div>
            </div>

            {/* Creator Profile Card */}
            <Link href={`/profile/${need.creator.id}`}>
              <div className="card cursor-pointer hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  <h4 className="font-semibold text-gray-900">{need.creator.full_name}</h4>
                  {need.rating && (
                    <div className="flex items-center justify-center gap-1 mt-2 text-yellow-600">
                      <FiStar fill="currentColor" />
                      {need.rating.toFixed(1)}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-3">View full profile</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
