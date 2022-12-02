import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import ManageExpense from "./screens/ManageExpense";
import RecentExpenses from "./screens/RecentExpenses";
import AllExpenses from "./screens/AllExpenses";
import { GlobalStyles } from "./constants/styles";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./components/UI/IconButton";
import ExpensesContextProvider from "./store/expenses-context";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { useContext, useState, useEffect, useRef } from "react";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Income from "./screens/Income";
import IncomeContextProvider from "./store/income-context";
import ManageIncome from "./screens/ManageIncome";
import Balance from "./screens/Balance";
import { refreshToken } from "./util/auth";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

const ExpensesOverview = () => {
  const authCtx = useContext(AuthContext);
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="exit"
            size={24}
            color={tintColor}
            onPress={authCtx.logout}
          />
        ),
      })}
    >
      <BottomTabs.Screen
        name="RecentExpenses"
        component={RecentExpenses}
        options={{
          title: "Recent Expenses",
          tabBarLabel: "Recent",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="AllExpenses"
        component={AllExpenses}
        options={{
          title: "All Expenses",
          tabBarLabel: "All Expenses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Income"
        component={Income}
        options={{
          title: "Income",
          tabBarLabel: "Income",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Balance"
        component={Balance}
        options={{
          title: "Balance",
          tabBarLabel: "Balance",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.primary100 },
      }}
    >
      <Stack.Screen
        name="ExpensesOverview"
        component={ExpensesOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageExpense"
        component={ManageExpense}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="ManageIncome"
        component={ManageIncome}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

const Root = () => {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const [time, setTime] = useState(0);
  const authCtx = useContext(AuthContext);
  const timer = useRef(null);

  //code that runs at the start of the application
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        authCtx.authenticate(storedToken);
      }
      setIsTryingLogin(false);
    };
    fetchToken();
  }, []);

  //for refreshing the token each time we logging during the 1 hour period
  useEffect(() => {
    const refresh = async () => {
      const refresh = await AsyncStorage.getItem("RT");
      try {
        const idToken = await refreshToken(refresh);
        AsyncStorage.setItem("token", idToken);
        AsyncStorage.setItem("@last_visited", new Date().toString());
      } catch (error) {
        console.log(error);
      }
    };
    refresh();
  }, []);

  //add useEffect with timer to logout after 1 hour from the last login
  useEffect(() => {
    const logOut = async () => {
      const lastTime = await AsyncStorage.getItem("@last_visited");
      if (
        new Date() - new Date(lastTime) > 3599000 &&
        authCtx.isAuthenticated
      ) {
        console.log("TIME TO LEAVE");
        clearInterval(timer.current);
        AsyncStorage.removeItem("@last_visited");
        authCtx.isAuthenticated = false;
        authCtx.logout();
      }
    };
    timer.current = setInterval(() => {
      setTime((time) => time + 10000);
      logOut();
    }, 10000);
  }, [timer, authCtx.isAuthenticated]);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
};

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <IncomeContextProvider>
          <ExpensesContextProvider>
            <Root />
          </ExpensesContextProvider>
        </IncomeContextProvider>
      </AuthContextProvider>
    </>
  );
}
