'use client';

import { useState } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string, location: string) => void;
}

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
];

export default function SearchBar({ value = '', onChange, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(value);
  const [location, setLocation] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query, location);
    } else {
      router.push(`/browse?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
    }
  };

  const handleCategorySelect = (category: string) => {
    setQuery(category);
    setShowCategories(false);
    if (onChange) onChange(category);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 bg-white rounded-2xl shadow-lg p-2">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-3 px-4">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="What do you need done?"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (onChange) onChange(e.target.value);
              }}
              onFocus={() => setShowCategories(true)}
              className="w-full py-3 outline-none text-gray-900 placeholder-gray-500 bg-transparent"
            />
          </div>

          {/* Categories Dropdown */}
          {showCategories && query === '' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              <div className="p-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location Input */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 border-l border-gray-200 hidden sm:flex">
          <FiMapPin className="text-gray-400" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="py-3 outline-none text-gray-900 placeholder-gray-500 bg-transparent w-32 lg:w-auto"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="btn-primary flex-shrink-0 rounded-xl font-semibold md:px-8"
        >
          Search
        </button>
      </form>

      {/* Close categories on outside click */}
      {showCategories && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowCategories(false)}
        />
      )}
    </div>
  );
}
