import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

export default function AdicionarIcon() {
    return (
        <FAB 
        style={styles.fab} 
        icon="plus" onPress={() => console.log("Adicionar")} 
        />
    );
}

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })