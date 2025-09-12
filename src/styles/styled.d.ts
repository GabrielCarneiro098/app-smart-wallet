import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      textSecondary: string;
      border: string;
      chart: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}
