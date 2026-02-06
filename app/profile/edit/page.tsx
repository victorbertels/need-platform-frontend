'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiX } from 'react-icons/fi';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    location: '',
    bio: '',
    specialities: [] as string[],
    languages: [] as string[],
    education: [] as string[],
    work_experience: [] as string[],
  });
  const [newSpeciality, setNewSpeciality] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [newExperience, setNewExperience] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${user?.id}`);
      setFormData({
        full_name: response.data.full_name || '',
        email: response.data.email || '',
        location: response.data.location || '',
        bio: response.data.bio || '',
        specialities: response.data.specialities || [],
        languages: response.data.languages || [],
        education: response.data.education || [],
        work_experience: response.data.work_experience || [],
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSpeciality = () => {
    if (newSpeciality.trim()) {
      setFormData(prev => ({
        ...prev,
        specialities: [...prev.specialities, newSpeciality]
      }));
      setNewSpeciality('');
    }
  };

  const removeSpeciality = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialities: prev.specialities.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
      setNewEducation('');
    }
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    if (newExperience.trim()) {
      setFormData(prev => ({
        ...prev,
        work_experience: [...prev.work_experience, newExperience]
      }));
      setNewExperience('');
    }
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('User ID not found');
      return;
    }

    try {
      setSaving(true);
      await api.put(`/users/${user.id}`, formData);
      toast.success('Profile updated successfully!');
      setUser({ ...user, ...formData });
      router.push(`/profile/${user.id}`);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.detail || 'Failed to update profile');
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="input-base"
                  />
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Languages</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add a language..."
                  className="input-base"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="btn-primary px-4 whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(idx)}
                      className="text-blue-900 hover:text-blue-700"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialities */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specialities</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSpeciality}
                  onChange={(e) => setNewSpeciality(e.target.value)}
                  placeholder="Add a skill..."
                  className="input-base"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpeciality())}
                />
                <button
                  type="button"
                  onClick={addSpeciality}
                  className="btn-primary px-4 whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialities.map((spec, idx) => (
                  <div
                    key={idx}
                    className="bg-green-100 text-green-900 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpeciality(idx)}
                      className="text-green-900 hover:text-green-700"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  placeholder="Add education..."
                  className="input-base"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())}
                />
                <button
                  type="button"
                  onClick={addEducation}
                  className="btn-primary px-4 whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                    <span className="text-gray-900 text-sm">{edu}</span>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newExperience}
                  onChange={(e) => setNewExperience(e.target.value)}
                  placeholder="Add work experience..."
                  className="input-base"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExperience())}
                />
                <button
                  type="button"
                  onClick={addExperience}
                  className="btn-primary px-4 whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.work_experience.map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                    <span className="text-gray-900 text-sm">{exp}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
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
