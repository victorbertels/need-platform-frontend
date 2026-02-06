'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiStar, FiDollarSign } from 'react-icons/fi';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  budget?: number;
  location?: string;
  creator?: {
    id: string;
    full_name: string;
    profile_pic?: string;
  };
  rating?: number;
  bid_count?: number;
  created_at?: string;
  status?: string;
  image_url?: string;
}

interface NeedCardProps {
  need: Need;
  variant?: 'grid' | 'list';
}

export default function NeedCard({ need, variant = 'grid' }: NeedCardProps) {
  if (variant === 'list') {
    return (
      <Link href={`/need/${need.id}`}>
        <div className="card flex gap-4 hover:shadow-lg">
          {/* Image */}
          <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
            {need.image_url ? (
              <Image
                src={need.image_url}
                alt={need.title}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary opacity-20 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
              {need.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {need.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {need.location && (
                  <div className="flex items-center gap-1">
                    <FiMapPin size={16} />
                    {need.location}
                  </div>
                )}
                {need.rating && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <FiStar size={16} fill="currentColor" />
                    {need.rating.toFixed(1)}
                  </div>
                )}
              </div>

              {need.budget && (
                <div className="text-primary font-semibold">
                  {formatCurrency(need.budget)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link href={`/need/${need.id}`}>
      <div className="card flex flex-col h-full hover:shadow-lg">
        {/* Image */}
        <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
          {need.image_url ? (
            <Image
              src={need.image_url}
              alt={need.title}
              fill
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary opacity-20 flex items-center justify-center">
              <span className="text-gray-400">{need.category}</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
              {need.category}
            </span>
          </div>

          {/* Status Badge */}
          {need.status && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {need.status === 'open' ? 'Open' : 'In Progress'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
            {need.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {need.description}
          </p>

          {/* Creator */}
          {need.creator && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-t border-gray-200">
              <div className="w-8 h-8 bg-gray-300 rounded-full">
                {need.creator.profile_pic && (
                  <Image
                    src={need.creator.profile_pic}
                    alt={need.creator.full_name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>
              <span className="text-sm text-gray-600">{need.creator.full_name}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {need.location && (
                <div className="flex items-center gap-1">
                  <FiMapPin size={14} />
                  <span className="truncate">{need.location}</span>
                </div>
              )}
              {need.rating && (
                <div className="flex items-center gap-1 text-yellow-600">
                  <FiStar size={14} fill="currentColor" />
                  {need.rating.toFixed(1)}
                </div>
              )}
            </div>

            {need.budget && (
              <div className="text-primary font-semibold text-lg">
                €{need.budget}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
