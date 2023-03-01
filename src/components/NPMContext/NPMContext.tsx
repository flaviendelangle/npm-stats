import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro";
import { PackageOption } from "../../data";

const API_ENDPOINT = "https://api.npmjs.org/downloads";
export const NPM_DATE_FORMAT = "YYYY-MM-DD";

interface PackageResponse {
  start: string;
  end: string;
  package: string;
  downloads: { downloads: number; day: string }[];
}

interface NPMContextState {
  responses: { [endpoint: string]: PackageResponse };
  packages: { [npmPackage: string]: PackageResponse };
  isLoading: boolean;
}

interface NPMContextValue
  extends Pick<NPMContextState, "packages" | "isLoading"> {
  fetchPackagesDownloads: (params: {
    dateRange: DateRange<Dayjs>;
    packages: (string | PackageOption)[];
  }) => Promise<void>;
}

const Context = React.createContext<NPMContextValue>({} as NPMContextValue);

export const NPMContext = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = React.useState<NPMContextState>({
    responses: {},
    packages: {},
    isLoading: true,
  });
  const stateRef = React.useRef(state);

  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const fetchNpmPackageDownloads = React.useCallback(
    async (
      npmPackage: string,
      [startDate, endDate]: [Dayjs, Dayjs]
    ): Promise<{
      aggregatedResponse: PackageResponse | null;
      responses: { [endpoint: string]: PackageResponse };
    }> => {
      const startDateStr = startDate.format(NPM_DATE_FORMAT);
      const endDateStr = endDate.format(NPM_DATE_FORMAT);
      const endpoint = `${API_ENDPOINT}/range/${startDateStr}:${endDateStr}/${npmPackage}`;

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
    },
    []
  );

  const fetchPackagesDownloads = React.useCallback<
    NPMContextValue["fetchPackagesDownloads"]
  >(
    async ({ dateRange, packages }) => {
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
          if (pkg.packageNames) {
            npmPackages.push(...pkg.packageNames);
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
    },
    [fetchNpmPackageDownloads]
  );

  const context = React.useMemo(
    () => ({
      isLoading: state.isLoading,
      packages: state.packages,
      fetchPackagesDownloads,
    }),
    [state.isLoading, state.packages, fetchPackagesDownloads]
  );

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useNpmApi = () => React.useContext(Context);
