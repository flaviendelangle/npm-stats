import { useId } from 'react';

import { useFilterParams } from '@/hooks/useFilterParams';
import type { DateRange, Precision, PrecisionModel } from '@/types';

import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'last-month', label: 'Last month' },
  { value: 'last-six-months', label: 'Last 6 months' },
  { value: 'last-year', label: 'Last year' },
  { value: 'last-two-years', label: 'Last 2 years' },
  { value: 'last-five-years', label: 'Last 5 years' },
];

const PRECISION_OPTIONS: { value: Precision; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const PRECISION_MODEL_OPTIONS: { value: PrecisionModel; label: string }[] = [
  { value: 'sum', label: 'Sum' },
  { value: 'movingAverage', label: 'Moving Average' },
];

export function DateRangeSelect() {
  const { dateRange, setDateRange } = useFilterParams();
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>Date Range</Label>
      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger id={id} className="w-35">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DATE_RANGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function PrecisionSelect() {
  const { precision, setPrecision } = useFilterParams();
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>Precision</Label>
      <Select value={precision} onValueChange={setPrecision}>
        <SelectTrigger id={id} className="w-25">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRECISION_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function PrecisionModelSelect() {
  const { precisionModel, setPrecisionModel } = useFilterParams();
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>Aggregation</Label>
      <Select value={precisionModel} onValueChange={setPrecisionModel}>
        <SelectTrigger id={id} className="w-38">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRECISION_MODEL_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FilterControls() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <DateRangeSelect />
      <PrecisionSelect />
      <PrecisionModelSelect />
    </div>
  );
}
