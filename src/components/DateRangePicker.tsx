import React from "react";
import { Dayjs } from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro";
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { TextFieldProps } from "@mui/material";
import { UsePackagesDownloadsParams } from "../hooks/usePackagesDownloads";

interface DateRangePickerProps extends Pick<TextFieldProps, "sx" | "size"> {
  value: UsePackagesDownloadsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}

export const DateRangePicker = (props: DateRangePickerProps) => {
  const { onChange, value, sx, size } = props;

  const [localeValue, setLocaleValue] = React.useState<DateRange<Dayjs>>(
    value.dateRange
  );

  React.useEffect(() => {
    setLocaleValue(value.dateRange);
  }, [value.dateRange]);

  const isInitialRender = React.useRef(true);
  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const t = window.setTimeout(() => {
      onChange((prev) => ({ ...prev, dateRange: localeValue }));
    }, 1000);

    return () => {
      window.clearTimeout(t);
    };
  }, [localeValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SingleInputDateRangeField
      label="Date range"
      value={localeValue as any}
      onChange={setLocaleValue}
      sx={sx}
      size={size}
    />
  );
};
