import { createTheme, Shadows, ThemeOptions, Theme } from "@mui/material/styles";
import { neutral, Slate, red, blue, yellow, successGreen, lavender, essentials, ui, hexToRgba } from "./primitives";

// Import required fonts
import "@fontsource/poppins/400.css"; // Regular weight
import "@fontsource/poppins/600.css"; // Semi-bold weight
import "@fontsource/poppins/700.css"; // Bold weight
import "@fontsource/inter/400.css"; // Regular weight
import "@fontsource/inter/600.css"; // Semi-bold weight

// Define interface for custom shape
interface ExtendedShape {
  borderRadius: number;
  borderRadiusSmall: number;
}

// Custom shadows from the original ui-kit theme
const customShadows: Shadows = [
  "none",
  "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  "0px 4px 8px rgba(0,0,0,0.1)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)"
];

const themeOptions = {
  palette: {
    primary: {
      main: Slate[700], // Use frontend's primary color
      contrastText: essentials.white,
    },
    secondary: {
      main: Slate[900],
      contrastText: essentials.white,
    },
    error: {
      main: red[600],
      dark: red[800],
      contrastText: neutral[25],
    },
    warning: {
      main: yellow[600],
      contrastText: neutral[25],
    },
    success: {
      main: successGreen[600],
      dark: successGreen[700],
      contrastText: neutral[25],
    },
    info: {
      main: blue[600],
    },
    background: {
      default: ui.background, // "#FBFBFB"
      paper: neutral[25],
    },
    text: {
      primary: neutral[700],
      secondary: neutral[500],
      disabled: neutral[400],
    },
    action: {
      disabledBackground: neutral[100],
      disabled: neutral[400],
    },
    // Extended palette from frontend theme
    close: {
      main: neutral[600],
      contrastText: essentials.white,
    },
    white: {
      main: essentials.white,
      contrastText: essentials.black,
    },
    gray: {
      main: neutral[400],
      contrastText: essentials.black,
    },
    charcoal: {
      main: essentials.charcoal,
      contrastText: essentials.white,
    },
    chalkboard: {
      main: Slate[900],
      contrastText: essentials.white,
    },
    mint: {
      main: Slate[400],
      contrastText: essentials.white,
    },
    chalk: {
      main: essentials.chalk,
      contrastText: essentials.black,
    },
    black: {
      main: essentials.black,
      contrastText: essentials.chalk,
    },
    lightPink: {
      main: red[25],
      contrastText: red[800],
    },
    lightBlue: {
      main: blue[25],
      contrastText: blue[600],
    },
    lightOrange: {
      main: yellow[25],
      contrastText: yellow[700],
    },
    lightGreen: {
      main: successGreen[25],
      contrastText: successGreen[900],
    },
    lightPurple: {
      main: lavender[25],
      contrastText: lavender[600],
    },
    surfaceGreen: {
      main: Slate[25],
      contrastText: Slate[900],
    },
    safetyLevelColor: {
      main: blue[300],
      contrastText: essentials.white,
    },
    targetLevelColor: {
      main: Slate[400],
      contrastText: Slate[25],
    },
    reachLevelColor: {
      main: yellow[400],
      contrastText: essentials.softWhite,
    },
    farReachLevelColor: {
      main: red[300],
      contrastText: essentials.white,
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      // Display heading
      fontSize: 30,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600, // Semi bold
      lineHeight: "36px",
      letterSpacing: "-0.02em", // -2%
      color: Slate[700],
    },
    h2: {
      // Section heading
      fontSize: 26,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600, // Semi bold
      lineHeight: "32px",
      letterSpacing: "-0.015em", // -1.5%
      color: Slate[700],
    },
    h3: {
      // Subsection heading
      fontSize: 22,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600, // Semi bold
      lineHeight: "28px",
      letterSpacing: "-0.01em", // -1%
      color: neutral[900],
    },
    h4: {
      // Body heading
      fontSize: 18,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600, // Semi bold
      lineHeight: "24px",
      letterSpacing: "-0.005em", // -0.5%
      color: neutral[900],
    },
    h5: {
      // Group heading
      fontSize: 14,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600, // Semi bold
      lineHeight: "20px",
      letterSpacing: "0", // 0%
      color: neutral[900],
    },
    h6: {
      // Keeping h6 to maintain backward compatibility
      fontSize: 14,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600, // Semi bold
      lineHeight: "20px",
      letterSpacing: "0",
      color: neutral[900],
    },
    subHeading: {
      fontSize: 18,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
    },
    body1: {
      fontSize: 13,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
    },
    body2: {
      fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
    },
    cardProviderName: {
      fontSize: 16,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      color: Slate[400],
    },
    cardLocation: {
      fontSize: 12,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
      color: essentials.black,
    },
    cardProgramName: {
      fontSize: 20,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      color: essentials.chalk,
    },
    pageTitle: {
      fontSize: 30,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      color: Slate[800],
    },
    cardTitle: {
      fontSize: 14,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    cardDescription: {
      fontSize: 14,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
    },
    // New text styles with Inter font
    bodyLarge: {
      fontSize: 16,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400, // Regular
      lineHeight: "24px",
      letterSpacing: "0",
    },
    bodyLargeSemibold: {
      fontSize: 16,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600, // Semi bold
      lineHeight: "24px",
      letterSpacing: "0",
    },
    bodyDefault: {
      fontSize: 14,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400, // Regular
      lineHeight: "20px",
      letterSpacing: "0",
    },
    bodyDefaultSemibold: {
      fontSize: 14,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600, // Semi bold
      lineHeight: "20px",
      letterSpacing: "0",
    },
    bodySmall: {
      fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400, // Regular
      lineHeight: "16px",
      letterSpacing: "0",
    },
    bodySmallSemibold: {
      fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600, // Semi bold
      lineHeight: "16px",
      letterSpacing: "0",
    },
    tableHeading: {
      fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600, // Semi bold
      lineHeight: "16px",
      letterSpacing: "0",
    },
  },
  shape: {
    borderRadius: 12,
    borderRadiusSmall: 8,
  } as ExtendedShape,
  shadows: customShadows,
  components: {
    // Base MUI Button styling
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          textTransform: "none", // Prevent uppercase text
        },
      },
    },
    // Willow-specific Button styling
    WillowButton: {
      styleOverrides: {
        root: ({ ownerState, theme }: { ownerState: Record<string, unknown>; theme: Theme }) => {
          const t = theme as Theme;
          return {
            fontFamily: t.typography.fontFamily,
            fontWeight: 600,
            textTransform: "none",
            border: "1px solid transparent",
            transition: t.transitions.create([
              "background-color",
              "box-shadow",
              "border-color",
              "color",
            ]),
            // --- Primary Variant ---
            ...(ownerState.variant === "primary" && {
              backgroundColor: t.palette.primary.main,
              color: t.palette.primary.contrastText,
              boxShadow: t.shadows[2],
              "&:hover": {
                backgroundColor: t.palette.primary.dark,
                boxShadow: t.shadows[3],
              },
              "&:active": {
                backgroundColor: Slate[800],
                boxShadow: t.shadows[1],
              },
              "&:focus-visible": {
                outline: "none",
                boxShadow: `0 0 0 4px ${hexToRgba(t.palette.primary.main, 0.2)}`,
              },
            }),
            ...(ownerState.size === "small" && {
              height: "32px",
              padding: "8px 12px",
              gap: "4px",
              borderRadius: (t.shape as ExtendedShape).borderRadiusSmall,
            }),
            ...(ownerState.size === "medium" && {
              height: "40px",
              padding: "8px 18px",
              gap: "8px",
              borderRadius: t.shape.borderRadius,
            }),
            ...(ownerState.size === "large" && {
              height: "46px",
              padding: "8px 20px",
              gap: "8px",
              borderRadius: t.shape.borderRadius,
            }),
            "&.Mui-disabled": {
              backgroundColor: t.palette.action.disabledBackground,
              color: t.palette.action.disabled,
              border: "1px solid transparent",
            },
          };
        },
      },
    },
    // Paper component styling from frontend
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: "12px",
          border: `1px solid ${neutral[300]}`,
          "&:hover": {
            boxShadow: "none",
            border: `1px solid ${neutral[300]}`,
          },
        },
      },
    },
    // TextField styling from frontend
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            "& .MuiOutlinedInput-input": {
              padding: "10px 14px",
            },
            "& fieldset": {
              border: `1px solid ${neutral[300]}`,
            },
            "&:hover fieldset": {
              border: `1px solid ${neutral[300]}`,
            },
            "&.Mui-focused fieldset": {
              border: `1px solid ${neutral[300]}`,
            },
          },
        },
      },
    },
    // OutlinedInput styling from frontend
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          "& .MuiOutlinedInput-input": {
            padding: "10px 14px",
          },
          "& .MuiSelect-select": {
            padding: "10px 14px",
          },
          "& fieldset": {
            border: `1px solid ${neutral[300]}`,
          },
          "&:hover fieldset": {
            border: `1px solid ${neutral[300]}`,
          },
          "&.Mui-focused fieldset": {
            border: `1px solid ${neutral[300]}`,
          },
        },
      },
    },
    // Dialog styling from frontend
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: "'Poppins', sans-serif",
          fontSize: "18px",
          fontWeight: 600,
          textAlign: "center",
        },
      },
    },
    // Chip styling from frontend
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-sizeSmall": {
            padding: "2px 8px",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "18px",
          },
          "&.MuiChip-sizeMedium": {
            padding: "4px 12px",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
          },
          "&.MuiChip-sizeLarge": {
            padding: "6px 16px",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
          },
        },
        label: {
          padding: 0,
        },
      },
      defaultProps: {
        size: "small",
      },
    },
  },
} as unknown as ThemeOptions;

export const createWillowTheme = () => createTheme(themeOptions);
export const theme = createWillowTheme();
export default theme;
