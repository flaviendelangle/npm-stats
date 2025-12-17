import * as React from 'react';

import { format } from 'date-fns';
import type { TooltipProps } from 'recharts';
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import type { PackageDownloads } from '@/hooks/usePackagesDownloads';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip } from './ui/chart';

// Chart colors that cycle through shadcn chart color variables
const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
  'var(--chart-9)',
  'var(--chart-10)',
  'var(--chart-11)',
  'var(--chart-12)',
];

function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

interface ChartLegendGridProps {
  config: ChartConfig;
}

function ChartLegendGrid({ config }: ChartLegendGridProps) {
  const entries = Object.entries(config);

  if (entries.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <div className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: value.color }} />
          <span className="text-sm text-muted-foreground">{value.label || key}</span>
        </div>
      ))}
    </div>
  );
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  config: ChartConfig;
}

function CustomTooltip({ active, payload, config }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const time = payload[0]?.payload?.time as Date | undefined;

  // Sort payload by value descending for better readability
  const sortedPayload = [...payload].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  return (
    <div className="rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur-sm">
      {time && (
        <div className="mb-2 border-b border-border pb-2 text-sm font-medium text-foreground">
          {format(time, 'MMMM d, yyyy')}
        </div>
      )}
      <div className="space-y-1.5">
        {sortedPayload.map((entry) => {
          const packageConfig = config[entry.dataKey as string];
          const value = entry.value ?? 0;
          return (
            <div key={entry.dataKey} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: packageConfig?.color || entry.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {packageConfig?.label || entry.dataKey}
                </span>
              </div>
              <span className="text-sm font-medium tabular-nums text-foreground">
                {value.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ChartSkeletonProps {
  title: string;
  description?: string;
}

export function ChartSkeleton({ title, description }: ChartSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex aspect-video items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <span className="text-sm">Loading data...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DownloadsLineChartProps {
  title: string;
  description?: string;
  data: PackageDownloads[];
  isLoading?: boolean;
}

export function DownloadsLineChart({
  title,
  description,
  data,
  isLoading,
}: DownloadsLineChartProps) {
  const [logScale, setLogScale] = React.useState(false);
  // Transform data for Recharts - merge all packages into a single array with time as key
  const chartData = React.useMemo(() => {
    if (data.length === 0) return [];
    const timeMap = new Map<string, Record<string, number | Date>>();

    for (const pkg of data) {
      for (const point of pkg.data) {
        const timeKey = point.time.toISOString();
        const existing = timeMap.get(timeKey) || { time: point.time };
        existing[pkg.packageName] = point.value;
        timeMap.set(timeKey, existing);
      }
    }

    return Array.from(timeMap.values()).sort(
      (a, b) => (a.time as Date).getTime() - (b.time as Date).getTime(),
    );
  }, [data]);

  const chartConfig = React.useMemo<ChartConfig>(() => {
    const config: ChartConfig = {};
    data.forEach((pkg, index) => {
      config[pkg.packageName] = {
        label: pkg.packageName,
        color: getChartColor(index),
      };
    });
    return config;
  }, [data]);

  if (isLoading) {
    return <ChartSkeleton title={title} description={description} />;
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex aspect-video items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLogScale(!logScale)}
          className={cn('text-xs', logScale && 'bg-accent')}
        >
          Log scale
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: Date) => format(value, 'MMM yyyy')}
            />
            <YAxis
              scale={logScale ? 'log' : 'auto'}
              domain={logScale ? ['auto', 'auto'] : undefined}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value.toString();
              }}
            />
            <ChartTooltip content={<CustomTooltip config={chartConfig} />} />
            {data.map((pkg, index) => (
              <Line
                key={pkg.packageName}
                dataKey={pkg.packageName}
                type="monotone"
                stroke={getChartColor(index)}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
        <ChartLegendGrid config={chartConfig} />
      </CardContent>
    </Card>
  );
}

interface DownloadsStackedAreaChartProps {
  title: string;
  description?: string;
  data: PackageDownloads[];
  isLoading?: boolean;
}

export function DownloadsStackedAreaChart({
  title,
  description,
  data,
  isLoading,
}: DownloadsStackedAreaChartProps) {
  const [logScale, setLogScale] = React.useState(false);
  // Transform data for Recharts - merge all packages into a single array with time as key
  const chartData = React.useMemo(() => {
    if (data.length === 0) return [];
    const timeMap = new Map<string, Record<string, number | Date>>();

    for (const pkg of data) {
      for (const point of pkg.data) {
        const timeKey = point.time.toISOString();
        const existing = timeMap.get(timeKey) || { time: point.time };
        existing[pkg.packageName] = point.value;
        timeMap.set(timeKey, existing);
      }
    }

    return Array.from(timeMap.values()).sort(
      (a, b) => (a.time as Date).getTime() - (b.time as Date).getTime(),
    );
  }, [data]);

  const chartConfig = React.useMemo<ChartConfig>(() => {
    const config: ChartConfig = {};
    data.forEach((pkg, index) => {
      config[pkg.packageName] = {
        label: pkg.packageName,
        color: getChartColor(index),
      };
    });
    return config;
  }, [data]);

  if (isLoading) {
    return <ChartSkeleton title={title} description={description} />;
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex aspect-video items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLogScale(!logScale)}
          className={cn('text-xs', logScale && 'bg-accent')}
        >
          Log scale
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: Date) => format(value, 'MMM yyyy')}
            />
            <YAxis
              scale={logScale ? 'log' : 'auto'}
              domain={logScale ? ['auto', 'auto'] : undefined}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value.toString();
              }}
            />
            <ChartTooltip content={<CustomTooltip config={chartConfig} />} />
            {data.map((pkg, index) => (
              <Area
                key={pkg.packageName}
                dataKey={pkg.packageName}
                type="monotone"
                fill={getChartColor(index)}
                fillOpacity={0.4}
                stroke={getChartColor(index)}
                strokeWidth={2}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
        <ChartLegendGrid config={chartConfig} />
      </CardContent>
    </Card>
  );
}
