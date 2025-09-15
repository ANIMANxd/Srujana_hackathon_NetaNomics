import Link from 'next/link';
import { Constituency } from '@/lib/types';
import clsx from 'clsx';

// Icons
const ArrowRightIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const CheckCircleIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationCircleIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
);

interface ConstituencyCardProps {
  constituency: Constituency;
}

const statusConfig = {
  Current: {
    styles: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400',
    icon: CheckCircleIcon,
    label: 'Up to date'
  },
  Outdated: {
    styles: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400',
    icon: ClockIcon,
    label: 'Needs update'
  },
  Missing: {
    styles: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
    icon: ExclamationCircleIcon,
    label: 'Action required'
  }
};

const ConstituencyCard: React.FC<ConstituencyCardProps> = ({ constituency }) => {
  const { mp_name, constituency_name, state, transparency_status, mp_email, last_report_date } = constituency;
  
  const isActionable = transparency_status === 'Missing' || transparency_status === 'Outdated';
  const formattedConstituency = constituency_name.toLowerCase().replace(/\s+/g, '-');
  const statusInfo = statusConfig[transparency_status];
  const StatusIcon = statusInfo.icon;
  
  const href = isActionable
    ? `/action/${formattedConstituency}?mp=${encodeURIComponent(
        mp_name
      )}&email=${encodeURIComponent(
        mp_email || ''
      )}&status=${encodeURIComponent(
        transparency_status
      )}&lastDate=${encodeURIComponent(
        last_report_date || ''
      )}`
    : `/dashboard/${formattedConstituency}`;

  return (
    <Link href={href} className="block group h-full">
      <div className="relative h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out group-hover:-translate-y-2 overflow-hidden">
        
        {/* Card Content */}
        <div className="p-6 h-full flex flex-col">
          
          {/* Header with MP Name and Action Indicator */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                {mp_name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {constituency_name}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs font-medium uppercase tracking-wide mt-1">
                {state}
              </p>
            </div>
            
            {/* Action Arrow */}
            <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="mt-auto">
            <div className={clsx(
              'inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium',
              statusInfo.styles
            )}>
              <StatusIcon className="w-4 h-4 flex-shrink-0" />
              <span>{statusInfo.label}</span>
            </div>
            
            {/* Last Report Date */}
            {last_report_date && transparency_status === 'Outdated' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Last updated: {new Date(last_report_date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
        
        {/* Hover Effect Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        
        {/* Action Required Indicator */}
        {isActionable && (
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ConstituencyCard;