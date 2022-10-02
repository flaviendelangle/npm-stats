import ToggleButtonGroup, {
  ToggleButtonGroupProps,
} from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import React from "react";
import { Precision } from "../data";
import { UsePackagesDownloadsParams } from "../hooks/usePackagesDownloads";

interface PrecisionPickerProps
  extends Pick<ToggleButtonGroupProps, "size" | "fullWidth"> {
  value: UsePackagesDownloadsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}

export const PrecisionPicker = (props: PrecisionPickerProps) => {
  const { onChange, value, size, fullWidth } = props;

  const handlePrecisionChange = (
    event: React.MouseEvent,
    precision: Precision
  ) => {
    if (!precision) {
      return;
    }

    onChange((prev) => ({
      ...prev,
      precision,
    }));
  };

  return (
    <ToggleButtonGroup
      exclusive
      size={size}
      fullWidth={fullWidth}
      value={value.precision}
      onChange={handlePrecisionChange}
    >
      <ToggleButton value="day">Daily</ToggleButton>
      <ToggleButton value="week">Weekly</ToggleButton>
      <ToggleButton value="month">Monthly</ToggleButton>
    </ToggleButtonGroup>
  );
};
