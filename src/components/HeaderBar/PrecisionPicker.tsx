import ToggleButtonGroup, {
  ToggleButtonGroupProps,
} from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import React from "react";
import { HeaderBarProps } from "./HeaderBar.types";
import { Precision } from "../../data";

interface PrecisionPickerProps
  extends HeaderBarProps,
    Pick<ToggleButtonGroupProps, "size" | "fullWidth"> {}

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
