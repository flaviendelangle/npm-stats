import * as React from "react";
import { Theme as NivoTheme } from "@nivo/core";
import { useTheme } from "@mui/material/styles";
import { OrdinalColorScaleConfig } from "@nivo/colors";

interface NivoCustomization {
  theme: NivoTheme;
  colors: OrdinalColorScaleConfig;
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

    return {
      theme: nivoTheme,
      colors: { scheme: "dark2" },
    };
  }, [muiTheme]);
};
