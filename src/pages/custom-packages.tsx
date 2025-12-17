import * as React from 'react';
import { useId } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Autocomplete } from '@/components/autocomplete';
import { DownloadsLineChart } from '@/components/downloads-chart';
import { FilterControls } from '@/components/filters';
import { Label } from '@/components/ui/label';
import { PACKAGES, type PackageOption } from '@/data';
import { useFilterParams } from '@/hooks/useFilterParams';
import { usePackagesDownloads } from '@/hooks/usePackagesDownloads';

export function CustomPackagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { dateRange, precision, precisionModel } = useFilterParams();
  const autocompleteId = useId();

  // Parse selected packages from URL
  const selectedPackageNames = React.useMemo(() => {
    const packagesParam = searchParams.get('packages');
    if (!packagesParam) return [];
    return packagesParam.split(',').filter(Boolean);
  }, [searchParams]);

  // Convert package names to PackageOption objects
  // For names not in PACKAGES, create a simple PackageOption with just the name
  const selectedPackages = React.useMemo(() => {
    return selectedPackageNames.map((name) => {
      const existingPackage = PACKAGES.find((pkg) => pkg.name === name);
      if (existingPackage) {
        return existingPackage;
      }
      // Create a new PackageOption for custom package names
      return { name } as PackageOption;
    });
  }, [selectedPackageNames]);

  const setSelectedPackages = (packages: PackageOption[]) => {
    setSearchParams((prev) => {
      if (packages.length === 0) {
        prev.delete('packages');
      } else {
        prev.set('packages', packages.map((pkg) => pkg.name).join(','));
      }
      return prev;
    });
  };

  const { data: downloadsData, isLoading } = usePackagesDownloads({
    dateRange,
    packages: selectedPackages,
    referencePackage: null,
    precision,
    precisionModel,
    base100: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Custom Packages</h2>
          <p className="text-muted-foreground">
            Select any packages to compare their NPM download statistics
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={autocompleteId}>Packages</Label>
          <Autocomplete
            id={autocompleteId}
            items={PACKAGES}
            value={selectedPackages}
            onValueChange={setSelectedPackages}
            getItemLabel={(pkg) => pkg.name}
            getItemKey={(pkg) => pkg.name}
            createItem={(name) => ({ name })}
            placeholder="Search or type a package name..."
            className="w-80"
          />
        </div>
        <FilterControls />
      </div>

      {selectedPackages.length === 0 ? (
        <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed text-muted-foreground">
          Select packages to view their download statistics
        </div>
      ) : (
        <DownloadsLineChart
          title="Custom Package Downloads"
          description={`Daily downloads for ${selectedPackages.length} package${selectedPackages.length === 1 ? '' : 's'}`}
          data={downloadsData}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
