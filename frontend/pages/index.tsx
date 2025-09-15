import { useState, useEffect, useMemo } from 'react';
import { fetchConstituencies, Constituency } from '../lib/api';
import ConstituencyCard from '../components/ConstituencyCard';
import { PageSpinner } from '../components/ui/PageSpinner';

// Icons
const SearchIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const ClearIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FilterIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v5.757c0 .615-.26 1.2-.717 1.605a.75.75 0 01-.878.046l-2.5-1.25a.75.75 0 01-.406-.649V12.432a2.25 2.25 0 00-.659-1.591L4.742 6.409A2.25 2.25 0 014.083 4.82V3.776c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
  </svg>
);

const StatsIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>
);

interface HomeProps {
  initialConstituencies: Constituency[];
}

type StatusFilter = 'All' | 'Current' | 'Outdated' | 'Missing';

// Statistics Card Component
const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
    </div>
  </div>
);

export default function Home({ initialConstituencies }: HomeProps) {
  const [constituencies, setConstituencies] = useState(initialConstituencies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = constituencies.length;
    const current = constituencies.filter(c => c.transparency_status === 'Current').length;
    const outdated = constituencies.filter(c => c.transparency_status === 'Outdated').length;
    const missing = constituencies.filter(c => c.transparency_status === 'Missing').length;
    
    return { total, current, outdated, missing };
  }, [constituencies]);

  // Filter constituencies
  const filteredConstituencies = useMemo(() => {
    let filtered = constituencies;

    // Apply text search filter
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.constituency_name.toLowerCase().includes(lowercasedFilter) ||
        c.mp_name.toLowerCase().includes(lowercasedFilter) ||
        c.state.toLowerCase().includes(lowercasedFilter)
      );
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(c => c.transparency_status === statusFilter);
    }

    return filtered;
  }, [searchTerm, statusFilter, constituencies]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status);
  };

  if (!constituencies) return <PageSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Economical Transparency
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Monitor MPLADS expenditure reporting across all 543 Lok Sabha constituencies. 
              Track transparency, accountability, and public fund utilization. *All the data are based on 16th Lok Sabha* *2014 - 2019*
            </p>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Total Constituencies" 
            value={stats.total} 
            color="bg-blue-500" 
          />
          <StatCard 
            label="Up to Date" 
            value={stats.current} 
            color="bg-green-500" 
          />
          <StatCard 
            label="Needs Update" 
            value={stats.outdated} 
            color="bg-amber-500" 
          />
          <StatCard 
            label="Missing Reports" 
            value={stats.missing} 
            color="bg-red-500" 
          />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            
            <input
              type="text"
              placeholder="Search by constituency, MP name, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
            />
            
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                aria-label="Clear search"
              >
                <ClearIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
              <FilterIcon className="w-4 h-4" />
              Filter by status:
            </div>
            
            {(['All', 'Current', 'Outdated', 'Missing'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {status}
                {status !== 'All' && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {status === 'Current' ? stats.current : 
                     status === 'Outdated' ? stats.outdated : stats.missing}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredConstituencies.length}</span> of <span className="font-semibold">{constituencies.length}</span> constituencies
            {searchTerm && (
              <span> for "<span className="font-semibold text-blue-600 dark:text-blue-400">{searchTerm}</span>"</span>
            )}
            {statusFilter !== 'All' && (
              <span> with <span className="font-semibold text-blue-600 dark:text-blue-400">{statusFilter}</span> status</span>
            )}
          </p>
        </div>

        {/* Constituency Grid */}
        {filteredConstituencies.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredConstituencies.map((constituency) => (
              <ConstituencyCard key={constituency.id} constituency={constituency} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <StatsIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No constituencies found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              {(searchTerm || statusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Fetch data at build time (or on server-side) for fast page loads
export async function getStaticProps() {
  const initialConstituencies = await fetchConstituencies();
  return {
    props: {
      initialConstituencies,
    },
    revalidate: 60, // Re-fetch data every 60 seconds
  };
}