import { useState, useEffect } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/theme";
import styled from "styled-components";

const AppSection = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.background};
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🔹 Carrega tema salvo no localStorage ao iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  // 🔹 Atualiza localStorage sempre que mudar o tema
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AppSection>
        <button onClick={toggleTheme}>
          {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
        </button>
        <AppRoutes />
      </AppSection>
    </ThemeProvider>
  );
}

export default App;
