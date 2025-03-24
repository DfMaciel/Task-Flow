import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

export default function AdicionarIcon() {
    const router = useRouter();

    return (
        <FAB 
        style={styles.fab} 
        icon="plus" onPress={() => router.push("/home/adicionarTarefa")} 
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