import * as React from "react";
import { Theme as NivoTheme } from "@nivo/core";
import { useTheme } from "@mui/material/styles";

interface NivoCustomization {
  theme: NivoTheme;
  colors: string[];
}

export const useNivoCustomization = () => {
  const muiTheme = useTheme();

  return React.useMemo<NivoCustomization>(() => {
    const nivoTheme: NivoTheme = {
      textColor: muiTheme.palette.text.primary,
      tooltip: {
        container: {
          backgroundColor: muiTheme.palette.background.default,
        },
      },
      labels: {
        text: {
          color: "green",
        },
      },
      grid: {
        line: {
          stroke: muiTheme.palette.grey["400"],
        },
      },
      crosshair: {
        line: {
          stroke: muiTheme.palette.grey["700"],
        },
      },
    };

    const colors = [
      "#ffa600",
      "#ff7c43",
      "#f95d6a",
      "#d45087",
      "#a05195",
      "#665191",
      "#2f4b7c",
      "#003f5c",
    ];

    return {
      theme: nivoTheme,
      colors,
    };
  }, [muiTheme]);
};
