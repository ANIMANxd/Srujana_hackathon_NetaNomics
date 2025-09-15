import { AIInsight } from '@/lib/types';

const severityStyles = {
  High: 'bg-red-500/20 text-red-400 border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

interface InsightsPanelProps {
  data: AIInsight[];
  onInsightClick: (insight: AIInsight) => void; 
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ data, onInsightClick }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-card dark:bg-dark-card/50 rounded-lg border border-dashed border-border">
        <p className="text-center text-text-muted">
          No AI insights were generated for this report.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((insight) => (
        <button
          key={insight.id}
          onClick={() => onInsightClick(insight)}
          className="w-full text-left p-4 rounded-lg bg-card dark:bg-dark-card/50 border border-border transition-all duration-200 hover:border-accent hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-text-primary">
              {insight.title}
            </h3>
            <span 
              className={`px-3 py-1 text-xs font-bold rounded-full border ${severityStyles[insight.severity]}`}
            >
              {insight.severity} Severity
            </span>
          </div>
          <p className="text-text-muted">
            {insight.finding}
          </p>
           <p className="text-xs font-bold text-accent mt-3">Click for Detailed Analysis &rarr;</p>
        </button>
      ))}
    </div>
  );
};

export default InsightsPanel;