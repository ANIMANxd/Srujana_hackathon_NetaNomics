'use client'; // Required for Recharts and hooks

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SpendingByCategory } from '../../lib/types';
import { useTheme } from '../../context/ThemeContext';

interface SpendingPieChartProps {
  data: SpendingByCategory[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

const CustomLegend = ({ payload, theme }: any) => {
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  return (
    <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center space-x-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span style={{ color: textColor, fontSize: '14px' }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
    const { theme } = useTheme();
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const value = payload[0].value;
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
          <p style={{ color: labelColor, marginBottom: '4px', fontSize: '12px' }}>{data.category}</p>
          <p style={{ color: textColor, fontWeight: 'bold' }}>
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 0,
            }).format(value)}
          </p>
        </div>
      );
    }
    return null;
};


const SpendingPieChart: React.FC<SpendingPieChartProps> = ({ data }) => {
  const { theme } = useTheme();

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="amount"
            nameKey="category"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            cursor={{ fill: 'transparent' }}
            content={<CustomTooltip />}
            isAnimationActive={false}
            offset={25}
          />
          <Legend content={<CustomLegend theme={theme} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingPieChart;

