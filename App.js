import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./navigation/StackNavigator";
import { Provider } from "react-redux";

import { UserContext } from "./UserContext";
import store from "./store";

export default function App() {
  return (
    <>
    <Provider store={store}>
    <UserContext>

    <StackNavigator/>
    </UserContext>
    </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
