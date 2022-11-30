import { useContext, useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/styles";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { storeIncome, updateIncome } from "../util/http";
import { useState } from "react";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { AuthContext } from "../store/auth-context";
import { IncomeContext } from "../store/income-context";

const ManageIncome = ({ route, navigation }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const authCtx= useContext(AuthContext)
  const token = authCtx.token;
  const incomeCtx = useContext(IncomeContext);

  const editedIncomeId = route.params?.expenseId; //the ? is for checking if params is defined in order to check for expenseId
  const isEditing = !!editedIncomeId; // makes the value into boolean true/false

  const selectedIncome = incomeCtx.income.find(
    (income) => income.id === editedIncomeId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Income" : "Add Income",
    });
  }, [navigation, isEditing]);

  const cancelHandler = () => {
    navigation.goBack(); // this built-in function closed the modal and returns to prev page
  };
  const confirmHandler = async (incomeData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        incomeCtx.updateIncome(editedIncomeId, incomeData);
        await updateIncome(editedIncomeId, incomeData,token);
      } else {
        const id = await storeIncome(incomeData, token);
        incomeCtx.addIncome({ ...incomeData, id: id });
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
        mode='Income'
        onCancel={cancelHandler}
        isEditing={isEditing}
        onSubmit={confirmHandler}
        defaultValues={selectedIncome}
      />
    </View>
  );
};

export default ManageIncome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
