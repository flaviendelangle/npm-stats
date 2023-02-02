import * as React from "react";
import { Dayjs } from "dayjs";
import { useNpmApi } from "../components/NPMContext";
import { DateRange } from "@mui/x-date-pickers-pro";
import { PackageOption } from "../data";

export interface UsePackageVersionsParams {
  dateRange: DateRange<Dayjs>;
  package: string | PackageOption;
}

export const usePackageVersions = (params: UsePackageVersionsParams) => {
  const npmApi = useNpmApi();

  React.useEffect(() => {
    const fetcher = npmApi.fetchPackageVersions;

    fetcher({
      dateRange: params.dateRange,
      package: params.package,
    });
  }, [params.package, params.dateRange, npmApi.fetchPackageVersions]);
};
