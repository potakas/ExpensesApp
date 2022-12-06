import { Button, Text, View } from "react-native";
import { GlobalStyles } from "../constants/styles";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const blue = {
  primary50: "#e4d9fd",
  primary100: "#c6affc",
  primary200: "#a281f0",
  primary400: "#5721d4",
  primary500: "#3e04c3",
  primary700: "#2d0689",
  primary800: "#200364",
  accent500: "#f7bc0c",
  error50: "#fcc4e4",
  error500: "#9b095c",
  gray500: "#39324a",
  gray700: "#221c30",
};

const green = {
  primary50: "#d9fdec",
  primary100: "#befcaf",
  primary200: "#85f081",
  primary400: "#16a816",
  primary500: "#04c35a",
  primary700: "#06891c",
  primary800: "#035510",
  accent500: "#0c43f7",
  error50: "#fcc4e4",
  error500: "#9b095c",
  gray500: "#39324a",
  gray700: "#221c30",
};

const red = {
  primary50: "#fdd9d9",
  primary100: "#fcafaf",
  primary200: "#f08181",
  primary400: "#a81616",
  primary500: "#c30404",
  primary700: "#890606",
  primary800: "#550303",
  accent500: "#4ff70c",
  error50: "#fcc4e4",
  error500: "#9b095c",
  gray500: "#39324a",
  gray700: "#221c30",
};

const Settings = () => {
  const [color, setColor] = useState(blue);
  console.log("COLOR IS==>", color);
  GlobalStyles.colors = color;
  AsyncStorage.setItem('colors', color);
  return (
    <View>
      {/* TO DO CHANGE APP COLOR WITH USECONTEXT FOR APP WIDE MANAGEMENT */}
      <Text>SETTINGS</Text>
      <Button onPress={() => setColor(blue)} title="Blue" />
      <Button onPress={() => setColor(green)} title="Green" />
      <Button
        onPress={() => {
          setColor(red);
        }}
        title="Red"
      />
    </View>
  );
};

export default Settings;
