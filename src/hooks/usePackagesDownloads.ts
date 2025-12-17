import * as React from 'react';

import { isBefore } from 'date-fns/isBefore';
import { parse } from 'date-fns/parse';
import { startOfDay } from 'date-fns/startOfDay';
import { startOfMonth } from 'date-fns/startOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { subDays } from 'date-fns/subDays';

import { NPM_DATE_FORMAT } from '@/constants';
import { type PackageOption, getPackageNameFromOption } from '@/data';
import type { DateRange, Precision, PrecisionModel } from '@/types';

import { useNpmPackageDownloads } from './useNpmPackageDownloads';

export interface UsePackagesDownloadsParams {
  dateRange: DateRange;
  packages: PackageOption[];
  referencePackage: PackageOption | null;
  precision: Precision;
  precisionModel: PrecisionModel;
  base100: boolean;
}

export type PackageDownloads = {
  packageName: string;
  data: { time: Date; value: number }[];
};

export const usePackagesDownloads = (params: UsePackagesDownloadsParams) => {
  const allPackages = React.useMemo(
    () =>
      params.referencePackage == null
        ? params.packages
        : [...params.packages, params.referencePackage],
    [params.packages, params.referencePackage],
  );

  const { isLoading, packages: packagesData } = useNpmPackageDownloads({
    dateRange: params.dateRange,
    packages: allPackages,
  });

  const data = React.useMemo<PackageDownloads[]>(() => {
    if (isLoading || !packagesData) {
      return [];
    }

    const packagesDownloadsMap: {
      [name: string]: Map<string, { time: Date; value: number }>;
    } = {};

    const buildPackageMap = (pkg: PackageOption) => {
      const packageName = getPackageNameFromOption(pkg);

      let npmPackages: string[];
      if (pkg.packageNames == null) {
        npmPackages = [pkg.name];
      } else {
        npmPackages = pkg.packageNames;
      }

      if (packagesDownloadsMap[packageName]) {
        return;
      }

      for (const npmPackage of npmPackages) {
        const npmPackageResponse = packagesData[npmPackage];
        if (npmPackageResponse?.downloads) {
          if (!packagesDownloadsMap[packageName]) {
            packagesDownloadsMap[packageName] = new Map();
          }

          if (params.precisionModel === 'sum') {
            for (const item of npmPackageResponse.downloads) {
              let date: Date;
              switch (params.precision) {
                case 'day': {
                  date = startOfDay(parse(item.day, NPM_DATE_FORMAT, new Date()));
                  break;
                }
                case 'week': {
                  date = startOfWeek(parse(item.day, NPM_DATE_FORMAT, new Date()));
                  break;
                }
                case 'month': {
                  date = startOfMonth(parse(item.day, NPM_DATE_FORMAT, new Date()));
                  break;
                }
              }

              const timeStr = date.toISOString();

              if (packagesDownloadsMap[packageName].has(timeStr)) {
                const currentEntry = packagesDownloadsMap[packageName].get(timeStr)!;
                packagesDownloadsMap[packageName].set(timeStr, {
                  ...currentEntry,
                  value: currentEntry.value + item.downloads,
                });
              } else {
                packagesDownloadsMap[packageName].set(timeStr, {
                  time: date,
                  value: item.downloads,
                });
              }
            }
          } else {
            let movingAverageRangeSize: number;
            switch (params.precision) {
              case 'day': {
                movingAverageRangeSize = 1;
                break;
              }
              case 'week': {
                movingAverageRangeSize = 7;
                break;
              }
              case 'month': {
                movingAverageRangeSize = 28;
                break;
              }
            }

            for (
              let i = movingAverageRangeSize - 1;
              i < npmPackageResponse.downloads.length;
              i += 1
            ) {
              const item = npmPackageResponse.downloads[i];
              const date = startOfDay(parse(item.day, NPM_DATE_FORMAT, new Date()));
              const rangeStartDate = subDays(date, movingAverageRangeSize - 1);

              let value = 0;
              let currentDateIndex = i;
              while (
                currentDateIndex >= 0 &&
                !isBefore(
                  parse(
                    npmPackageResponse.downloads[currentDateIndex].day,
                    NPM_DATE_FORMAT,
                    new Date(),
                  ),
                  rangeStartDate,
                )
              ) {
                const currentItem = npmPackageResponse.downloads[currentDateIndex];
                value += Math.round(currentItem.downloads / movingAverageRangeSize);
                currentDateIndex -= 1;
              }

              const timeStr = date.toISOString();
              if (packagesDownloadsMap[packageName].has(timeStr)) {
                const currentEntry = packagesDownloadsMap[packageName].get(timeStr)!;
                packagesDownloadsMap[packageName].set(timeStr, {
                  ...currentEntry,
                  value: currentEntry.value + value,
                });
              } else {
                packagesDownloadsMap[packageName].set(timeStr, {
                  time: date,
                  value,
                });
              }
            }
          }
        }
      }
    };

    for (const pkg of params.packages) {
      buildPackageMap(pkg);
    }

    if (params.referencePackage != null) {
      buildPackageMap(params.referencePackage);
    }

    const referenceDownloadsMap = params.referencePackage
      ? packagesDownloadsMap[getPackageNameFromOption(params.referencePackage)]
      : null;

    const packagesDownloads = params.packages
      .map((item) => {
        const packageName = getPackageNameFromOption(item);
        const downloadsMap = packagesDownloadsMap[packageName];

        if (!downloadsMap) {
          return null;
        }

        const data = Array.from(downloadsMap.entries()).map(([dateStr, item]) => {
          const referenceItem = referenceDownloadsMap?.get(dateStr);
          if (!referenceItem || referenceItem.value === 0) {
            return item;
          }

          const relativeValue = item.value / referenceItem.value;

          return {
            ...item,
            value: Math.floor(relativeValue * 100000) / 1000,
          };
        });

        return {
          packageName,
          data,
        };
      })
      .filter((packageDownloads): packageDownloads is PackageDownloads => !!packageDownloads);

    if (!params.base100) {
      return packagesDownloads;
    }

    return packagesDownloads.map((packageDownloads) => {
      const firstValue = packageDownloads.data.find((item) => item.value > 0)?.value;

      if (firstValue == null) {
        return packageDownloads;
      }

      return {
        ...packageDownloads,
        data: packageDownloads.data.map((item) => ({
          ...item,
          value: (item.value / firstValue) * 100,
        })),
      };
    });
  }, [
    packagesData,
    isLoading,
    params.referencePackage,
    params.packages,
    params.precision,
    params.precisionModel,
    params.base100,
  ]);

  return { data, isLoading };
};
