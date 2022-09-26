import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import useSWR from "swr";
import { DateRange } from "@mui/x-date-pickers-pro";
import { Precision, PackageOption, getPackageNameFromOption } from "../models";

const API_ENDPOINT = "https://api.npmjs.org/downloads/range";
const NPM_DATE_FORMAT = "YYYY-MM-DD";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  window.fetch(input, init).then((res) => res.json());

const multiFetcher = (...urls: string[]) =>
  Promise.all(urls.map((url) => fetcher(url)));

interface PackageResponse {
  start: string;
  end: string;
  package: string;
  downloads: { downloads: number; day: string }[];
}

export interface UsePackagesDownloadsParams {
  dateRange: DateRange<Dayjs>;
  packages: (string | PackageOption)[];
  referencePackage: string | PackageOption | null;
  precision: Precision;
}

export type PackageDownloads = {
  packageName: string;
  data: { time: Dayjs; value: number }[];
};

export const usePackagesDownloads = ({
  dateRange,
  packages,
  referencePackage,
  precision,
}: UsePackagesDownloadsParams) => {
  const endPoints = React.useMemo(() => {
    const getEndpoints = (packageOption: string | PackageOption | null) => {
      const [startDate, endDate] = dateRange;

      if (
        packageOption == null ||
        startDate == null ||
        endDate == null ||
        startDate.isAfter(endDate)
      ) {
        return [];
      }

      let packageNames: string[];
      if (typeof packageOption === "string") {
        packageNames = [packageOption];
      } else {
        packageNames = [
          packageOption.name,
          ...(packageOption.oldPackageNames ?? []),
        ];
      }

      const root = `${API_ENDPOINT}/${startDate.format(
        NPM_DATE_FORMAT
      )}:${endDate.format(NPM_DATE_FORMAT)}`;

      return packageNames.map((packageName) => `${root}/${packageName}`);
    };

    return [
      ...packages.flatMap(getEndpoints),
      ...getEndpoints(referencePackage),
    ];
  }, [packages, referencePackage, dateRange]);

  const packagesResponse = useSWR<PackageResponse[]>(endPoints, multiFetcher);

  return React.useMemo<PackageDownloads[]>(() => {
    if (packagesResponse.isValidating || !packagesResponse.data) {
      return [];
    }

    const packagesDownloadsMap: {
      [name: string]: Map<string, { time: Dayjs; value: number }>;
    } = {};

    for (const packageResponse of packagesResponse.data) {
      if (packageResponse.downloads) {
        const isMatchingPackage = (item: string | PackageOption) => {
          if (typeof item === "string") {
            return item === packageResponse.package;
          }

          return (
            item.name === packageResponse.package ||
            item.oldPackageNames?.includes(packageResponse.package)
          );
        };

        let pkg = packages.find(isMatchingPackage);
        if (!pkg && referencePackage && isMatchingPackage(referencePackage)) {
          pkg = referencePackage;
        }

        if (!pkg) {
          throw new Error(
            `An unwanted package have been downloaded from NPM: ${packageResponse.package}`
          );
        }

        const packageName = getPackageNameFromOption(pkg);

        if (!packagesDownloadsMap[packageName]) {
          packagesDownloadsMap[packageName] = new Map();
        }

        for (let item of packageResponse.downloads) {
          let date: Dayjs;
          switch (precision) {
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

    const referenceDownloadsMap = referencePackage
      ? packagesDownloadsMap[getPackageNameFromOption(referencePackage)]
      : null;

    return packages
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
  }, [
    packagesResponse.data,
    packagesResponse.isValidating,
    referencePackage,
    packages,
    precision,
  ]);
};
