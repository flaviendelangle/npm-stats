import React from "react";
import dayjs from "dayjs";
import {
  usePackagesDownloads,
  UsePackagesDownloadsParams,
} from "../../hooks/usePackagesDownloads";
import { DownloadCharts } from "../../components/DownloadCharts";
import { applyPreset } from "../../components/PresetPicker";
import { Page } from "../../components/Page";
import { Parameters } from "./Parameters";

export const PackagesDownloads = () => {
  const [parameters, setParameters] =
    React.useState<UsePackagesDownloadsParams>(() => {
      const yesterday = dayjs().subtract(1, "day").startOf("day");

      return applyPreset(
        {
          dateRange: [yesterday.subtract(1, "year"), yesterday],
          precision: "week",
          base100: false,
        },
        "MUI packages"
      );
    });

  const packages = usePackagesDownloads(parameters);

  return (
    <Page actions={<Parameters value={parameters} onChange={setParameters} />}>
      <DownloadCharts packages={packages} />
    </Page>
  );
};
