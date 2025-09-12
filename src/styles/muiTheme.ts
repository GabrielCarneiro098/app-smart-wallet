import { createTheme } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";

export const getMuiTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: lightTheme.colors.primary,
      },
      background: {
        default: isDarkMode
          ? darkTheme.colors.background
          : lightTheme.colors.background,
        paper: isDarkMode ? darkTheme.colors.card : lightTheme.colors.card,
      },
      text: {
        primary: isDarkMode ? darkTheme.colors.text : lightTheme.colors.text,
        secondary: isDarkMode
          ? darkTheme.colors.textSecondary
          : lightTheme.colors.textSecondary,
      },
    },
    shape: {
      borderRadius: parseInt(lightTheme.borderRadius.md),
    },
  });
