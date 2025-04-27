"use client"
import React, { useState, useEffect } from 'react';
import { InstantSearch } from 'react-instantsearch-hooks-web';
import { searchClient } from '@/lib/meilisearch';

interface SearchProviderProps {
  indexName: string;
  children: React.ReactNode;
}

export function SearchProvider({ indexName, children }: SearchProviderProps) {
  const [isSearchReady, setIsSearchReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the search client is properly initialized
    if (!searchClient) {
      setError('Search client not initialized');
      return;
    }

    // Set search as ready
    setIsSearchReady(true);
  }, []);

  if (error) {
    return <div className="text-sm text-red-500">Search unavailable: {error}</div>;
  }

  if (!isSearchReady) {
    return <div className="text-sm text-gray-500">Loading search...</div>;
  }

  return (
    <InstantSearch 
      searchClient={searchClient} 
      indexName={indexName}
      suppressExperimentalWarnings={true}
    >
      {children}
    </InstantSearch>
  );
}