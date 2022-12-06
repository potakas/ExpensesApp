import { FlatList, Text } from "react-native";
import ExpenseItem from "./ExpenseItem";
import IncomeItem from "./IncomeItem";

const renderExpenseItem = (itemData) => {
  return <ExpenseItem {...itemData.item} />;
};

const renderIncomeItem = (itemData) => {
  return <IncomeItem {...itemData.item} />;
};
const ExpensesList = ({ mode, expenses }) => {
  return (
    <FlatList
      data={expenses}
      renderItem={mode === "expense" ? renderExpenseItem : renderIncomeItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default ExpensesList;
