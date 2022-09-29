import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro";
import { Precision, PackageOption, getPackageNameFromOption } from "../data";

const API_ENDPOINT = "https://api.npmjs.org/downloads/range";
const NPM_DATE_FORMAT = "YYYY-MM-DD";

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
  base100: boolean;
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
  base100,
}: UsePackagesDownloadsParams) => {
  const [state, setState] = React.useState<{
    responses: { [endpoint: string]: PackageResponse };
    packages: { [npmPackage: string]: PackageResponse };
    isLoading: boolean;
  }>({ responses: {}, packages: {}, isLoading: true });
  const stateRef = React.useRef(state);

  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  React.useEffect(() => {
    const fetchNpmPackageDownloads = async (
      npmPackage: string,
      [startDate, endDate]: [Dayjs, Dayjs]
    ): Promise<{
      aggregatedResponse: PackageResponse | null;
      responses: { [endpoint: string]: PackageResponse };
    }> => {
      const endpoint = `${API_ENDPOINT}/${startDate.format(
        NPM_DATE_FORMAT
      )}:${endDate.format(NPM_DATE_FORMAT)}/${npmPackage}`;

      let data: PackageResponse;

      if (stateRef.current.responses[endpoint]) {
        data = stateRef.current.responses[endpoint];
      } else {
        const response = await window.fetch(endpoint);
        data = await response.json();
      }

      if (!data.downloads) {
        return {
          aggregatedResponse: null,
          responses: {
            [endpoint]: data,
          },
        };
      }

      const responseStart = dayjs(data.start, NPM_DATE_FORMAT);
      if (responseStart.isAfter(startDate)) {
        const nextPages = await fetchNpmPackageDownloads(npmPackage, [
          startDate,
          responseStart.subtract(1, "day"),
        ]);
        if (nextPages.aggregatedResponse) {
          return {
            aggregatedResponse: {
              ...data,
              downloads: [
                ...nextPages.aggregatedResponse.downloads,
                ...data.downloads,
              ],
            },
            responses: {
              ...nextPages.responses,
              [endpoint]: data,
            },
          };
        }
      }

      return {
        aggregatedResponse: data,
        responses: {
          [endpoint]: data,
        },
      };
    };

    const fetcher = async () => {
      const [startDate, endDate] = dateRange;
      if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      const npmPackages = [];
      for (const pkg of packages) {
        if (typeof pkg === "string") {
          npmPackages.push(pkg);
        } else {
          npmPackages.push(pkg.name);
          if (pkg.oldPackageNames) {
            npmPackages.push(...pkg.oldPackageNames);
          }
        }
      }

      await Promise.all(
        npmPackages.map(async (npmPackage) => {
          const packageResponses = await fetchNpmPackageDownloads(npmPackage, [
            startDate,
            endDate,
          ]);
          setState((prev) => ({
            ...prev,
            responses: { ...prev.responses, ...packageResponses.responses },
            packages:
              packageResponses.aggregatedResponse != null
                ? {
                    ...prev.packages,
                    [npmPackage]: packageResponses.aggregatedResponse,
                  }
                : prev.packages,
          }));
        })
      );

      setState((prev) => ({ ...prev, isLoading: false }));
    };

    fetcher();
  }, [packages, referencePackage, dateRange]);

  return React.useMemo<PackageDownloads[]>(() => {
    if (state.isLoading || !state.packages) {
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

      console.log(npmPackages);

      if (packagesDownloadsMap[packageName]) {
        return;
      }

      for (const npmPackage of npmPackages) {
        const npmPackageResponse = state.packages[npmPackage];
        if (npmPackageResponse?.downloads) {
          if (!packagesDownloadsMap[packageName]) {
            packagesDownloadsMap[packageName] = new Map();
          }

          for (let item of npmPackageResponse.downloads) {
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
    };

    for (const pkg of packages) {
      buildPackageMap(pkg);
    }

    if (referencePackage != null) {
      buildPackageMap(referencePackage);
    }

    const referenceDownloadsMap = referencePackage
      ? packagesDownloadsMap[getPackageNameFromOption(referencePackage)]
      : null;

    const packagesDownloads = packages
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

    if (!base100) {
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
    state.packages,
    state.isLoading,
    referencePackage,
    packages,
    precision,
    base100,
  ]);
};
