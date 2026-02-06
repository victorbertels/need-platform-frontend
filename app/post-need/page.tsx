'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

const categories = [
  'House Cleaning',
  'Furniture Assembly',
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
];

export default function PostNeedPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
    deadline: '',
  });

  if (!isAuthenticated()) {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.budget || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.budget) <= 0) {
      toast.error('Budget must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/needs', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: parseFloat(formData.budget),
        location: formData.location,
        deadline: formData.deadline || null,
      });

      toast.success('Need posted successfully!');
      router.push(`/need/${response.data.id}`);
    } catch (error: any) {
      console.error('Error posting need:', error);
      toast.error(error.response?.data?.detail || 'Failed to post need');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-padding">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="btn-secondary p-2 rounded-full"
            >
              <FiArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Post a Need</h1>
              <p className="text-gray-600 mt-1">Describe what you need help with</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="card">
              <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                Need Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Repaint my bedroom"
                className="input-base"
                required
              />
              <p className="text-gray-500 text-sm mt-1">Be specific about what you need</p>
            </div>

            {/* Description */}
            <div className="card">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about what needs to be done..."
                rows={6}
                className="input-base"
                required
              />
              <p className="text-gray-500 text-sm mt-1">Include any specific requirements or preferences</p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="card">
                <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-base"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="card">
                <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
                  Location *
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-base"
                  required
                >
                  <option value="">Select a location</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div className="card">
                <label htmlFor="budget" className="block text-sm font-medium text-gray-900 mb-2">
                  Budget (€) *
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="input-base"
                  required
                />
                <p className="text-gray-500 text-sm mt-1">Estimated budget for this task</p>
              </div>

              {/* Deadline */}
              <div className="card">
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-900 mb-2">
                  Deadline (Optional)
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="input-base"
                />
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Tips for posting</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ Be clear and specific about what you need</li>
                <li>✓ Provide realistic budget expectations</li>
                <li>✓ Include any deadlines or time constraints</li>
                <li>✓ Mention if you have any specific requirements</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1 py-3"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 py-3"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Need'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
