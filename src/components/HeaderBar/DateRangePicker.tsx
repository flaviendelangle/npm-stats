import React from "react";
import { Dayjs } from "dayjs";
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { TextFieldProps } from "@mui/material";
import { HeaderBarProps } from "./HeaderBar.types";
import { DateRange } from "@mui/x-date-pickers-pro";

interface DateRangePickerProps
  extends HeaderBarProps,
    Pick<TextFieldProps, "sx" | "size"> {}

export const DateRangePicker = (props: DateRangePickerProps) => {
  const { onChange, value, sx, size } = props;

  const handleDateRangeChange = (dateRange: DateRange<Dayjs>) =>
    onChange((prev) => ({ ...prev, dateRange }));

  return (
    <SingleInputDateRangeField
      label="Date range"
      value={value.dateRange as any}
      onChange={handleDateRangeChange}
      sx={sx}
      size={size}
    />
  );
};
