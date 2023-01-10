import { useContext, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import DatePicker from "react-native-datepicker";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import useThemeColors from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";

const AllExpenses = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: colors.primary700,
    },
    datePicker: {
      marginVertical: 16,
    },
    // rowInput: {
    //   flex: 1,
    // },
    text: {
      color: "white",
      fontSize: 18,
    },
    innerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
  });
  const expensesCtx = useContext(ExpensesContext);
  const shownExpenses = expensesCtx.expenses.filter((expense) => {
    console.log(new Date(dateFrom));
    console.log(new Date(dateTo));
    if (dateFrom !== "" && dateTo !== "") {
      return (
        expense.date >= new Date(dateFrom) && expense.date <= new Date(dateTo)
      );
    } else {
      return expense.date;
    }
  });
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>From:</Text>
        <DatePicker
          style={[styles.rowInput, styles.datePicker]}
          modal
          date={dateFrom}
          mode="date"
          placeholder="Select Min Date"
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
            setDateFrom(date);
          }}
          onConfirm={() => {
            console.log("Date", dateFrom);
          }}
          onCancel={() => {
            console.log("Canceled");
            setDateFrom("");
          }}
        />
        <Text style={styles.text}>To:</Text>
        <DatePicker
          style={[styles.rowInput, styles.datePicker]}
          date={dateTo}
          mode="date"
          placeholder="Select Max Date"
          // format='DD-MM-YYYY'
          format="YYYY-MM-DD"
          maxDate={new Date()}
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
            setDateTo(date);
          }}
          onConfirm={() => {
            console.log("Date", dateTo);
          }}
          onCancel={() => {
            console.log("Canceled");
            setDateTo("");
          }}
        />
      </View>

      <ExpensesOutput
        expenses={shownExpenses}
        expensesPeriod="Total"
        fallbackText="No registered expenses found"
      />
    </View>
  );
};

export default AllExpenses;
