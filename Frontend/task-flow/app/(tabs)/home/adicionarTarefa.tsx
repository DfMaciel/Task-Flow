import { View, StyleSheet, Text, Platform} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import adicionarTarefas from "@/services/tarefas/adicionarTarefas";

export default function AdicionarTarefaPage() {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [tempoEstimado, setTempoEstimado] = useState("");
    const [prazo, setPrazo] = useState(new Date());
    const [error, setError] = useState("");

    const [openPrioridade, setOpenPrioridade] = useState(false);
    const [prioridadeItens, setPrioridadeItens] = useState([
        { label: "Baixa", value: "baixa" },
        { label: "Média", value: "media" },
        { label: "Alta", value: "alta" },
    ]);

    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChangePrazo = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || prazo;
        setShowDatePicker(Platform.OS === 'ios');
        setPrazo(currentDate);
    };

    async function handleAdicionarTarefa() {
        if (!titulo || !descricao || !prioridade) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const tarefa = {
                titulo,
                descricao,
                prioridade,
                tempoEstimado: tempoEstimado ? Number(tempoEstimado) : null,
                prazo: prazo.toISOString().split('T')[0],
            };

            const resposta = await adicionarTarefas(tarefa);

            if (resposta.status === 201) {
                alert("Tarefa adicionada com sucesso!");
                setTitulo("");
                setDescricao("");
                setPrioridade("");
                setTempoEstimado("");
                setPrazo(new Date());
            }
        } catch (error:any) {
                console.error(error);
                setError(error.message);
                alert("Ocorreu um erro ao adicionar a tarefa!");
            }
        }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Tarefa</Text>
            <TextInput
                label="Titulo da tarefa"
                value={titulo}
                onChangeText={setTitulo}
                style={styles.input}
            />
            <TextInput
                label="Descrição"
                value={descricao}
                onChangeText={setDescricao}
                style={styles.input}
            />
            <Text style={styles.label}>Prioridade</Text>
            <DropDownPicker
                open={openPrioridade}
                value={prioridade}
                items={prioridadeItens}
                setOpen={setOpenPrioridade}
                setValue={setPrioridade}
                setItems={setPrioridadeItens}
                placeholder="Selecione a prioridade"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
            />
            <TextInput
                label="Tempo estimado (horas)"
                value={tempoEstimado}
                keyboardType="numeric"
                onChangeText={setTempoEstimado}
                style={[styles.input, { marginTop: openPrioridade ? 180 : 16 }]}
            />
            <Text style={styles.label}>Prazo</Text>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                    {prazo.toLocaleDateString('pt-BR')}
                </Text>
                <Button 
                    mode="outlined"
                    onPress={() => setShowDatePicker(true)}
                >
                    Selecionar Data
                </Button>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={prazo}
                    mode="date"
                    display="default"
                    onChange={onChangePrazo}
                    minimumDate={new Date()}
                />
            )}
            <Button
                mode="contained"
                style={styles.button}
                onPress={handleAdicionarTarefa}
            >
                Adicionar
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    input: {
        marginVertical: 8,
        backgroundColor: 'white',
    },
    dropdown: {
        backgroundColor: 'white',
    },
    dropdownContainer: {
        backgroundColor: 'white',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 4,
        marginVertical: 8,
    },
    dateText: {
        fontSize: 16,
    },
    button: {
        marginVertical: 16,
    },
});