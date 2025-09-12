import { useState, useEffect } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./styles/theme";
import { getMuiTheme } from "./styles/muiTheme";
import styled from "styled-components";
import { GlobalStyle } from "./styles/global";

const AppSection = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.background};
`;

const ThemeButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <MuiThemeProvider theme={getMuiTheme(isDarkMode)}>
      <SCThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <GlobalStyle />
        <AppSection>
          <ThemeButton onClick={toggleTheme}>
            {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
          </ThemeButton>
          <AppRoutes />
        </AppSection>
      </SCThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
