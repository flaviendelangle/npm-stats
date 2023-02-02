import React from "react";
import { Dayjs } from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { TextFieldProps } from "@mui/material";

interface DateRangePickerProps extends Pick<TextFieldProps, "sx" | "size"> {
  value: DateRange<Dayjs>;
  onChange: (newValue: DateRange<Dayjs>) => void;
  format?: string;
}

export const DateRangePicker = (props: DateRangePickerProps) => {
  const { onChange, value, sx, size, format } = props;

  const [localeValue, setLocaleValue] = React.useState<DateRange<Dayjs>>(value);

  React.useEffect(() => {
    setLocaleValue(value);
  }, [value]);

  const isInitialRender = React.useRef(true);
  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const t = window.setTimeout(() => {
      onChange(localeValue);
    }, 1000);

    return () => {
      window.clearTimeout(t);
    };
  }, [localeValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SingleInputDateRangeField
      label="Date range"
      value={localeValue}
      onChange={setLocaleValue}
      sx={sx}
      size={size}
      format={format}
    />
  );
};
