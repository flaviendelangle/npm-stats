import React from "react";
import {
  usePackagesDownloads,
  UsePackagesDownloadsParams,
} from "../../hooks/usePackagesDownloads";
import { DownloadCharts } from "../../components/DownloadCharts";
import { applyPreset } from "../../components/PresetPicker";
import { Page } from "../../components/Page";
import { Parameters } from "./Parameters";
import queryString from "query-string";
import { Precision, PrecisionModel } from "../../data";

export const PackagesDownloads = () => {
  const [parameters, setParameters] =
    React.useState<UsePackagesDownloadsParams>(() => {
      const queryParams = queryString.parse(document.location.search);

      return applyPreset(
        {
          precision: (queryParams.precision as Precision) ?? "week",
          precisionModel:
            (queryParams.precisionModel as PrecisionModel) ?? "sum",
          base100: queryParams.base100 === "true",
          dateRange: "last-year",
        },
        "MUI X packages"
      );
    });

  React.useEffect(() => {
    const queryParams = {
      ...queryString.parse(document.location.search),
      ...parameters,
    };

    window.history.replaceState(
      null,
      "",
      `?${queryString.stringify(queryParams)}`
    );
  }, [parameters]);

  const packages = usePackagesDownloads(parameters);

  return (
    <Page actions={<Parameters value={parameters} onChange={setParameters} />}>
      <DownloadCharts packages={packages} parameters={parameters} />
    </Page>
  );
};
