'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import NeedCard from '@/components/NeedCard';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';

const categories = [
  'All', 'Cleaning', 'Assembly', 'Handyman', 'Moving', 'Gardening', 
  'Painting', 'IT Support', 'Photography', 'Writing'
];

const locations = ['All', 'Brussels', 'Antwerp', 'Ghent', 'Liège', 'Charleroi'];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'budget-low', label: 'Budget: Low to High' },
  { value: 'budget-high', label: 'Budget: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  starting_bid: number;
  auction_end: string;
  status: string;
  bids: any[];
}

export default function Browse() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch needs
  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const response = await api.get('/needs');
        const activeNeeds = response.data.filter((n: Need) => n.status === 'Active');
        setNeeds(activeNeeds);
        setFilteredNeeds(activeNeeds);
      } catch (error: any) {
        toast.error('Failed to load needs');
      } finally {
        setLoading(false);
      }
    };
    fetchNeeds();
  }, []);

  // Filter and sort
  useEffect(() => {
    let filtered = needs;

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(n => n.category.includes(selectedCategory));
    }

    // Location filter
    if (selectedLocation !== 'All') {
      filtered = filtered.filter(n => n.location.includes(selectedLocation));
    }

    // Sorting
    if (selectedSort === 'budget-low') {
      filtered.sort((a, b) => a.starting_bid - b.starting_bid);
    } else if (selectedSort === 'budget-high') {
      filtered.sort((a, b) => b.starting_bid - a.starting_bid);
    } else if (selectedSort === 'newest') {
      filtered.sort((a, b) => new Date(b.auction_end).getTime() - new Date(a.auction_end).getTime());
    }

    setFilteredNeeds(filtered);
  }, [needs, searchTerm, selectedCategory, selectedLocation, selectedSort]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-white via-white to-cream">
      {/* Header */}
      <div className="bg-white border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Browse Opportunities</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition"
            >
              <FiFilter /> Filters
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search needs by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6 sticky top-24">
              <div className="flex items-center justify-between lg:hidden mb-4">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FiX />
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-gray-700 group-hover:text-primary transition">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-3">Location</h3>
                <div className="space-y-2">
                  {locations.map((loc) => (
                    <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="location"
                        value={loc}
                        checked={selectedLocation === loc}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-gray-700 group-hover:text-primary transition">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-3">Sort By</h3>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedLocation('All');
                  setSelectedSort('newest');
                }}
                className="w-full py-2 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Needs Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full"></div>
                </div>
              </div>
            ) : filteredNeeds.length > 0 ? (
              <>
                <div className="mb-4 text-gray-600">
                  Showing <span className="font-bold text-gray-900">{filteredNeeds.length}</span> opportunities
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNeeds.map((need) => (
                    <div key={need.id} className="h-full">
                      <NeedCard need={need} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No opportunities found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedLocation('All');
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
