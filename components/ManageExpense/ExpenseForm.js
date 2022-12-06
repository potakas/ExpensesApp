import { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import Input from "./Input";
import Button from "../UI/Button";
import useThemeColors from "../../constants/styles";
import DatePicker from "react-native-datepicker";

const ExpenseForm = ({mode, onCancel, onSubmit, isEditing, defaultValues }) => {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    form: { marginTop: 40 },
    inputsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rowInput: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
      marginVertical: 24,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      minWidth: 120,
      marginHorizontal: 8,
    },
    errorText: {
      textAlign: "center",
      color: colors.error500,
      margin: 8,
    },
    datePicker: {
      marginVertical: 24,
    },
  });
  //store a whole object in the state
  const [date, setDate] = useState(
    defaultValues ? defaultValues.date.toISOString().slice(0, 10) : ""
  );
  const [input, setInput] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: true,
    },
    date: {
      value: defaultValues ? defaultValues.date.toISOString().slice(0, 10) : "",
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : "",
      isValid: true,
    },
  });

  const submitHandler = () => {
    const expenseData = {
      amount: +input.amount.value,
      date: new Date(date),
      description: input.description.value,
    };

    //add input validation. if not valid output error
    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0; //descriptionis not empty

    //if at least one of these is invalid output error message
    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      //   Alert.alert("Invalid input", "Please check your input values.");
      setInput((curInput) => {
        return {
          amount: { value: curInput.amount.value, isValid: amountIsValid },
          date: { value: curInput.date.value, isValid: dateIsValid },
          description: {
            value: curInput.description.value,
            isValid: descriptionIsValid,
          },
        };
      });
      return;
    }
    onSubmit(expenseData);
  };

  const inputChangedHandler = (inputIdentifier, enteredValue) => {
    setInput((curInput) => {
      return {
        ...curInput,
        [inputIdentifier]: { value: enteredValue, isValid: true }, //set and target property dynamically (standard JS)
      };
    });
  };

  //helper const for form validity
  const formIsValid =
    !input.amount.isValid || !input.date.isValid || !input.description.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your {mode}</Text>
      <View style={styles.inputsRow}>
        <Input
          label="Amount"
          invalid={!input.amount.isValid}
          style={styles.rowInput}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "amount"),
            value: input.amount.value,
          }}
        />
        <DatePicker
          style={[styles.rowInput, styles.datePicker]}
          date={date}
          mode="date"
          placeholder="Select Date"
          // format='DD-MM-YYYY'
          format="YYYY-MM-DD"
          minDate="01-01-1900"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: "relative",
              right: -5,
              top: 4,
              marginLeft: 0,
            },

            dateInput: {
              borderColor: "white",
              alignItems: "center",
              borderWidth: 0,
              borderBottomWidth: 1,
            },
            placeholderText: {
              fontSize: 14,
              color: "white",
            },

            dateText: {
              color: "white",
              fontSize: 18,
            },
          }}
          onDateChange={(date) => {
            setDate(date);
          }}
          onConfirm={()=>{console.log("Date", date)}}
          onCancel={()=>{console.log("Canceled")}}
        />
        {/* change the date input with datepicker and fix date format to work the same */}
        {/* <Input
          label="Date"
          invalid={!input.date.isValid}
          style={styles.rowInput}
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: inputChangedHandler.bind(this, "date"),
            value: input.date.value,
          }}
        /> */}
      </View>
      <Input
        label="Description"
        invalid={!input.description.isValid}
        textInputConfig={{
          //used from TextInput documentation
          multiline: true,
          autoCorrect: true,
          autoCapitalize: "sentences",
          maxLength: 100,
          onChangeText: inputChangedHandler.bind(this, "description"),
          value: input.description.value,
        }}
      />
      {formIsValid && (
        <Text style={styles.errorText}>
          Invalid input values - please check your entered data!
        </Text>
      )}
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {isEditing ? "Update" : "Add"}
        </Button>
      </View>
    </View>
  );
};

export default ExpenseForm;


