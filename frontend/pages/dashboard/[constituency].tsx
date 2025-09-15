import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState } from 'react';
import { fetchDashboardData } from '@/lib/api';
import { DashboardData, AIInsight, SpendingByCategory } from '@/lib/types';
import BarChart from '@/components/dashboard/BarChart';
import PieChart from '@/components/dashboard/PieChart';
import InsightsPanel from '@/components/dashboard/InsightsPanel';
import Modal from '@/components/ui/Modal';
import ReactMarkdown from 'react-markdown';

// --- TYPE DEFINITIONS ---
type BudgetItem = {
  category: string;
  amount: number;
  justification: string;
  example_project: string;
};

// --- ICONS (from your design) ---
const CalendarIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5m-18 0h18" /></svg>);
const CurrencyRupeeIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 8H9m6 0a3 3 0 11-6 0m6 0v1a2 2 0 01-2 2H9.236a9.987 9.987 0 01-7.236 9V21h3.179c4.388 0 8.235-2.83 9.642-7.111l.114-.289c.394-.977.394-2.037 0-3.014L15 9V8z" /></svg>);
const BuildingOfficeIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18h-13.5L4.5 3zM9 9h1.5m-1.5 3h1.5m-1.5 3h1.5M12 9h1.5m-1.5 3h1.5m-1.5 3h1.5" /></svg>);
const LocationIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 0115 0z" /></svg>);
const BrainIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.611L5 14.5" /></svg>);
const LightBulbIcon = (props: any) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a2.311 2.311 0 01-3.75 0M12 18.75a3 3 0 01-3-3V12m6 3.75a3 3 0 00-3-3V12m-9 6.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>);

// --- UI Components (from your design) ---
const MetricCard = ({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ElementType; color: string;}) => ( <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"><div className="flex items-center justify-between"><div className="flex-1"><p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p><p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p></div><div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}><Icon className="w-8 h-8 text-white" /></div></div></div> );
const ChartCard = ({ title, icon: Icon, children, className = "" }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string;}) => ( <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 ${className}`}><div className="flex items-center gap-3 mb-6"><div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div><h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2></div>{children}</div> );

// --- MAIN PAGE COMPONENT ---
const DashboardPage = ({ data, constituencyId, apiUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [insightDetail, setInsightDetail] = useState('');
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [isBudgetLoading, setIsBudgetLoading] = useState(false);
  const [optimalBudget, setOptimalBudget] = useState<BudgetItem[] | null>(null);

  const handleInsightClick = async (insight: AIInsight) => {
    setSelectedInsight(insight);
    setIsModalOpen(true);
    setIsDetailLoading(true);
    setInsightDetail('');
    try {
      const response = await fetch(`${apiUrl}/api/v1/insights/detail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insight_id: insight.id,
          original_title: insight.title,
          original_finding: insight.finding,
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch detailed analysis.');
      const result = await response.json();
      setInsightDetail(result.detailed_brief);
    } catch (error) {
      setInsightDetail('Could not load detailed analysis. Please try again.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleGenerateBudget = async () => {
    setIsBudgetLoading(true);
    setOptimalBudget(null);
    try {
      const profile = `A largely rural constituency in Karnataka with a significant farming population and below-average literacy rates. Key needs are likely to be in primary education and basic amenities like clean water.`;
      const response = await fetch(`${apiUrl}/api/v1/budget/generate-optimal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          constituency_name: data.constituency_name,
          constituency_profile: profile,
        }),
      });
      if (!response.ok) throw new Error('Failed to generate budget.');
      const result = await response.json();
      setOptimalBudget(result.optimal_allocation);
    } catch (error) {
      alert('Failed to generate optimal budget. Please try again.');
    } finally {
      setIsBudgetLoading(false);
    }
  };

  const formattedDate = new Date(data.last_report_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const optimalBudgetDataForChart: SpendingByCategory[] = optimalBudget 
    ? optimalBudget.map(item => ({ category: item.category, amount: item.amount, percentage: (item.amount / 50000000) * 100 }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3">
                  {data.mp_name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <LocationIcon className="w-5 h-5" />
                  <p className="text-xl">
                    {data.constituency_name} {data.state}
                  </p>
                </div>
              </div>
              <div className="lg:text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-400 font-medium text-sm">
                    Report Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <MetricCard title="Total Expenditure" value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(data.total_expenditure)} icon={CurrencyRupeeIcon} color="bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <MetricCard title="Total Projects" value={data.total_projects.toString()} icon={BuildingOfficeIcon} color="bg-gradient-to-r from-blue-500 to-blue-600" />
        </div>
        
        {/* --- RESTRUCTURED MAIN SECTION --- */}
        <div className="space-y-10">
          
          {/* AI Policy Advisor Card - The new feature */}
          <ChartCard title="AI Policy Advisor: Is the spending intelligent?" icon={LightBulbIcon}>
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-300 text-center sm:text-left flex-grow">
                How should funds be spent to best serve the constituency? Our "AI District Commissioner" generates an optimal budget based on public policy principles for comparison.
              </p>
              <button onClick={handleGenerateBudget} disabled={isBudgetLoading} className="px-6 py-3 bg-accent text-white font-bold rounded-lg shadow-md hover:bg-accent/90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0">
                {isBudgetLoading ? "Generating..." : "Generate Optimal Budget"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-4">MP's Actual Spending</h3>
                <div className="h-[300px]"><PieChart data={data.spending_by_category} /></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-4">AI's Optimal Budget</h3>
                <div className="h-[300px] flex items-center justify-center">
                  {isBudgetLoading && <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>}
                  {optimalBudget && <PieChart data={optimalBudgetDataForChart} />}
                  {!isBudgetLoading && !optimalBudget && (
                    <div className="text-center text-gray-500 p-8"><LightBulbIcon className="w-12 h-12 mx-auto mb-2"/><p>Click "Generate" to see the AI's data-driven recommendation.</p></div>
                  )}
                </div>
              </div>
            </div>

            {optimalBudget && (
              <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">AI Recommendations & Justifications</h3>
                <div className="space-y-4">
                  {optimalBudget.map(item => (<div key={item.category} className="p-4 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg"><p className="font-bold text-accent">{item.category} - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.amount)}</p><p className="text-sm text-gray-600 dark:text-gray-400 italic">"{item.justification}"</p><p className="text-sm mt-1"><strong>Example Project:</strong> {item.example_project}</p></div>))}
                </div>
              </div>
            )}
          </ChartCard>

          {/* Top Contractors Card */}
          <ChartCard title="Top Contractors" icon={BuildingOfficeIcon}>
            <BarChart data={data.top_10_contractors} />
          </ChartCard>
          
          {/* AI Insights Card */}
          <ChartCard title="AI Insights & Analysis" icon={BrainIcon}>
            <InsightsPanel data={data.ai_insights} onInsightClick={handleInsightClick} />
          </ChartCard>

        </div>
      </div>

      {/* The Modal for Detailed Insights */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedInsight?.title || 'Insight Detail'}>
        <div className="p-6 min-h-[300px]">
          {isDetailLoading ? (
            <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none"><ReactMarkdown>{insightDetail}</ReactMarkdown></div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{ data: DashboardData, constituencyId: number, apiUrl: string, }> = async (context) => {
  const { constituency: slug } = context.params as { constituency: string };
  const constituencyName = slug.replace(/-/g, ' ');
  const data = await fetchDashboardData(constituencyName);
  if (!data) { return { notFound: true }; }
  return { 
    props: { 
      data,
      constituencyId: data.id, 
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
    } 
  };
};

export default DashboardPage;