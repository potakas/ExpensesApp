import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { Pressable, Text, View, StyleSheet, Alert } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { AuthContext } from "../../store/auth-context";
import { ExpensesContext } from "../../store/expenses-context";
import { getFormattedDate } from "../../util/date";
import { deleteExpense } from "../../util/http";
import IconButton from "../UI/IconButton";

const ExpenseItem = ({ id, description, amount, date }) => {
  const navigation = useNavigation();
  const expenseCtx = useContext(ExpensesContext);
  const authCtx= useContext(AuthContext)
  const token = authCtx.token;
  const [error, setError] = useState();
  const [longPressTriggered, setLongPressTriggered] = useState(false);


  const onLongPress = () => {
    setLongPressTriggered(true); //boolean for determining longPressed
  };

  const deleteExpenseHandler = async() => {
    try {
      await deleteExpense(id, token);
      expenseCtx.deleteExpense(id);
    } catch (error) {
      setError("Could not delete expense.");
    }
  };

  const expensePressHandler = () => {
    navigation.navigate("ManageExpense", { expenseId: id });
    setLongPressTriggered(false)
  };

  return (
    <Pressable
      onPress={()=>{setLongPressTriggered(false)}} //reset the onLongPress functionality
      onLongPress={onLongPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {!longPressTriggered && (
        <View style={styles.expenseItem}>
          <View>
            <Text style={[styles.textBase, styles.description]}>
              {description}
            </Text>
            <Text style={styles.textBase}>{getFormattedDate(date)}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>{amount.toFixed(2)}€</Text>
          </View>
        </View>
      )}
      {longPressTriggered && ( //options for longPressed
        <View style={styles.optionsContainer}>
          <IconButton
            icon="pencil"
            color='white'
            size={36}
            onPress={expensePressHandler}
          />
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </Pressable>
  );
};

export default ExpenseItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  expenseItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.primary500,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  textBase: {
    color: GlobalStyles.colors.primary50,
  },
  description: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    minWidth: 80,
  },
  amount: {
    color: GlobalStyles.colors.primary500,
    fontWeight: "bold",
  },
  optionsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});
