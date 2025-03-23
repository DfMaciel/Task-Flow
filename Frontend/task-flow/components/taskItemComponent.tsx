import { VisualizarTarefa } from "@/types/TarefaInteface";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

export default function TaskItemComponent({ tarefa, onPress }: { tarefa: VisualizarTarefa, onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <Text style={styles.titulo}>{tarefa.titulo}</Text>
                <Text style={styles.descricao}>{tarefa.descricao}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold",
    },
    descricao: {
        fontSize: 16,
    },
});