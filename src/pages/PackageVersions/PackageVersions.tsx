import React from "react";
import dayjs from "dayjs";
import { Page } from "../../components/Page";
import {
  usePackageVersions,
  UsePackageVersionsParams,
} from "../../hooks/usePackageVersions";
import { Parameters } from "./Parameters";

export const PackageVersions = () => {
  const [parameters, setParameters] = React.useState<UsePackageVersionsParams>(
    () => {
      const startOfMonth = dayjs().startOf("month");

      return {
        dateRange: [startOfMonth.subtract(1, "year"), startOfMonth],
        package: "@mui/x-data-grid",
      };
    }
  );

  usePackageVersions(parameters);

  return (
    <Page actions={<Parameters value={parameters} onChange={setParameters} />}>
      WIP
    </Page>
  );
};
