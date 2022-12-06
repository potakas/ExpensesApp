import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Input from "../components/Auth/Input";
import Button from "../components/UI/Button";
import useThemeColors from "../constants/styles";

const ForgotPassword = ({ navigation }) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const colors = useThemeColors();

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      default:
        break;
    }
  }

  const styles = StyleSheet.create({
    text: {
      color: 'white',
      textAlign: "center",
      fontWeight: "bold",
      fontSize:16,
      marginVertical: 8
    },
    authContent: {
      marginTop: 64,
      marginHorizontal: 32,
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.primary800,
      elevation: 2,
      shadowColor: "black",
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.35,
      shadowRadius: 4,
    },
    buttons: {
      marginTop: 8,
    },
  });

  const sendEmailHandler = () => {
    navigation.navigate("Login");
  };
  return (
    <View style={styles.authContent}>
      <Text style={styles.text}>Forgot Password Screen!</Text>
      <Input
        label="Email Address"
        onUpdateValue={updateInputValueHandler.bind(this, "email")}
        value={enteredEmail}
        keyboardType="email-address"
        isInvalid={false}
      />

      <Button style={styles.buttons} onPress={sendEmailHandler}>
        Send Email
      </Button>
    </View>
  );
};

export default ForgotPassword;
