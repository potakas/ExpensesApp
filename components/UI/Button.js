import { Pressable, Text, View, StyleSheet } from "react-native";
import useThemeColors from "../../constants/styles";

const Button = ({ children, onPress, mode, style }) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    button: {
      borderRadius: 4,
      padding: 8,
      backgroundColor: colors.primary500,
    },
    flat: {
      backgroundColor: "transparent",
    },
    buttonText: {
      color: "white",
      textAlign: "center",
    },
    flatText: {
      color: colors.primary100,
    },
    pressed: {
      opacity: 0.75,
      backgroundColor: colors.primary200,
      borderRadius: 4,
    },
  });
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={[styles.button, mode === "flat" && styles.flat]}>
          <Text style={[styles.buttonText, mode === "flat" && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default Button;


