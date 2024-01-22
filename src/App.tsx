import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import { PackagesDownloads } from "./pages/PackagesDownloads";
import { NPMContext } from "./components/NPMContext";

const customCssBaseline = (
  <GlobalStyles
    styles={{
      body: { width: "100vw", height: "100vh" },
      "& #root": { width: "100vw", height: "100vh" },
    }}
  />
);

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {customCssBaseline}
      <NPMContext>
        <PackagesDownloads />
      </NPMContext>
    </ThemeProvider>
  );
};
