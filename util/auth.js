import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_KEY = "AIzaSyBfdVk4mmcmG5mQzINRAIzQo0oqekNkUlM";

const authenticate = async (mode, email, password) => {
  const url =
    `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=` + API_KEY;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;
  // use UID to create separate tables for each user
  AsyncStorage.setItem('UID', response.data.localId);
  return token;
};

export const createUser = async (email, password) => {
  const token = await authenticate("signUp", email, password);
  return token;
};

export const login = async (email, password) => {
  const token = await authenticate("signInWithPassword", email, password);
  return token;
};
