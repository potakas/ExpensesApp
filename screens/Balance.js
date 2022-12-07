import React from "react";
import { useContext } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from "victory-native";
import ExpensesSummary from "../components/ExpensesOutput/ExpensesSummary";
import useThemeColors from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";
import { IncomeContext } from "../store/income-context";

const width= Dimensions.get("window").width;
const height= Dimensions.get("window").height;


const Balance = () => {
  const expensesCtx = useContext(ExpensesContext);
  const incomeCtx = useContext(IncomeContext);
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary400,
    },
    innerContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
      backgroundColor: colors.primary400,
    },
  });

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

  const balance = monthSumI.map((item, index) => {
    return item - monthSumE[index];
  });
  console.log(balance);
  const horizontalData2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  //merge the 2 arrays into an array on objects {months:x, total:y}
  const data2 = horizontalData2.map((item, index) => {
    return { months: item, total: balance[index] };
  });

  return (
    <View style={styles.outerContainer}>
      <VictoryChart width={width} domainPadding={{ x: 16 }} theme={VictoryTheme.material}>
        <VictoryBar
          labels= {({datum})=> datum.total}
          style={{
            data: { fill: ({ datum }) => (datum.total <= 0 ? "red" : "green"), width:16 },
            labels:{fill:'white'}
          }}
          data={data2}
          labelComponent={<VictoryLabel dy={8}/>}
          x="months"
          y="total"
        />
      </VictoryChart>
      <View style={styles.innerContainer}>
        <ExpensesSummary
          expenses={expensesCtx.expenses}
          periodName="Total Expenses are "
        />
      </View>
      <View style={styles.innerContainer}>
        <ExpensesSummary
          expenses={incomeCtx.income}
          periodName="Total Income is "
        />
      </View>
    </View>
  );
};

export default Balance;
