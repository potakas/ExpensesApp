import { Text, TextInput, View, StyleSheet } from "react-native";
import useThemeColors from "../../constants/styles";

const Input = ({ label, invalid, style, textInputConfig }) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    inputContainer: {
      marginHorizontal: 4,
      marginVertical: 8,
    },
    label: {
      fontSize: 12,
      color: colors.primary100,
      marginBottom: 4,
    },
    input: {
      backgroundColor: colors.primary100,
      padding: 6,
      borderRadius: 6,
      fontSize: 18,
      color: colors.primary700,
    },
    inputMultiline: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    invalidLabel: { color: colors.error500 },
    invalidInput: { backgroundColor: colors.error50 },
  });
  let inputStyles = [styles.input];

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  //we use object textInputConfig to merge all the TextInput properties in one object
  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={[styles.label, invalid && styles.invalidLabel]}>{label}</Text>
      <TextInput style={[inputStyles, invalid && styles.invalidInput]} {...textInputConfig} />
    </View>
  );
};

export default Input;


