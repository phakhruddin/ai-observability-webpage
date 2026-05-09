import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { trackSearchQuery } from '@/lib/searchAnalytics';

interface ResourceSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  resultCount?: number;
}

export function ResourceSearchBar({ onSearch, placeholder = 'Search case studies, articles, and more...' }: ResourceSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
    if (newQuery.length > 2) {
      trackSearchQuery(newQuery, 0);
    }
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
    trackSearchQuery('', 0);
  }, [onSearch]);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="pl-10 pr-10 py-2 w-full bg-card border border-accent/20 rounded-lg focus:border-accent focus:outline-none"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
