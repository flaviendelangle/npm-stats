import * as React from 'react';
import { useId } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DownloadsLineChart } from '@/components/downloads-chart';
import { FilterControls } from '@/components/filters';
import { LogScaleToggle, useLogScale } from '@/components/log-scale-toggle';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PACKAGES, PRESETS, type PackageOption, type PackagePreset } from '@/data';
import { useFilterParams } from '@/hooks/useFilterParams';
import { usePackagesDownloads } from '@/hooks/usePackagesDownloads';

function getPackagesForPreset(preset: PackagePreset): PackageOption[] {
  return PACKAGES.filter((pkg) => pkg.presets?.includes(preset));
}

export function PresetsDownloadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { dateRange, precision, precisionModel } = useFilterParams();
  const presetSelectId = useId();

  const selectedPreset = (searchParams.get('preset') as PackagePreset) || 'Base UI packages';

  const setSelectedPreset = (value: PackagePreset | null) => {
    if (value) {
      setSearchParams((prev) => {
        prev.set('preset', value);
        return prev;
      });
    }
  };

  const packages = React.useMemo(() => getPackagesForPreset(selectedPreset), [selectedPreset]);

  const { data: downloadsData, isLoading } = usePackagesDownloads({
    dateRange,
    packages,
    referencePackage: null,
    precision,
    precisionModel,
    base100: false,
  });

  const { logScale } = useLogScale();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Preset Downloads</h2>
        <p className="text-muted-foreground">
          Compare NPM download statistics for packages in a preset
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={presetSelectId}>Preset</Label>
          <Select value={selectedPreset} onValueChange={setSelectedPreset}>
            <SelectTrigger id={presetSelectId} className="w-55">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((presetGroup) => (
                <SelectGroup key={presetGroup.group}>
                  <SelectLabel>{presetGroup.group}</SelectLabel>
                  {presetGroup.presets.map((preset) => (
                    <SelectItem key={preset} value={preset}>
                      {preset}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <FilterControls />
        <div className="ml-auto">
          <LogScaleToggle />
        </div>
      </div>

      <DownloadsLineChart
        title={`${selectedPreset} Downloads`}
        description={`Daily downloads for ${packages.length} packages`}
        data={downloadsData}
        isLoading={isLoading}
        logScale={logScale}
      />
    </div>
  );
}
