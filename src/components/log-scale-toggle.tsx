import { ChartNoAxesCombinedIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { Toggle } from '@/components/ui/toggle';

export function useLogScale() {
  const [searchParams, setSearchParams] = useSearchParams();

  const logParam = searchParams.get('log');
  const logScale = logParam === '1';

  const setLogScale = (v: boolean) => {
    setSearchParams((prev) => {
      if (v) {
        prev.set('log', '1');
      } else {
        prev.delete('log');
      }
      return prev;
    });
  };

  return { logScale, setLogScale };
}

export function LogScaleToggle() {
  const { logScale, setLogScale } = useLogScale();

  return (
    <Toggle
      size="sm"
      variant="outline"
      pressed={logScale}
      onPressedChange={setLogScale}
      aria-label="Toggle log scale"
    >
      <ChartNoAxesCombinedIcon className="size-4" />
      Log scale
    </Toggle>
  );
}
