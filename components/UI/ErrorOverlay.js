import { Text, View, StyleSheet } from "react-native";
import useThemeColors from "../../constants/styles";
import Button from "./Button";

const ErrorOverlay = ({ message, onCorfirm }) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: colors.primary700,
    },
    text: {
      color: "white",
      textAlign: "center",
      marginBottom: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
  });
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>An error occurred!</Text>
      <Text style={styles.text}>{message}</Text>
      <Button onPress={onCorfirm}>Okay</Button>
    </View>
  );
};

export default ErrorOverlay;


