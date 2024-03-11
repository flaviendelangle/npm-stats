import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Precision,
  PackageOption,
  getPackageNameFromOption,
  DateRange,
  PrecisionModel,
} from "../data";
import { useNpmApi, NPM_DATE_FORMAT } from "../components/NPMContext";

export interface UsePackagesDownloadsParams {
  dateRange: DateRange;
  packages: (string | PackageOption)[];
  referencePackage: string | PackageOption | null;
  precision: Precision;
  precisionModel: PrecisionModel;
  base100: boolean;
}

export type PackageDownloads = {
  packageName: string;
  data: { time: Dayjs; value: number }[];
};

export const usePackagesDownloads = (params: UsePackagesDownloadsParams) => {
  const npmApi = useNpmApi();

  React.useEffect(() => {
    const fetcher = npmApi.fetchPackagesDownloads;

    fetcher({
      dateRange: params.dateRange,
      packages:
        params.referencePackage == null
          ? params.packages
          : [...params.packages, params.referencePackage],
    });
  }, [
    params.packages,
    params.referencePackage,
    params.dateRange,
    npmApi.fetchPackagesDownloads,
  ]);

  return React.useMemo<PackageDownloads[]>(() => {
    if (npmApi.isLoading || !npmApi.packages) {
      return [];
    }

    const packagesDownloadsMap: {
      [name: string]: Map<string, { time: Dayjs; value: number }>;
    } = {};

    const buildPackageMap = (pkg: string | PackageOption) => {
      const packageName = getPackageNameFromOption(pkg);

      let npmPackages: string[];
      if (typeof pkg === "string") {
        npmPackages = [pkg];
      } else if (pkg.packageNames == null) {
        npmPackages = [pkg.name];
      } else {
        npmPackages = pkg.packageNames;
      }

      if (packagesDownloadsMap[packageName]) {
        return;
      }

      for (const npmPackage of npmPackages) {
        const npmPackageResponse = npmApi.packages[npmPackage];
        if (npmPackageResponse?.downloads) {
          if (!packagesDownloadsMap[packageName]) {
            packagesDownloadsMap[packageName] = new Map();
          }

          if (params.precisionModel === "sum") {
            for (let item of npmPackageResponse.downloads) {
              let date: Dayjs;
              switch (params.precision) {
                case "day": {
                  date = dayjs(item.day, NPM_DATE_FORMAT).startOf("day");
                  break;
                }
                case "week": {
                  date = dayjs(item.day, NPM_DATE_FORMAT).startOf("week");
                  break;
                }
                case "month": {
                  date = dayjs(item.day, NPM_DATE_FORMAT).startOf("month");
                  break;
                }
              }

              const timeStr = date.toISOString();

              if (packagesDownloadsMap[packageName].has(timeStr)) {
                const currentEntry =
                  packagesDownloadsMap[packageName].get(timeStr)!;
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
              case "day": {
                movingAverageRangeSize = 1;
                break;
              }
              case "week": {
                movingAverageRangeSize = 7;
                break;
              }
              case "month": {
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
              const date = dayjs(item.day, NPM_DATE_FORMAT).startOf("day");
              const rangeStartDate = date.subtract(
                movingAverageRangeSize - 1,
                "day"
              );

              let value = 0;
              let currentDateIndex = i;
              while (
                currentDateIndex >= 0 &&
                !dayjs(
                  npmPackageResponse.downloads[currentDateIndex].day
                ).isBefore(rangeStartDate)
              ) {
                const currentItem =
                  npmPackageResponse.downloads[currentDateIndex];
                value += Math.round(
                  currentItem.downloads / movingAverageRangeSize
                );
                currentDateIndex -= 1;
              }

              const timeStr = date.toISOString();
              if (packagesDownloadsMap[packageName].has(timeStr)) {
                const currentEntry =
                  packagesDownloadsMap[packageName].get(timeStr)!;
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

        const data = Array.from(downloadsMap.entries()).map(
          ([dateStr, item]) => {
            const referenceItem = referenceDownloadsMap?.get(dateStr);
            if (!referenceItem || referenceItem.value === 0) {
              return item;
            }

            const relativeValue = item.value / referenceItem.value;

            return {
              ...item,
              value: Math.floor(relativeValue * 100000) / 1000,
            };
          }
        );

        return {
          packageName,
          data,
        };
      })
      .filter(
        (packageDownloads): packageDownloads is PackageDownloads =>
          !!packageDownloads
      );

    if (!params.base100) {
      return packagesDownloads;
    }

    return packagesDownloads.map((packageDownloads) => {
      const firstValue = packageDownloads.data.find(
        (item) => item.value > 0
      )?.value;

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
    npmApi.packages,
    npmApi.isLoading,
    params.referencePackage,
    params.packages,
    params.precision,
    params.precisionModel,
    params.base100,
  ]);
};
