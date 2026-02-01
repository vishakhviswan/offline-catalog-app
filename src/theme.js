import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0EA5A4", // Electric Teal
      dark: "#0F766E",
      light: "#99F6E4",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7C3AED", // Royal Violet
      light: "#EDE9FE",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#F59E0B",
    },
    error: {
      main: "#EF4444",
    },
    success: {
      main: "#22C55E",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
      disabled: "#94A3B8",
    },
    divider: "#E5E7EB",

    /* 👇 helpers for image overlays */
    overlay: {
      dark: "rgba(0,0,0,0.55)",
      light: "rgba(255,255,255,0.7)",
    },
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,

    /* Headings use Poppins for punch */
    h4: {
      fontFamily: `"Poppins", "Inter", sans-serif`,
      fontWeight: 700,
    },
    h5: {
      fontFamily: `"Poppins", "Inter", sans-serif`,
      fontWeight: 600,
    },
    h6: {
      fontFamily: `"Poppins", "Inter", sans-serif`,
      fontWeight: 600,
    },

    subtitle1: {
      fontWeight: 600,
    },

    body1: {
      fontSize: 14,
    },
    body2: {
      fontSize: 13,
      color: "#475569",
    },

    button: {
      fontFamily: `"Poppins", "Inter", sans-serif`,
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: 0.3,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingInline: 18,
          paddingBlock: 10,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
