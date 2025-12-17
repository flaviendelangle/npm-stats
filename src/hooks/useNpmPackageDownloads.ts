import { useQueries } from '@tanstack/react-query';

import { format } from 'date-fns/format';
import { isAfter } from 'date-fns/isAfter';
import { parse } from 'date-fns/parse';
import { subDays } from 'date-fns/subDays';
import { subMonths } from 'date-fns/subMonths';
import { subYears } from 'date-fns/subYears';

import { NPM_DATE_FORMAT } from '@/constants';
import type { PackageOption } from '@/data';
import type { DateRange } from '@/types';

const API_ENDPOINT = 'https://api.npmjs.org/downloads';

export interface PackageResponse {
  start: string;
  end: string;
  package: string;
  downloads: { downloads: number; day: string }[];
}

/**
 * Calculate start and end dates from a DateRange
 */
export function getDateRangeBounds(dateRange: DateRange): { startDate: Date; endDate: Date } {
  const endDate = subDays(new Date(), 1);
  let startDate: Date;

  switch (dateRange) {
    case 'last-five-years':
      startDate = subYears(endDate, 5);
      break;
    case 'last-two-years':
      startDate = subYears(endDate, 2);
      break;
    case 'last-year':
      startDate = subYears(endDate, 1);
      break;
    case 'last-six-months':
      startDate = subMonths(endDate, 6);
      break;
    case 'last-month':
      startDate = subMonths(endDate, 1);
      break;
  }

  return { startDate, endDate };
}

/**
 * Fetch NPM package downloads for a date range.
 * Handles pagination automatically since NPM API limits response size.
 */
async function fetchNpmPackageDownloads(
  npmPackage: string,
  startDate: Date,
  endDate: Date,
): Promise<PackageResponse | null> {
  const startDateStr = format(startDate, NPM_DATE_FORMAT);
  const endDateStr = format(endDate, NPM_DATE_FORMAT);
  const endpoint = `${API_ENDPOINT}/range/${startDateStr}:${endDateStr}/${npmPackage}`;

  const response = await window.fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch downloads for ${npmPackage}: ${response.statusText}`);
  }

  const data: PackageResponse = await response.json();

  if (!data.downloads) {
    return null;
  }

  // Handle pagination - NPM API may return partial data
  const responseStart = parse(data.start, NPM_DATE_FORMAT, new Date());
  if (isAfter(responseStart, startDate)) {
    const previousData = await fetchNpmPackageDownloads(
      npmPackage,
      startDate,
      subDays(responseStart, 1),
    );
    if (previousData) {
      return {
        ...data,
        start: previousData.start,
        downloads: [...previousData.downloads, ...data.downloads],
      };
    }
  }

  return data;
}

/**
 * Extract all unique npm package names from a list of packages/options
 */
export function extractNpmPackageNames(packages: (string | PackageOption)[]): string[] {
  const npmPackagesSet = new Set<string>();

  for (const pkg of packages) {
    if (typeof pkg === 'string') {
      npmPackagesSet.add(pkg);
    } else {
      npmPackagesSet.add(pkg.name);
      if (pkg.packageNames) {
        for (const name of pkg.packageNames) {
          npmPackagesSet.add(name);
        }
      }
    }
  }

  return Array.from(npmPackagesSet);
}

interface UseNpmPackageDownloadsParams {
  dateRange: DateRange;
  packages: (string | PackageOption)[];
}

/**
 * React Query hook to fetch NPM package downloads.
 * Each package is fetched independently and cached separately.
 */
export function useNpmPackageDownloads({ dateRange, packages }: UseNpmPackageDownloadsParams) {
  const { startDate, endDate } = getDateRangeBounds(dateRange);
  const startDateStr = format(startDate, NPM_DATE_FORMAT);
  const endDateStr = format(endDate, NPM_DATE_FORMAT);

  const npmPackageNames = extractNpmPackageNames(packages);

  const queries = useQueries({
    queries: npmPackageNames.map((npmPackage) => ({
      queryKey: ['npm-downloads', npmPackage, startDateStr, endDateStr] as const,
      queryFn: () => fetchNpmPackageDownloads(npmPackage, startDate, endDate),
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);
  const errors = queries.filter((q) => q.error).map((q) => q.error);

  // Build a map of package name to response data
  const packagesData: Record<string, PackageResponse> = {};
  queries.forEach((query, index) => {
    if (query.data) {
      packagesData[npmPackageNames[index]] = query.data;
    }
  });

  return {
    isLoading,
    isError,
    errors,
    packages: packagesData,
  };
}
