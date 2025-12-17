import { useSearchParams } from 'react-router-dom';

import type { DateRange, Precision, PrecisionModel } from '@/types';

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateRange = (searchParams.get('dateRange') as DateRange) || 'last-year';
  const precision = (searchParams.get('precision') as Precision) || 'week';
  const precisionModel = (searchParams.get('precisionModel') as PrecisionModel) || 'sum';

  const setDateRange = (value: DateRange | null) => {
    if (value) {
      setSearchParams((prev) => {
        prev.set('dateRange', value);
        return prev;
      });
    }
  };

  const setPrecision = (value: Precision | null) => {
    if (value) {
      setSearchParams((prev) => {
        prev.set('precision', value);
        return prev;
      });
    }
  };

  const setPrecisionModel = (value: PrecisionModel | null) => {
    if (value) {
      setSearchParams((prev) => {
        prev.set('precisionModel', value);
        return prev;
      });
    }
  };

  return {
    dateRange,
    precision,
    precisionModel,
    setDateRange,
    setPrecision,
    setPrecisionModel,
  };
}
