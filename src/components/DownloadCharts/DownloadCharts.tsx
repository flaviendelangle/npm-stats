import * as React from "react";
import { ResponsiveLine, Serie } from "@nivo/line";
import { useNivoCustomization } from "../../hooks/useNivoCustomization";
import { PackageDownloads } from "../../hooks/usePackagesDownloads";

interface DownloadChartsProps {
  packages: PackageDownloads[];
}

const DownloadCharts = ({ packages }: DownloadChartsProps) => {
  const nivoCustomization = useNivoCustomization();

  const data = React.useMemo<Serie[]>(
    () =>
      packages.map((npmPackage) => ({
        id: npmPackage.packageName,
        data: npmPackage.data.map((item) => ({
          x: item.time.format("YYYY-MM-DD"),
          y: item.value,
        })),
      })),
    [packages]
  );

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 0, right: 100, bottom: 48, left: 72 }}
      enableGridX={false}
      pointSize={0}
      enableSlices="x"
      pointLabelYOffset={0}
      yFormat={(value) => value.toLocaleString()}
      legends={[
        {
          anchor: "top-left",
          direction: "column",
          translateY: 12,
          translateX: 48,
          itemWidth: 40,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
      axisLeft={{
        legend: "Downloads",
        legendPosition: "middle",
        legendOffset: -56,
        format: (value) => value.toLocaleString(),
      }}
      {...nivoCustomization}
    />
  );
};

export default DownloadCharts;
