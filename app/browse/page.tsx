'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import NeedCard from '@/components/NeedCard';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiFilter, FiSearch, FiX, FiMap, FiGrid3X3 } from 'react-icons/fi';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

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
  budget?: number;
  starting_bid?: number;
  auction_end: string;
  status: string;
  bids?: any[];
  latitude?: number;
  longitude?: number;
  image_url?: string;
  rating?: number;
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
  const [isMapView, setIsMapView] = useState(false);

  // Fetch needs
  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const response = await api.get('/needs');
        const activeNeeds = response.data.filter((n: Need) => n.status === 'Active' || n.status === 'pending');
        
        // Add mock locations if not present
        const needsWithLocations = activeNeeds.map((need: Need) => ({
          ...need,
          latitude: need.latitude || 50.5 + Math.random() * 0.5,
          longitude: need.longitude || 4.47 + Math.random() * 0.5,
        }));
        
        setNeeds(needsWithLocations);
        setFilteredNeeds(needsWithLocations);
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
      filtered.sort((a, b) => (a.starting_bid || 0) - (b.starting_bid || 0));
    } else if (selectedSort === 'budget-high') {
      filtered.sort((a, b) => (b.starting_bid || 0) - (a.starting_bid || 0));
    } else if (selectedSort === 'newest') {
      filtered.sort((a, b) => new Date(b.auction_end).getTime() - new Date(a.auction_end).getTime());
    }

    setFilteredNeeds(filtered);
  }, [needs, searchTerm, selectedCategory, selectedLocation, selectedSort]);

  if (isMapView) {
    return (
      <>
        <MapView
          needs={filteredNeeds}
          isMapView={isMapView}
          onToggleView={() => setIsMapView(false)}
          selectedCategory={selectedCategory}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/30 backdrop-blur-2xl border-b border-slate-700/50">
        <div className="container-padding max-w-7xl mx-auto py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                Browse Opportunities
              </h1>
              <p className="text-slate-400 mt-2">Find tasks near you • Post your own • Get started</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMapView(true)}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition"
              >
                <FiMap size={20} /> Map View
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 hover:border-purple-500 transition"
              >
                <FiFilter /> Filters
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search needs by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base w-full pl-12 pr-4"
            />
          </div>
        </div>
      </div>

      <div className="container-padding max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card sticky top-32 space-y-6">
              <div className="flex items-center justify-between lg:hidden mb-4">
                <h3 className="font-bold text-white text-lg">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-slate-700/50 rounded-lg transition"
                >
                  <FiX />
                </button>
              </div>

              {/* Map Toggle Mobile */}
              <button
                onClick={() => setIsMapView(true)}
                className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition"
              >
                <FiMap size={18} /> Map View
              </button>

              {/* Category Filter */}
              <div>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  Category
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-slate-300 group-hover:text-purple-300 transition">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="border-t border-slate-700/50 pt-6">
                <h3 className="font-bold text-white mb-4">Location</h3>
                <div className="space-y-2">
                  {locations.map((loc) => (
                    <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="location"
                        value={loc}
                        checked={selectedLocation === loc}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-slate-300 group-hover:text-purple-300 transition">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="border-t border-slate-700/50 pt-6">
                <h3 className="font-bold text-white mb-4">Sort By</h3>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="input-base w-full"
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
                className="w-full py-3 border border-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-800/50 hover:border-purple-500 transition"
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
                  <div className="w-12 h-12 border-4 border-slate-700 border-t-purple-500 rounded-full"></div>
                </div>
              </div>
            ) : filteredNeeds.length > 0 ? (
              <>
                <div className="mb-6 text-slate-300 font-semibold">
                  Showing <span className="text-purple-300">{filteredNeeds.length}</span> {filteredNeeds.length === 1 ? 'opportunity' : 'opportunities'}
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
              <div className="card text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-3xl font-bold text-white mb-3">No opportunities found</h3>
                <p className="text-slate-400 mb-8 text-lg">Try adjusting your filters or search term</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedLocation('All');
                  }}
                  className="btn-primary"
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
