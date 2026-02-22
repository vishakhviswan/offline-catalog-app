import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
      dark: "#1d4ed8",
      light: "#93c5fd",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#16a34a",
      light: "#bbf7d0",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#16a34a",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      disabled: "#94a3b8",
    },
    divider: "#e2e8f0",
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800, letterSpacing: -0.2 },
    h5: { fontWeight: 700, letterSpacing: -0.1 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    body1: { fontSize: 14 },
    body2: { fontSize: 13, color: "#475569" },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          paddingInline: 18,
          paddingBlock: 10,
          transition: "all 220ms ease",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 999,
        },
      },
    },
  },
});

export default theme;
