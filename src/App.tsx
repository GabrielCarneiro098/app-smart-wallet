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
        <ThemeButton onClick={toggleTheme}>
          {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
        </ThemeButton>
        <AppRoutes />
      </AppSection>
    </ThemeProvider>
  );
}

export default App;
