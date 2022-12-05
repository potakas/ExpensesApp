import { useContext } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import BarChart from "react-native-bar-chart";
import ExpensesSummary from "../components/ExpensesOutput/ExpensesSummary";
import useThemeColors from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";
import { IncomeContext } from "../store/income-context";
import { getDateMinusDays } from "../util/date";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const Balance = () => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary500,
    },
    innerContainer: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 0,
      backgroundColor: colors.primary500,
    },
    chart: {
      width: width,
      height: height,
    },
  });
  const expensesCtx = useContext(ExpensesContext);
  const incomeCtx = useContext(IncomeContext);
  // data can be one or two dimensional Array
  const dataExp = expensesCtx.expenses.map((expense) => expense.amount);
  console.log("EXPENSES==>", dataExp);
  const dataInc = incomeCtx.income.map((income) => income.amount);
  console.log("INCOME==>", dataInc);

  const data = dataExp;
  // labels
  const horizontalData = expensesCtx.expenses.map((expense) =>
    expense.date.toISOString().slice(5, 10)
  );
  const reverseData = data.reverse();
  const reverseHorData = horizontalData.reverse();
  return (
    <View style={styles.outerContainer}>
      <BarChart
        data={reverseData}
        horizontalData={reverseHorData}
        barColor="red"
        backgroundColor={colors.primary200}
        barLabelColor="white"
        labelColor="white"
      />
      <View style={styles.innerContainer}>
        <ExpensesSummary
          expenses={expensesCtx.expenses}
          periodName="Total Balance is "
        />
      </View>
    </View>
  );
};

export default Balance;
