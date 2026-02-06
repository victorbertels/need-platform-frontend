'use client';




import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditNeedPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const needId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
    deadline: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchNeed();
  }, []);

  const fetchNeed = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/needs/${needId}`);
      const need = response.data;
      
      // Check if user is the creator
      if (need.creator_id !== user?.id) {
        toast.error('You can only edit your own needs');
        router.push(`/need/${needId}`);
        return;
      }
      
      setFormData({
        title: need.title || '',
        description: need.description || '',
        category: need.category || '',
        budget: need.budget?.toString() || '',
        location: need.location || '',
        deadline: need.deadline || '',
      });
    } catch (error) {
      console.error('Error fetching need:', error);
      toast.error('Failed to load need');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      await api.put(`/needs/${needId}`, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: parseFloat(formData.budget),
        location: formData.location,
        deadline: formData.deadline || null,
      });

      toast.success('Need updated successfully!');
      router.push(`/need/${needId}`);
    } catch (error: any) {
      console.error('Error updating need:', error);
      toast.error(error.response?.data?.detail || 'Failed to update need');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-padding">
          <div className="max-w-2xl mx-auto card h-96 animate-pulse"></div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-900">Edit Need</h1>
              <p className="text-gray-600 mt-1">Update your need information</p>
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

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1 py-3"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 py-3"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
