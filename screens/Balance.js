import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from "victory-native";
import ExpensesSummary from "../components/ExpensesOutput/ExpensesSummary";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import useThemeColors from "../constants/styles";
import { AuthContext } from "../store/auth-context";
import { ExpensesContext } from "../store/expenses-context";
import { IncomeContext } from "../store/income-context";
import { fetchIncome } from "../util/http";

const width= Dimensions.get("window").width;
const height= Dimensions.get("window").height;


const Balance = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  //for getting income info without going to income screen
  const expensesCtx = useContext(ExpensesContext);
  const incomeCtx = useContext(IncomeContext);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;


  const colors = useThemeColors();

  const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary700,
    },
    innerContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
      backgroundColor: colors.primary700,
    },
  });

  //for fetching income info 
  useEffect(() => {
    const getIncome = async () => {
      setIsFetching(true);
      try {
        const income = await fetchIncome(token);
        incomeCtx.setIncome(income);
      } catch (error) {
        setError("Could not fetch income");
      }

      setIsFetching(false);
    };
    getIncome();
  }, []);

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
    return item.toFixed(2) - monthSumE[index].toFixed(2); //to show normal values in chart
  });
  const horizontalData2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  //merge the 2 arrays into an array on objects {months:x, total:y}
  const data2 = horizontalData2.map((item, index) => {
    return { months: item, total: balance[index] };
  });

  //waiting for income information for the correct chart to appear
  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.outerContainer}>
      <VictoryChart width={width} height={height/2} domainPadding={{ x: 16 }} theme={VictoryTheme.material}>
        <VictoryBar
          labels= {({datum})=> datum.total}
          style={{
            data: { fill: ({ datum }) => (datum.total <= 0 ? "red" : "green"), width:16 },
            labels:{fill:'white'}
          }}
          data={data2}
          labelComponent={<VictoryLabel dy={16}/>}
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
