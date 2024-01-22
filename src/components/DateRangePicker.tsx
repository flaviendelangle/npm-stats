import React from "react";
import ToggleButtonGroup, {
  ToggleButtonGroupProps,
} from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { UsePackagesDownloadsParams } from "../hooks/usePackagesDownloads";
import { DateRange } from "../data";

interface PrecisionPickerProps
  extends Pick<ToggleButtonGroupProps, "size" | "fullWidth"> {
  value: UsePackagesDownloadsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}

export const DateRangePicker = (props: PrecisionPickerProps) => {
  const { onChange, value, size, fullWidth } = props;

  const handleDateRangeChange = (
    event: React.MouseEvent,
    dateRange: DateRange
  ) => {
    if (!dateRange) {
      return;
    }

    onChange((prev) => ({
      ...prev,
      dateRange,
    }));
  };

  return (
    <ToggleButtonGroup
      exclusive
      size={size}
      fullWidth={fullWidth}
      value={value.dateRange}
      onChange={handleDateRangeChange}
    >
      <ToggleButton value="last-five-years">5 years</ToggleButton>
      <ToggleButton value="last-two-years">2 years</ToggleButton>
      <ToggleButton value="last-year">1 year</ToggleButton>
      <ToggleButton value="last-six-months">6 months</ToggleButton>
      <ToggleButton value="last-month">1 month</ToggleButton>
    </ToggleButtonGroup>
  );
};
