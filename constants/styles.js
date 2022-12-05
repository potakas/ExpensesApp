import { useColorScheme } from "react-native";

const GlobalStyles = {
  dark: {
    primary50: "#D0D0D0",
    primary100: "#B0B0B0",
    primary200: "#909090",
    primary400: "#707070",
    primary500: "#505050",
    primary700: "#303030",
    primary800: "#101010",
    accent500: "#0cf718",
    error50: "#fcc4c4",
    error500: "#9b0909",
    gray500: "#39324a",
    gray700: "#221c30",
  },
  light: {
    primary50: "#d9fcfd",
    primary100: "#aff0fc",
    primary200: "#81dff0",
    primary400: "#21b9d4",
    primary500: "#04a6c3",
    primary700: "#066489",
    primary800: "#034d64",
    accent500: "#e0f70c",
    error50: "#fcc4e4",
    error500: "#9b095c",
    gray500: "#39324a",
    gray700: "#221c30",
  },
};

const useThemeColors = () => {
  const colorScheme = useColorScheme();
  console.log(colorScheme);
  const colors = GlobalStyles[colorScheme];
  console.log(colors);

  return colors;
};

export default useThemeColors;
