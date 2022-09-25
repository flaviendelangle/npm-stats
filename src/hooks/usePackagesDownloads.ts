import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import useSWR from "swr";
import { DateRange } from "@mui/x-date-pickers-pro";
import { Precision } from "../models";

const API_ENDPOINT = "https://api.npmjs.org/downloads/range";
const NPM_DATE_FORMAT = "YYYY-MM-DD";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  window.fetch(input, init).then((res) => res.json());

const multiFetcher = (...urls: string[]) =>
  Promise.all(urls.map((url) => fetcher(url)));

interface Response {
  start: string;
  end: string;
  package: string;
  downloads: { downloads: number; day: string }[];
}

export interface UsePackagesDownloadsParams {
  dateRange: DateRange<Dayjs>;
  packageNames: string[];
  referencePackageName: string | null;
  precision: Precision;
}

export type PackageDownloads = {
  packageName: string;
  data: { time: Dayjs; value: number }[];
};

export const usePackagesDownloads = ({
  dateRange,
  packageNames,
  precision,
}: UsePackagesDownloadsParams) => {
  const endPoints = React.useMemo(() => {
    const [startDate, endDate] = dateRange;

    if (startDate == null || endDate == null) {
      return [];
    }

    if (startDate.isAfter(endDate)) {
      return [];
    }

    return packageNames.map(
      (packageName) =>
        `${API_ENDPOINT}/${startDate.format(NPM_DATE_FORMAT)}:${endDate.format(
          NPM_DATE_FORMAT
        )}/${packageName}`
    );
  }, [dateRange, packageNames]);

  const { data } = useSWR<Response[]>(endPoints, multiFetcher);

  return React.useMemo<PackageDownloads[]>(() => {
    if (!data) {
      return [];
    }

    return data
      .map((packageResponse) => {
        const downloadsMap = new Map<string, { time: Dayjs; value: number }>();

        if (!packageResponse.downloads) {
          return null;
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

          if (downloadsMap.has(timeStr)) {
            const currentEntry = downloadsMap.get(timeStr)!;
            downloadsMap.set(timeStr, {
              ...currentEntry,
              value: currentEntry.value + item.downloads,
            });
          } else {
            downloadsMap.set(timeStr, {
              time: date,
              value: item.downloads,
            });
          }
        }

        return {
          packageName: packageResponse.package,
          data: Array.from(downloadsMap.values()),
        };
      })
      .filter(
        (packageDownloads): packageDownloads is PackageDownloads =>
          !!packageDownloads
      );
  }, [data, precision]);
};
