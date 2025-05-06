import { VisualizarTarefa } from "@/types/TarefaInteface"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ItemStatusCircle from "./itemStatusCircle"
import { IconButton } from "react-native-paper"
import { useRouter } from "expo-router"

type props = {
    item: VisualizarTarefa
    onPress: (id: number) => void
}

export default function SubTarefasComponent({item, onPress}: props) {
    const router = useRouter()

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(item.id)}
        >
            <View style={styles.conteudoEsquerda}>
                {item.status && (
                    <ItemStatusCircle status={item.status} />)
                }
                <Text style={styles.titulo} numberOfLines={1} ellipsizeMode="tail">  
                    {item.titulo}
                </Text>
            </View>

            <IconButton
                icon="link-off"
                size={20}
                iconColor="red"
                onPress={() => {}}
                style={styles.desvincularButton}
            />
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0e7fd', 
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    conteudoEsquerda: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, 
        marginRight: 8, 
    },
    titulo: {
        fontSize: 16,
        marginLeft: 8, 
        flex: 1, 
    },
    desvincularButton: {
        margin: 0,
        padding: 4,
        color: '#D32F2F', 
    },
});