const primaryColor = "#4A80F0"; // Pastel blue
const secondaryColor = "#FF9F7A"; // Pastel orange

export default {
  light: {
    primary: primaryColor,
    secondary: secondaryColor,
    background: "#FFFFFF",
    card: "#F8F9FA",
    text: "#1A1D1F",
    textSecondary: "#6E7787",
    border: "#E8ECF4",
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FFC107",
    info: primaryColor,
  },
  dark: {
    primary: primaryColor,
    secondary: secondaryColor,
    background: "#1A1D1F",
    card: "#2A2D2F",
    text: "#FFFFFF",
    textSecondary: "#9CA3AF",
    border: "#374151",
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FFC107",
    info: primaryColor,
  },
  common: {
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
  },
  gradients: {
    primary: [primaryColor, "#3A66CC"] as const,
    secondary: [secondaryColor, "#FF8A5B"] as const,
  }
};