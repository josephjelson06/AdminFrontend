'use client';

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

// Color palette
const COLORS = {
    primary: '#10b981',
    secondary: '#6366f1',
    accent: '#f59e0b',
    danger: '#ef4444',
    slate: '#64748b',
};

const PIE_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChartDataPoint = Record<string, any>;

interface AreaChartProps {
    data: ChartDataPoint[];
    dataKey: string;
    xAxisKey?: string;
    color?: string;
    height?: number;
    showGrid?: boolean;
    gradientId?: string;
}

export function AreaChartComponent({
    data,
    dataKey,
    xAxisKey = 'name',
    color = COLORS.primary,
    height = 200,
    showGrid = true,
    gradientId = 'colorArea',
}: AreaChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
                <XAxis
                    dataKey={xAxisKey}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                    }}
                />
                <Area
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#${gradientId})`}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

interface BarChartProps {
    data: ChartDataPoint[];
    dataKey: string;
    xAxisKey?: string;
    color?: string;
    height?: number;
    showGrid?: boolean;
}

export function BarChartComponent({
    data,
    dataKey,
    xAxisKey = 'name',
    color = COLORS.primary,
    height = 200,
    showGrid = true,
}: BarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />}
                <XAxis
                    dataKey={xAxisKey}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                    }}
                />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

interface LineChartProps {
    data: ChartDataPoint[];
    lines: { dataKey: string; color: string; name?: string }[];
    xAxisKey?: string;
    height?: number;
    showGrid?: boolean;
}

export function LineChartComponent({
    data,
    lines,
    xAxisKey = 'name',
    height = 200,
    showGrid = true,
}: LineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
                <XAxis
                    dataKey={xAxisKey}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                    }}
                />
                <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="circle"
                    iconSize={8}
                />
                {lines.map((line) => (
                    <Line
                        key={line.dataKey}
                        type="monotone"
                        dataKey={line.dataKey}
                        stroke={line.color}
                        strokeWidth={2}
                        dot={{ fill: line.color, strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 5 }}
                        name={line.name || line.dataKey}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}

interface DonutChartProps {
    data: { name: string; value: number }[];
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
}

export function DonutChartComponent({
    data,
    height = 200,
    innerRadius = 50,
    outerRadius = 80,
}: DonutChartProps) {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                    }}
                    formatter={(value) => [`${value} (${((Number(value) / total) * 100).toFixed(1)}%)`, '']}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

// Simple stat with mini sparkline
interface SparklineProps {
    data: number[];
    color?: string;
    height?: number;
}

export function Sparkline({ data, color = COLORS.primary, height = 30 }: SparklineProps) {
    const chartData = data.map((value, index) => ({ index, value }));

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={1.5}
                    fill="url(#sparklineGradient)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export { COLORS, PIE_COLORS };
