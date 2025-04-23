import { VisualizarTarefa } from "@/types/TarefaInteface";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import PrioridadeComponent from "./prioridadeComponent";
import StatusComponent from "./statusComponent";
import { Icon } from "react-native-paper";
import formatPrazo from "@/utils/dateTimeParser";
import CategoriaComponent from "./categoriaComponent";

export default function TaskItemComponent({ tarefa, onPress }: { tarefa: VisualizarTarefa, onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <Text style={styles.titulo}>{tarefa.titulo}</Text>
                {/* <Text style={styles.descricao}>{tarefa.descricao.substring(0, 110)}
                    {tarefa.descricao.length > 100 && "..."}
                </Text> */}
                <View style={styles.infoContainer}>
                    {tarefa?.prioridade && <PrioridadeComponent prioridade={tarefa?.prioridade} isEditable={false} /> }
                    {tarefa?.status && <StatusComponent status={tarefa?.status} isEditable={false} /> }
                    <View style={styles.dataContainer}>
                        <Icon source="calendar-alert" size={24} color="#000"/>
                        <Text 
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                marginLeft: 4,
                                color: "grey"
                                }}
                            >
                            {formatPrazo(tarefa?.prazo)}
                            </Text>
                    </View>
                </View>
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
        marginBottom: 4,
    },
    descricao: {
        fontSize: 16,
    },
    infoContainer: {
        flexDirection: "row",
        width: "100%",
        height: 24,
    },
    dataContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "auto",
    },
});