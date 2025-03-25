import { View, Button, Text, StyleSheet} from "react-native";

export default function StatusComponent({ status }: { status: string }) {
    let cor = "";
    let texto = "";
    switch (status) {
        case "naoiniciada":
            cor = "lightblue";
            texto = "Não iniciada";
            break;
        case "emandamento":
            cor = "purple";
            texto = "Em andamento";
            break;
        case "concluida":
            cor = "green";
            texto = "Concluída";
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
      width: 90,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
  });