// app/home.tsx

import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../authcontext";
import { router } from "expo-router";
import AdicionarIcon from "@/components/adicionarIcon";

const TelaHome = () => {

  return (
    <View style={styles.container}>
      <AdicionarIcon/>
    </View>
  );
};

export default TelaHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 10,
  },
});
