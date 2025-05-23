"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface TimeSeriesData {
  timeInterval: string;
  units?: number;
  amount?: number;
  revenue?: number;
  orders?: number;
  timeLabel?: string;
  [key: string]: string | number | undefined; // Add index signature to allow dynamic access
}

interface SalesOverTimeChartProps {
  data: TimeSeriesData[];
  dataKey: string;
  color: string;
  timeFrame: string;
}

// Helper to format time intervals for display
const formatTimeInterval = (timeInterval: string, timeFrame: string) => {
  if (timeFrame === "today") {
    // Format like "14:00" to just "14"
    return timeInterval.split(":")[0];
  }

  if (timeFrame === "7days") {
    // For dates like "2023-05-21", return "05/21"
    const parts = timeInterval.split("-");
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}`;
    }
  }

  if (timeFrame === "30days" && timeInterval.includes("W")) {
    // For week format like "2023-W21", return "Week 21"
    const week = timeInterval.split("W")[1];
    return `W${week}`;
  }

  // Default case just returns the original interval
  return timeInterval;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const CustomTooltip = ({ active, payload, label, dataKey }: any) => {
  if (active && payload && payload.length) {
    // Determine the right label based on the dataKey
    let valueLabel = "Value";
    let valuePrefix = "";
    const value = payload[0].value || 0;

    if (dataKey === "units") {
      valueLabel = "Units Sold";
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            {valueLabel}: {value}
          </p>
        </div>
      );
    } else if (dataKey === "amount" || dataKey === "revenue") {
      valueLabel = dataKey === "amount" ? "Sales Amount" : "Revenue";
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            {valueLabel}: {formatCurrency(value)}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-primary">
          {valueLabel}: {value}
        </p>
      </div>
    );
  }

  return null;
};

const SalesOverTimeChart: React.FC<SalesOverTimeChartProps> = ({
  data,
  dataKey,
  color,
  timeFrame,
}) => {
  if (!data || data.length === 0) return null;

  // Format data for the chart
  const formattedData = data.map((item) => ({
    ...item,
    timeLabel: formatTimeInterval(item.timeInterval, timeFrame),
  }));

  // Find the max value to set a reasonable Y-axis max
  const maxValue = Math.max(
    ...formattedData.map((item) => {
      // Use a type assertion to safely access the dynamic property
      return (item as any)[dataKey] || 0;
    })
  );
  
  // Always set a minimum value to make chart visible
  const yAxisMax = Math.max(5, Math.ceil(maxValue * 1.2)); // At least 5 or 120% of max

  // Only consider empty if ALL values are zero
  const hasAnyData = formattedData.some(item => {
    const value = (item as any)[dataKey];
    return value !== undefined && value > 0;
  });

  if (formattedData.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <p className="text-gray-500">No data for this time period</p>
      </div>
    );
  }

  // Even if all values are zero, still show the chart
  // This prevents "no data" messages when data technically exists

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="timeLabel"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          yAxisId="main"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          domain={[0, yAxisMax]}
        />
        <Tooltip content={<CustomTooltip dataKey={dataKey} />} />
        <Line
          yAxisId="main"
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          dot={{ r: 6, strokeWidth: 2, fill: "white", strokeOpacity: 1 }}
          activeDot={{ r: 8, strokeWidth: 2 }}
          isAnimationActive={true}
          fill={color}
          fillOpacity={0.2}
        />
        <ReferenceLine y={0} stroke="#e5e7eb" yAxisId="main" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesOverTimeChart;
