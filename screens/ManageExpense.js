import { useContext, useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import useThemeColors from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { storeExpense, updateExpense } from "../util/http";
import { useState } from "react";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { AuthContext } from "../store/auth-context";

const ManageExpense = ({ route, navigation }) => {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: colors.primary800,
    },
    deleteContainer: {
      marginTop: 16,
      paddingTop: 8,
      borderTopWidth: 2,
      borderTopColor: colors.primary200,
      alignItems: "center",
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const authCtx= useContext(AuthContext)
  const token = authCtx.token;
  const expenseCtx = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId; //the ? is for checking if params is defined in order to check for expenseId
  const isEditing = !!editedExpenseId; // makes the value into boolean true/false

  const selectedExpense = expenseCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  const cancelHandler = () => {
    navigation.goBack(); // this built-in function closed the modal and returns to prev page
  };
  const confirmHandler = async (expenseData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        expenseCtx.updateExpense(editedExpenseId, expenseData);
        await updateExpense(editedExpenseId, expenseData,token);
      } else {
        const id = await storeExpense(expenseData, token);
        expenseCtx.addExpense({ ...expenseData, id: id });
      }
      setIsSubmitting(false);
      navigation.goBack(); // this built-in function closed the modal and returns to prev page
    } catch (error) {
      setError("Could not save data - please try again later.");
      setIsSubmitting(false);
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} onCorfirm={errorHandler} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
      mode='Expense'
        onCancel={cancelHandler}
        isEditing={isEditing}
        onSubmit={confirmHandler}
        defaultValues={selectedExpense}
      />
    </View>
  );
};

export default ManageExpense;

