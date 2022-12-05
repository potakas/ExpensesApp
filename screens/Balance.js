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
  let barClr = "green";

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
  //sum expenses by month
  const monthSumE = expensesCtx.expenses.reduce((acc, curr) => {
    const index = curr.date.getMonth();
    acc[index] += curr.amount;
    return acc;
  }, new Array(12).fill(0));
    //sum income by month
  const monthSumI = incomeCtx.income.reduce((acc, curr) => {
    const index = curr.date.getMonth();
    acc[index] += curr.amount;
    return acc;
  }, new Array(12).fill(0));

  const dataExp = expensesCtx.expenses.map((expense) => expense.amount);
  const dataInc = incomeCtx.income.map((income) => income.amount);

  //map the difference and shop bar green or red according to sum
  const data2 = monthSumI.map((item, index) => {
    let sum = item - monthSumE[index];
    if (sum => 0) {
      barClr = "green";
    } else {
      sum = sum * -1;
      barClr = "red";
    }
    return sum;
  });
  const totalAmount = data2.reduce((acc, curr) => acc + curr,[]);
    // data can be one or two dimensional Array
  const data = dataExp;

  // labels
  const horizontalData2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const horizontalData = expensesCtx.expenses.map((expense) =>
    expense.date.toISOString().slice(5, 10)
  );
  const reverseData = data.reverse();
  const reverseHorData = horizontalData.reverse();
  return (
    <View style={styles.outerContainer}>
      <BarChart
        data={data2}
        horizontalData={horizontalData2}
        barColor={barClr}
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
