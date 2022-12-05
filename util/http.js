import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BACKEND_URL =
  "https://react-native-http-11101-default-rtdb.firebaseio.com";

//=================FOR EXPENSES==============================//
export const storeExpense = async (expenseData, token) => {
  //add UID to path to create separate tables for each user
  const UID = await AsyncStorage.getItem("UID");
  const response = await axios.post(
    BACKEND_URL + "/" + UID + "/expenses.json?auth=" + token,
    expenseData
  );
  const id = response.data.name;

  return id;
};

export const fetchExpenses = async (token) => {
  //add UID to path to create separate tables for each user
  const UID = await AsyncStorage.getItem("UID");

  const response = await axios.get(
    BACKEND_URL + "/" + UID + "/expenses.json?auth=" + token
  );

  const expenses = [];

  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    expenses.push(expenseObj);
  }

  //TO DO
  //sort after each update. Now sorts only on login
  const sortedExpenses = expenses.sort(
    (a, b) => Number(a.date) - Number(b.date)
  );

  return sortedExpenses;
};

export const updateExpense = async (id, expenseData, token) => {
  //add UID to path to create separate tables for each user
  const UID = await AsyncStorage.getItem("UID");
  return await axios.put(
    BACKEND_URL + "/" + UID + `/expenses/${id}.json?auth=` + token,
    expenseData
  );
};

export const deleteExpense = async (id, token) => {
  //add UID to path to create separate tables for each user
  const UID = await AsyncStorage.getItem("UID");
  return axios.delete(
    BACKEND_URL + "/" + UID + `/expenses/${id}.json?auth=` + token
  );
};

//=================FOR INCOME==============================//
export const storeIncome = async (incomeData, token) => {
  //add UID to path to create separate tables for each user
  const UID = await AsyncStorage.getItem("UID");
  const response = await axios.post(
    BACKEND_URL + "/" + UID + "/income.json?auth=" + token,
    incomeData
  );
  const id = response.data.name;

  return id;
};
export const fetchIncome = async (token) => {
  //add UID to path to create separate tables for each user
  const UID = await AsyncStorage.getItem("UID");

  const response = await axios.get(
    BACKEND_URL + "/" + UID + "/income.json?auth=" + token
  );

  const income = [];

  for (const key in response.data) {
    const incomeObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    income.push(incomeObj);
  }

  //TO DO
  //sort after each update. Now sorts only on login
  const sortedIncome = income.sort((a, b) => Number(a.date) - Number(b.date));

  return sortedIncome;
};

export const updateIncome = async (id, incomeData, token) => {
  //add UID to path to create separate tables for each user
  const UID = await AsyncStorage.getItem("UID");
  return await axios.put(
    BACKEND_URL + "/" + UID + `/income/${id}.json?auth=` + token,
    incomeData
  );
};

export const deleteIncome = async (id, token) => {
  //add UID to path to create separate tables for each user
  const UID = await AsyncStorage.getItem("UID");
  return axios.delete(
    BACKEND_URL + "/" + UID + `/income/${id}.json?auth=` + token
  );
};
