import * as React from 'react';
import { useId } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DownloadsStackedAreaChart } from '@/components/downloads-chart';
import { FilterControls } from '@/components/filters';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PACKAGES, type PackageOption } from '@/data';
import { useFilterParams } from '@/hooks/useFilterParams';
import { usePackagesDownloads } from '@/hooks/usePackagesDownloads';

// Filter packages that have multiple packageNames - these are packages with historical renames
const MULTI_PACKAGE_OPTIONS = PACKAGES.filter(
  (pkg) => pkg.packageNames && pkg.packageNames.length > 1,
);

export function PackageBreakdownPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { dateRange, precision, precisionModel } = useFilterParams();
  const packageSelectId = useId();

  const selectedPackageName = searchParams.get('package') || MULTI_PACKAGE_OPTIONS[0]?.name || '';
  const selectedPackage = MULTI_PACKAGE_OPTIONS.find((pkg) => pkg.name === selectedPackageName);

  const setSelectedPackage = (value: string | null) => {
    if (value) {
      setSearchParams((prev) => {
        prev.set('package', value);
        return prev;
      });
    }
  };

  // Create individual package options from the packageNames array
  const individualPackages = React.useMemo<PackageOption[]>(() => {
    if (!selectedPackage?.packageNames) return [];
    return selectedPackage.packageNames.map((name) => ({
      name,
    }));
  }, [selectedPackage]);

  const { data: downloadsData, isLoading } = usePackagesDownloads({
    dateRange,
    packages: individualPackages,
    referencePackage: null,
    precision,
    precisionModel,
    base100: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Package Breakdown</h2>
          <p className="text-muted-foreground">
            View stacked downloads for packages with multiple npm names (e.g., renamed packages)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={packageSelectId}>Package</Label>
          <Select value={selectedPackageName} onValueChange={setSelectedPackage}>
            <SelectTrigger id={packageSelectId} className="w-55">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MULTI_PACKAGE_OPTIONS.map((pkg) => (
                <SelectItem key={pkg.name} value={pkg.name}>
                  {pkg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <FilterControls />
      </div>

      <DownloadsStackedAreaChart
        title={`${selectedPackageName} Breakdown`}
        description={
          selectedPackage?.packageNames
            ? `Stacked downloads for: ${selectedPackage.packageNames.join(', ')}`
            : undefined
        }
        data={downloadsData}
        isLoading={isLoading}
      />
    </div>
  );
}
