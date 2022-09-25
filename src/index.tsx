import * as React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import App from "./App";
import theme from "./theme";
import GlobalStyles from "@mui/material/GlobalStyles";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

const customCssBaseline = (
  <GlobalStyles
    styles={{ body: { height: "100vh" }, "& #root": { height: "100vh" } }}
  />
);

root.render(
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      {customCssBaseline}
      <App />
    </LocalizationProvider>
  </ThemeProvider>
);
