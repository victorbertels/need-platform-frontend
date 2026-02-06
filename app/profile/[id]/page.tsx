'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiStar, FiMapPin, FiMail, FiEdit } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  location: string;
  bio: string;
  profile_pic?: string;
  specialities: string[];
  languages: string[];
  education: string[];
  work_experience: string[];
}

interface UserRating {
  average_rating: number;
  total_ratings: number;
}

interface CompletedNeed {
  id: string;
  title: string;
  budget: number;
  created_at: string;
}

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ratings, setRatings] = useState<UserRating | null>(null);
  const [completedNeeds, setCompletedNeeds] = useState<CompletedNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
  }, [params.id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileResponse = await api.get(`/users/${params.id}`);
      setProfile(profileResponse.data);
      
      // Fetch ratings
      const ratingsResponse = await api.get(`/ratings/user/${params.id}`);
      setRatings(ratingsResponse.data);
      
      // Fetch completed needs (if you have this endpoint)
      try {
        const needsResponse = await api.get(`/users/${params.id}/completed-needs`);
        setCompletedNeeds(needsResponse.data || []);
      } catch (error) {
        // Endpoint might not exist yet
        console.log('Completed needs endpoint not available');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-padding">
          <div className="max-w-3xl mx-auto card h-96 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-padding">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Profile not found</p>
            <Link href="/browse" className="btn-primary">
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="card mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                <div className="w-32 h-32 bg-gray-300 rounded-lg flex-shrink-0">
                  {profile.profile_pic && (
                    <Image
                      src={profile.profile_pic}
                      alt={profile.full_name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 pt-2">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.full_name}</h1>
                  <p className="text-gray-600 mb-4">@{profile.username}</p>

                  {/* Ratings */}
                  {ratings && ratings.average_rating !== null && ratings.average_rating !== undefined && (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`${
                                i < Math.round(ratings.average_rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          {ratings.average_rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        ({ratings.total_ratings} {ratings.total_ratings === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}

                  {/* Bio & Location */}
                  <p className="text-gray-600 mb-2">{profile.bio}</p>
                  {profile.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMapPin size={16} />
                      {profile.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {isOwnProfile ? (
                  <Link href="/profile/edit" className="btn-primary flex items-center gap-2">
                    <FiEdit /> Edit Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      href={`/messages?user=${profile.id}`}
                      className="btn-primary flex items-center gap-2"
                    >
                      <FiMail /> Message
                    </Link>
                    <button className="btn-secondary">Hire</button>
                  </>
                )}
              </div>
            </div>

            {/* Contact Info */}
            {isOwnProfile && (
              <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{profile.email}</p>
                  </div>
                  {profile.location && (
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{profile.location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto">
            {['overview', 'skills', 'reviews', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold capitalize transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {profile.bio && (
                  <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                    <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {profile.languages.length > 0 && (
                  <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Languages</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Specialities</h2>
                {profile.specialities.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {profile.specialities.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No specialities listed yet</p>
                )}

                {profile.education.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Education</h3>
                    <div className="space-y-3">
                      {profile.education.map((edu, idx) => (
                        <p key={idx} className="text-gray-600">{edu}</p>
                      ))}
                    </div>
                  </>
                )}

                {profile.work_experience.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Work Experience</h3>
                    <div className="space-y-3">
                      {profile.work_experience.map((exp, idx) => (
                        <p key={idx} className="text-gray-600">{exp}</p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
                {ratings && ratings.total_ratings > 0 ? (
                  <div className="space-y-4">
                    {/* Placeholder for reviews - fetch from API */}
                    <p className="text-gray-600">
                      {ratings.total_ratings} review{ratings.total_ratings !== 1 ? 's' : ''}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet</p>
                )}
              </div>
            )}

            {/* Completed Work Tab */}
            {activeTab === 'completed' && (
              <div className="space-y-4">
                {completedNeeds.length > 0 ? (
                  completedNeeds.map((need) => (
                    <Link key={need.id} href={`/need/${need.id}`}>
                      <div className="card hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{need.title}</h3>
                            <p className="text-sm text-gray-600">
                              Completed {formatDate(need.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">€{need.budget}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-600">No completed work yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
