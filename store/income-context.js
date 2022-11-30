import { createContext, useReducer } from "react";

export const IncomeContext = createContext({
  //shape of context data structure
  income: [],
  addIncome: ({ description, amount, date }) => {},
  setIncome: (income) => {},
  deleteIncome: (id) => {},
  updateIncome: (id, { description, amount, date }) => {},
});

const incomeReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "SET":
      const inverted= action.payload.reverse();
      return inverted;
    case "UPDATE":
      const updatableIncomeIndex = state.findIndex(
        (income) => income.id === action.payload.id
      );
      const updatableIncome = state[updatableIncomeIndex];
      const updatedItem = { ...updatableIncome, ...action.payload.data };
      const updatedIncome = [...state];
      updatedIncome[updatableIncomeIndex] = updatedItem;
      return updatedIncome;
    case "DELETE":
      return state.filter((income) => income.id !== action.payload);
    default:
      return state;
  }
};

const IncomeContextProvider = ({ children }) => {
  const [incomeState, dispatch] = useReducer(incomeReducer, []);

  const addIncome = (incomeData) => {
    dispatch({ type: "ADD", payload: incomeData });
  };

  const setIncome = (income) => {
    dispatch({ type: "SET", payload: income });
  };

  const deleteIncome = (id) => {
    dispatch({ type: "DELETE", payload: id });
  };

  const updateIncome = (id, incomeData) => {
    dispatch({ type: "UPDATE", payload: { id: id, data: incomeData } });
  };

  const value = {
    income: incomeState,
    addIncome: addIncome,
    setIncome: setIncome,
    deleteIncome: deleteIncome,
    updateIncome: updateIncome,
  };
  return (
    <IncomeContext.Provider value={value}>
      {children}
    </IncomeContext.Provider>
  );
};

export default IncomeContextProvider;
