'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TopContractor } from '@/lib/types';
import { formatCurrency } from '@/utils/formatters';
import { useTheme } from '@/context/ThemeContext';

interface ContractorsBarChartProps {
  data: TopContractor[];
}

const COLORS_DARK = ['#38bdf8', '#6366f1', '#a78bfa', '#f472b6', '#fb923c'];
const COLORS_LIGHT = ['#0ea5e9', '#4f46e5', '#8b5cf6', '#ec4899', '#f97316'];

const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme();
  if (active && payload && payload.length) {
    const cardBg = theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
    const labelColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const border = theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0';

    return (
      <div style={{
        backgroundColor: cardBg,
        border: border,
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        backdropFilter: 'blur(4px)',
      }}>
        <p style={{ color: labelColor, marginBottom: '4px', fontSize: '12px' }}>{label}</p>
        <p style={{ color: textColor, fontWeight: 'bold' }}>{`Amount: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Y-Axis Tick to handle long labels
const CustomizedYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    // Truncate long labels for better readability
    const label = payload.value.length > 25 ? `${payload.value.slice(0, 25)}...` : payload.value;
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={4} textAnchor="end" fill="currentColor" fontSize={12}>
                {label}
            </text>
        </g>
    );
};


const ContractorsBarChart: React.FC<ContractorsBarChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b'; // Updated muted colors
  const colors = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
  const cursorFill = theme === 'dark' ? 'rgba(100, 116, 139, 0.1)' : 'rgba(203, 213, 225, 0.2)';

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={<CustomizedYAxisTick />}
            stroke={tickColor}
          />
          <Tooltip
            cursor={{ fill: cursorFill }}
            content={<CustomTooltip />}
            wrapperStyle={{ zIndex: 10 }}
          />
          <Bar dataKey="amount" name="Amount Spent" barSize={20} radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContractorsBarChart;

