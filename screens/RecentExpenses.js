import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import IconButton from "../components/UI/IconButton";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import useThemeColors from "../constants/styles";
import { AuthContext } from "../store/auth-context";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";

const RecentExpenses = ({ navigation }) => {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: colors.primary700,
    },
    iconOuterContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    iconInnerContainer: {
      borderRadius: 30,
      backgroundColor: colors.primary400,
      margin: 8,
      width: 50,
      height: 50,
    },
  });
  
  //useStates for dropdownpicker
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Last 7 Days");
  const [items, setItems] = useState([
    { label: "Last 7 Days", value: "Last 7 Days" },
    { label: "Last Month", value: "Last Month" },
    { label: "Last Year", value: "Last Year" },
  ]);
  // useStates for fetching Expense Data
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const expensesCtx = useContext(ExpensesContext);

  useEffect(() => {
    const getExpenses = async () => {
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses(token);
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses");
      }

      setIsFetching(false);
    };
    getExpenses();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  if (error && !isFetching) {
    return <ErrorOverlay message={error} onCorfirm={errorHandler} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    let pastDays = 0;
    //changing the pastDays to dynamically calculate the expense period
    switch (value) {
      case "Last 7 Days":
        pastDays = 7;
        break;
      case "Last Month":
        pastDays = 30;
        break;
      case "Last Year":
        pastDays = 365;
        break;
      default:
        break;
    }
    const today = new Date();
    const dateDaysAgo = getDateMinusDays(today, pastDays);
    return expense.date >= dateDaysAgo && expense.date <= today;
  });

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        // onSelectItem={(item) =>console.log(item)}
      />

      <ExpensesOutput
        mode="expense"
        expenses={recentExpenses}
        expensesPeriod={value}
        fallbackText={"No expenses registered for the " + value}
      />
      <View style={styles.iconOuterContainer}>
        {/* <View style={styles.iconInnerContainer}> */}
          <IconButton
            icon="add-circle-outline"
            size={40}
            color={colors.primary50}
            onPress={() => {
              navigation.navigate("ManageExpense");
            }}
          />
        {/* </View> */}
      </View>
    </View>
  );
};

export default RecentExpenses;

