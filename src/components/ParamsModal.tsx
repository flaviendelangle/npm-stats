import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import { AutocompleteValue } from "@mui/base/AutocompleteUnstyled";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useEnhancedEffect from "@mui/utils/useEnhancedEffect";
import { getPackageNameFromOption, PackageOption, PACKAGES } from "../data";
import { DateRangePicker } from "./DateRangePicker";
import { PrecisionPicker } from "./PrecisionPicker";
import { PrecisionModelPicker } from "./PrecisionModelPicker";
import { UsePackagesDownloadsParams } from "../hooks/usePackagesDownloads";

export interface ParamsModalProps {
  value: UsePackagesDownloadsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}

export const ParamsModal = (props: ParamsModalProps) => {
  const { onChange, value: inValue } = props;

  const [value, setValue] = React.useState<UsePackagesDownloadsParams>(inValue);

  useEnhancedEffect(() => {
    setValue(inValue);
  }, [inValue]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePackageNamesChange = (
    event: React.SyntheticEvent,
    packages: AutocompleteValue<PackageOption, true, false, true>
  ) =>
    setValue((prev) => ({
      ...prev,
      packages,
    }));

  const handleReferencePackageNameChange = (
    event: React.SyntheticEvent,
    referencePackage: AutocompleteValue<PackageOption, false, false, true>
  ) =>
    setValue((prev) => ({
      ...prev,
      referencePackage,
    }));

  const handleBase100Change = (event: React.SyntheticEvent, base100: boolean) =>
    setValue((prev) => ({ ...prev, base100 }));

  return (
    <React.Fragment>
      <Tooltip title="More parameters">
        <IconButton onClick={handleOpen}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        components={{
          Backdrop,
        }}
        componentsProps={{
          backdrop: {
            timeout: 500,
          } as any,
        }}
      >
        <DialogTitle variant="h5" component="h2" sx={{ mb: 4 }}>
          Parameters
        </DialogTitle>
        <DialogContent>
          <Stack spacing={4} sx={{ position: "relative", py: 1 }}>
            <DateRangePicker value={value} onChange={setValue} fullWidth />
            <PrecisionPicker value={value} onChange={setValue} fullWidth />
            <PrecisionModelPicker value={value} onChange={setValue} fullWidth />
            <Autocomplete<PackageOption, true, false, true>
              freeSolo
              multiple
              value={value.packages}
              onChange={handlePackageNamesChange}
              options={PACKAGES}
              getOptionLabel={getPackageNameFromOption}
              groupBy={(option) => option.category}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add a package"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
            <Autocomplete<PackageOption, false, false, true>
              freeSolo
              value={value.referencePackage}
              onChange={handleReferencePackageNameChange}
              options={PACKAGES}
              getOptionLabel={getPackageNameFromOption}
              groupBy={(option) => option.category}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Reference package"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
            <FormControlLabel
              control={
                <Switch value={value.base100} onChange={handleBase100Change} />
              }
              label="Base 100"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => setValue(inValue)}
          >
            Reset
          </Button>
          <Button
            onClick={() => {
              onChange(value);
              handleClose();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
