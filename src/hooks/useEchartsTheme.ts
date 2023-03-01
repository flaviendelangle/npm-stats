import { useTheme } from "@mui/material/styles";

export const useEchartsTheme = () => {
  const muiTheme = useTheme();

  return (options: any) => ({
    ...options,
    theme: "dark",
    backgroundColor: muiTheme.palette.background.default,
    color: [
      "#ffa600",
      "#ff7c43",
      "#f95d6a",
      "#d45087",
      "#a05195",
      "#665191",
      "#2f4b7c",
      "#003f5c",
    ],
    textStyle: {
      color: muiTheme.palette.text.primary,
    },
    tooltip: {
      backgroundColor: muiTheme.palette.background.paper,
      textStyle: {
        color: muiTheme.palette.text.primary,
      },
      ...options.tooltip,
    },
    legend: {
      textStyle: {
        color: muiTheme.palette.text.primary,
      },
      ...options.legend,
    },
    label: {
      textStyle: {
        color: muiTheme.palette.text.primary,
      },
      ...options.label,
    },
  });
};
