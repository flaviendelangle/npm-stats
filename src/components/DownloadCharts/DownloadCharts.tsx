import * as React from "react";
import ReactECharts from "echarts-for-react";
import { useEchartsTheme } from "../../hooks/useEchartsTheme";
import { PackageDownloads } from "../../hooks/usePackagesDownloads";

interface DownloadChartsProps {
  packages: PackageDownloads[];
}

const DownloadCharts = ({ packages }: DownloadChartsProps) => {
  const addTheme = useEchartsTheme();

  const series = React.useMemo(() => {
    if (false) {
      return packages
        .map((npmPackage) => ({
          name: npmPackage.packageName,
          type: "bar",
          data: npmPackage.data.slice(1).map((item, itemIndex) => {
            const growth = item.value / npmPackage.data[itemIndex].value - 1;
            return [item.time.toDate(), growth] as const;
          }),
        }))
        .sort(
          (a, b) => b.data[b.data.length - 1][1] - a.data[a.data.length - 1][1]
        );
    }

    return packages
      .map((npmPackage) => ({
        name: npmPackage.packageName,
        type: "line",
        showSymbol: false,
        data: npmPackage.data.map(
          (item) => [item.time.toDate(), item.value] as const
        ),
      }))
      .sort(
        (a, b) => b.data[b.data.length - 1][1] - a.data[a.data.length - 1][1]
      );
  }, [packages]);

  return (
    <ReactECharts
      key={Math.random()}
      style={{ height: "100%", width: "100%" }}
      option={addTheme({
        series,
        grid: { top: 0, right: 100, bottom: 48, left: 72 },
        tooltip: {
          trigger: "axis",
        },
        xAxis: { type: "time" },
        yAxis: { type: "value" },
      })}
    />
  );
};

export default DownloadCharts;
