import React from "react";
import Box from "@mui/material/Box";
import {
  usePackagesDownloads,
  UsePackagesDownloadsParams,
} from "./hooks/usePackagesDownloads";
import { HeaderBar } from "./components/HeaderBar";
import { DownloadCharts } from "./components/DownloadCharts";
import dayjs from "dayjs";

function App() {
  const [parameters, setParameters] =
    React.useState<UsePackagesDownloadsParams>(() => {
      const yesterday = dayjs().subtract(1, "day").startOf("day");

      return {
        packageNames: ["@mui/x-data-grid-pro", "@mui/x-data-grid-premium"],
        referencePackageName: "@mui/material",
        dateRange: [yesterday.subtract(1, "year"), yesterday],
        precision: "week",
      };
    });

  const packages = usePackagesDownloads(parameters);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeaderBar value={parameters} onChange={setParameters} />
      <Box sx={{ p: 2, flex: "1 1 100%", overflow: "hidden" }}>
        <DownloadCharts packages={packages} />
      </Box>
    </Box>
  );
}

export default App;
