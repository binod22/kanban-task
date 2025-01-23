import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <div className="relative">
    <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
    <input
      type="text"
      placeholder="Search tasks..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10 pr-4 py-2 rounded-lg border shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);