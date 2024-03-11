import * as React from "react";
import dayjs from "dayjs";
import dayjsWeekOfYear from "dayjs/plugin/weekOfYear";
import { LineChart, LineChartProps } from "@mui/x-charts/LineChart";
import {
  PackageDownloads,
  UsePackagesDownloadsParams,
} from "../../hooks/usePackagesDownloads";

dayjs.extend(dayjsWeekOfYear);

interface DownloadChartsProps {
  packages: PackageDownloads[];
  parameters: UsePackagesDownloadsParams;
}

const DownloadCharts = ({ packages, parameters }: DownloadChartsProps) => {
  const series = React.useMemo<LineChartProps["series"]>(() => {
    // if (false) {
    //   return packages
    //     .map((npmPackage) => ({
    //       name: npmPackage.packageName,
    //       type: "bar",
    //       data: npmPackage.data.slice(1).map((item, itemIndex) => {
    //         const growth = item.value / npmPackage.data[itemIndex].value - 1;
    //         return [item.time.toDate(), growth] as const;
    //       }),
    //     }))
    //     .sort(
    //       (a, b) => b.data[b.data.length - 1][1] - a.data[a.data.length - 1][1]
    //     );
    // }

    return packages
      .map((npmPackage) => ({
        label: npmPackage.packageName,
        // showSymbol: false,
        data: npmPackage.data.map((item) => item.value),
        showMark: false,
      }))
      .sort((a, b) => b.data[b.data.length - 1] - a.data[a.data.length - 1]);
  }, [packages]);

  const xAxis = React.useMemo<LineChartProps["xAxis"]>(() => {
    if (packages.length === 0) {
      return undefined;
    }

    return [
      {
        scaleType: "time",
        data: packages[0].data.map((item) => item.time.toDate()),
        valueFormatter: (date: Date) => {
          if (parameters.precisionModel === "movingAverage") {
            return dayjs(date).format("DD/MM/YYYY");
          }

          if (parameters.precision === "month") {
            return dayjs(date).format("MMMM YYYY");
          }

          if (parameters.precision === "week") {
            return `Week ${dayjs(date).get("week" as any)}`;
          }

          return dayjs(date).format("DD/MM/YYYY");
        },
      },
    ];
  }, [packages, parameters.precision, parameters.precisionModel]);

  return (
    <LineChart
      xAxis={xAxis}
      yAxis={[{ min: 0 }]}
      series={series}
      grid={{ horizontal: true }}
      skipAnimation
    />
  );
};

export default DownloadCharts;
