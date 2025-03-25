import { View, Button, Text, StyleSheet} from "react-native";

export default function PrioridadeComponent({ prioridade }: { prioridade: string }) {
    let cor = "";
    let texto = "";
    switch (prioridade) {
        case "1":
            cor = "#e5b400";
            texto = "Baixa";
            break;
        case "2":
            cor = "orange";
            texto = "Média";
            break;
        case "3":
            cor = "red";
            texto = "Alta";
            break;
    }
    return (
        <View style={[styles.badge, { backgroundColor: cor }]}>
            <Text style={styles.badgeText}>{texto}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 5,
      marginRight: 8,
      width: 55,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
  });