"use client"
import React from 'react';
import { useSearchBox } from 'react-instantsearch-hooks-web';

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  onSubmit?: (query: string) => void;
}

export function SearchBox({ placeholder = "Search...", className = "", onSubmit }: SearchBoxProps) {
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = React.useState(query);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.blur();
    }
    if (onSubmit) {
      onSubmit(inputValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    refine(newValue);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="w-full p-2.5 pl-4 pr-12 bg-[#1A1A1A] text-[#E5E5E5] placeholder-[#9CA3AF] 
                   border border-[#D1D5DB] rounded-full focus:outline-none focus:border-[#8B5CF6]
                   transition-colors"
          value={inputValue}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-4 bg-[#8B5CF6] text-white rounded-r-full 
                   hover:bg-[#7C3AED] transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}