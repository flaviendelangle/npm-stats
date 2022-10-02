import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro";
import { Precision, PackageOption, getPackageNameFromOption } from "../data";
import { useNpmApi, NPM_DATE_FORMAT } from "../components/NPMContext";

export interface UsePackagesDownloadsParams {
  dateRange: DateRange<Dayjs>;
  packages: (string | PackageOption)[];
  referencePackage: string | PackageOption | null;
  precision: Precision;
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
      const npmPackages =
        typeof pkg === "string"
          ? [pkg]
          : [pkg.name, ...(pkg.oldPackageNames ?? [])];

      if (packagesDownloadsMap[packageName]) {
        return;
      }

      for (const npmPackage of npmPackages) {
        const npmPackageResponse = npmApi.packages[npmPackage];
        if (npmPackageResponse?.downloads) {
          if (!packagesDownloadsMap[packageName]) {
            packagesDownloadsMap[packageName] = new Map();
          }

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
    params.base100,
  ]);
};
