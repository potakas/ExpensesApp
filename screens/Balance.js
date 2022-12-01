import { useContext } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import BarChart from "react-native-bar-chart";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";


const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const Balance = () => {
  const expensesCtx = useContext(ExpensesContext);
  // data can be one or two dimensional Array
  const data = expensesCtx.expenses.map((expense) => expense.amount);
  // labels
  const horizontalData = expensesCtx.expenses.map((expense) =>
    expense.date.toISOString().slice(5, 10)
  );
  //for better representation
  const reverseData= data.reverse();
  const reverseHorData= horizontalData.reverse();
  return (
    <View style={styles.container}>
      <BarChart
        data={reverseData}
        horizontalData={reverseHorData}
        barColor="red"
        backgroundColor={GlobalStyles.colors.primary200}
        barLabelColor="white"
        labelColor="white"
      />
    </View>
  );
};

export default Balance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary500,
  },
  chart: {
    width: width,
    height: height ,
  },
});
