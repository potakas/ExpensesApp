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
  AsyncStorage.setItem("UID", response.data.localId);
  AsyncStorage.setItem("@last_visited", new Date().toString());
  AsyncStorage.setItem("RT", response.data.refreshToken);
  console.log(new Date().toString());
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

//for refreshing the token each time we logging during the 1 hour period
export const refreshToken = async (refresh_token) => {
  url = "https://securetoken.googleapis.com/v1/token?key=" + API_KEY;
  const response = await axios.post(url, {
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  });

  const idToken = response.data.id_token;
  return idToken;
};

//for sending reset password email.
export const resetPass= async(email)=>{
  const url = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key="+API_KEY
  const response = await axios.post(url,{
    requestType:'PASSWORD_RESET',
    email: email,
  })
  console.log("RESET RESPONSE==>", response)
}
