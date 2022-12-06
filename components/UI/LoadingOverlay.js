import { ActivityIndicator, View, StyleSheet } from "react-native";
import useThemeColors from "../../constants/styles";

const LoadingOverlay = () => {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: colors.primary700,
    },
  });
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
};

export default LoadingOverlay;


