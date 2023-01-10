import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
} from "victory-native";
import ExpensesSummary from "../components/ExpensesOutput/ExpensesSummary";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import useThemeColors from "../constants/styles";
import { AuthContext } from "../store/auth-context";
import { ExpensesContext } from "../store/expenses-context";
import { IncomeContext } from "../store/income-context";
import { fetchIncome } from "../util/http";
import DropDownPicker from "react-native-dropdown-picker";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Balance = () => {
  //useStates for dropdownpicker
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Select a year");
  const [items, setItems] = useState([
    { label: "Select a year", value: "Select a year" },
    { label: "2027", value: "2027" },
    { label: "2026", value: "2026" },
    { label: "2025", value: "2025" },
    { label: "2024", value: "2024" },
    { label: "2023", value: "2023" },
    { label: "2022", value: "2022" },
    { label: "2021", value: "2021" },
  ]);
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

  //for expenses by the year
  const yearExpenses = expensesCtx.expenses.filter((expense) => {
    let startingDate = "";
    let finishDate = "";
    switch (value) {
      case "Select a year":
        break;
      case "2027":
        startingDate = "2027-01-01";
        finishDate = "2027-12-31";
        break;
      case "2026":
        startingDate = "2026-01-01";
        finishDate = "2026-12-31";
        break;
      case "2025":
        startingDate = "2025-01-01";
        finishDate = "2025-12-31";
        break;
      case "2024":
        startingDate = "2024-01-01";
        finishDate = "2024-12-31";
        break;
      case "2023":
        startingDate = "2023-01-01";
        finishDate = "2023-12-31";
        break;
      case "2022":
        startingDate = "2022-01-01";
        finishDate = "2022-12-31";
        break;
      case "2021":
        startingDate = "2021-01-01";
        finishDate = "2021-12-31";
        break;
      default:
        break;
    }
    return (
      expense.date >= new Date(startingDate) &&
      expense.date <= new Date(finishDate)
    );
  });

  // for income by the year
  const yearIncome = incomeCtx.income.filter((income) => {
    let startingDate = "";
    let finishDate = "";
    switch (value) {
      case "Select a year":
        break;
      case "2027":
        startingDate = "2027-01-01";
        finishDate = "2027-12-31";
        break;
      case "2026":
        startingDate = "2026-01-01";
        finishDate = "2026-12-31";
        break;
      case "2025":
        startingDate = "2025-01-01";
        finishDate = "2025-12-31";
        break;
      case "2024":
        startingDate = "2024-01-01";
        finishDate = "2024-12-31";
        break;
      case "2023":
        startingDate = "2023-01-01";
        finishDate = "2023-12-31";
        break;
      case "2022":
        startingDate = "2022-01-01";
        finishDate = "2022-12-31";
        break;
      case "2021":
        startingDate = "2021-01-01";
        finishDate = "2021-12-31";
        break;
      default:
        break;
    }
    return (
      income.date >= new Date(startingDate) &&
      income.date <= new Date(finishDate)
    );
  });

  //sum expenses by month
  const monthSumE = yearExpenses.reduce((acc, curr) => {
    const index = curr.date.getMonth();
    acc[index] += curr.amount;
    return acc;
  }, new Array(12).fill(0));
  //sum income by month
  const monthSumI = yearIncome.reduce((acc, curr) => {
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
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        // onSelectItem={(item) =>console.log(item)}
      />
      {value !== "Select a year" && (
        <VictoryChart
          width={width}
          height={height / 2}
          domainPadding={{ x: 16 }}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            crossAxis
            style={{ tickLabels: { fill: "white" }, grid: { stroke: "none" } }}
          />
          <VictoryBar
            labels={({ datum }) => datum.total}
            style={{
              data: {
                fill: ({ datum }) => (datum.total <= 0 ? "red" : "green"),
                width: 16,
              },
              labels: { fill: "white" },
            }}
            data={data2}
            labelComponent={<VictoryLabel />}
            x="months"
            y="total"
          />
          <VictoryAxis
            dependentAxis
            crossAxis
            style={{ tickLabels: { fill: "white" } }}
          />
        </VictoryChart>
      )}
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
