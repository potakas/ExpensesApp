import { Pressable, StyleSheet, Text, View } from 'react-native';

import useThemeColors from "../../constants/styles";

function FlatButton({ children, onPress }) {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    button: {
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    pressed: {
      opacity: 0.7,
    },
    buttonText: {
      textAlign: 'center',
      color: colors.primary100,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default FlatButton;


