"use client"
import React from 'react';
import { useHits } from 'react-instantsearch-hooks-web';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResultsProps {
  className?: string;
}

export function SearchResults({ className = "" }: SearchResultsProps) {
  const { hits } = useHits();
  
  // Filter out dummy products (those with example.com images or empty data)
  const filteredHits = hits.filter((hit: any) => {
    return hit.id && 
           hit.name && 
           hit.price && 
           (!hit.image || !hit.image.includes('example.com'));
  });

  if (filteredHits.length === 0) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        No results found
      </div>
    );
  }

  return (
    <div className={`divide-y divide-gray-200 ${className}`}>
      {filteredHits.map((hit: any) => (
        <Link 
          href={`/product/${hit.id}`} 
          key={hit.id}
          className="flex items-center p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 mr-3 relative flex-shrink-0 bg-gray-100 rounded">
            {hit.image ? (
              <Image 
                src={hit.image} 
                alt={hit.name} 
                fill
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{hit.name}</h3>
            <p className="text-sm text-gray-500 truncate">{hit.description}</p>
          </div>
          <div className="text-[#8B5CF6] font-medium">
            ${hit.price?.toFixed(2)}
          </div>
        </Link>
      ))}
    </div>
  );
}