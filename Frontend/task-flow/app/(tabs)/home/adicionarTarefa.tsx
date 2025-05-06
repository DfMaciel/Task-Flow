import { View, StyleSheet, Text, Platform, KeyboardAvoidingView, ScrollView} from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import adicionarTarefas from "@/services/tarefas/adicionarTarefas";
import DialogErrorComponent from "@/components/dialogErrorComponent";
import { VisualizarCategoria } from "@/types/CategoriasInterface";
import listarCategorias from "@/services/categorias/listarCategorias";
import ListarTarefas from "@/services/tarefas/listarTarefasService";
import { VisualizarTarefa } from "@/types/TarefaInteface";

export default function AdicionarTarefaPage() {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [tempoEstimado, setTempoEstimado] = useState("");
    const [prazo, setPrazo] = useState(new Date());
    const [error, setError] = useState("");
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);
    const [tituloError, setTituloError] = useState(false);
    const [descricaoError, setDescricaoError] = useState(false);
    const [prioridadeError, setPrioridadeError] = useState(false);
    const tema = useTheme();

    const [openPrioridade, setOpenPrioridade] = useState(false);
    const [prioridadeItens, setPrioridadeItens] = useState([
        { label: "Baixa", value: "1" },
        { label: "Média", value: "2" },
        { label: "Alta", value: "3" },
    ]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const [openCategoria, setOpenCategoria] = useState(false);
    const [categorias, setCategorias] = useState<{ label: string; value: number }[]>([]);
    const [categoria, setCategoria] = useState<number | null>(null);

    const [openTarefa, setOpenTarefa] = useState(false);
    const [tarefas, setTarefas] = useState<{ label: string; value: number }[]>([]);
    const [tarefaEscolhida, setTarefaEscolhida] = useState<number | null>(null);

    const onChangePrazo = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || prazo;
        setShowDatePicker(Platform.OS === 'ios');
        setPrazo(currentDate);
    };
    
    useEffect(() => {
        async function fetchCategorias() {
            try {
                const resposta = await listarCategorias();
                setCategorias(
                    resposta.data.map((cat: VisualizarCategoria) => ({
                        label: cat.nome,
                        value: cat.id,
                    }))
                );
            } catch (error) {
                setCategorias([]);
            }
        }
        async function fetchTarefas() {
            try {
                const resposta = await ListarTarefas()
                setTarefas(
                    resposta.data.map((tarefa: VisualizarTarefa) => ({
                        label: tarefa.titulo,
                        value: tarefa.id,
                    }))
                )
            }
            catch (error) {
                console.error(error)
                setTarefas([])
            }
        }
        fetchCategorias();
        fetchTarefas();
    }
    , []);

    async function handleAdicionarTarefa() {
        let hasError = false;  
        setTituloError(false);
        setDescricaoError(false);
        setPrioridadeError(false);

        if (titulo.trim() === "") {
            setTituloError(true);
            hasError = true;
        }
        if (descricao.trim() === "") {
            setDescricaoError(true);
            hasError = true;
        }
        if (prioridade.trim() === "") {
            setPrioridadeError(true);
            hasError = true;
        }
        
        if (hasError) return;

        try {
            const tarefa = {
                titulo,
                descricao,
                prioridade,
                tempoEstimado: tempoEstimado ? Number(tempoEstimado) : null,
                idCategoria: categoria ? Number(categoria) : null,
                idTarefaPai: tarefaEscolhida ? Number(tarefaEscolhida) : null,
                prazo: prazo.toISOString().split('T')[0],
            };

            const resposta = await adicionarTarefas(tarefa);

            if (resposta.status === 201) {
                alert("Tarefa adicionada com sucesso!");
                setTitulo("");
                setDescricao("");
                setPrioridade("");
                setCategoria(null);
                setTempoEstimado("");
                setPrazo(new Date());
            }
        } catch (error:any) {
                console.error(error);
                setError(error.message);
                setErrorDialogVisible(true);
            }
        }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Tarefa</Text>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, width: "100%" }}
                keyboardVerticalOffset={100} 
            >
                <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                >
            <TextInput
                label="Titulo da tarefa"
                value={titulo}
                onChangeText={text => {
                    if (text.length <= 120) {
                        setTitulo(text);
                    }
                }}
                style={[styles.input]}
                error={tituloError}
            />
            <View style={styles.inputFooter}>
                {tituloError && <Text style={{ color: 'red' }}>Insira um título.</Text>}
                <Text style={styles.characterCount}>
                    {titulo.length}/120
                </Text>
            </View>
            <TextInput
                label="Descrição"
                value={descricao}
                onChangeText={text => {
                    if (text.length <= 2000) {
                        setDescricao(text);
                    }
                }}
                multiline
                numberOfLines={10}
                style={[styles.input]}
                error={descricaoError}
            />
            <View style={styles.inputFooter}>
                {descricaoError && <Text style={{ color: 'red' }}>Insira uma descrição.</Text>}
                <Text style={styles.characterCount}>
                    {descricao.length}/2000
                </Text>
            </View>
            {/* <Text style={[styles.label, prioridadeError && { color: 'red'}]}>Prioridade</Text> */}
            <DropDownPicker
                open={openPrioridade}
                value={prioridade}
                items={prioridadeItens}
                setOpen={(isOpen) => {
                    setOpenPrioridade(isOpen);
                    if (isOpen) {
                        setOpenCategoria(false); 
                    }
                }}
                setValue={setPrioridade}
                setItems={setPrioridadeItens}
                placeholder="Selecione a prioridade"
                listMode="SCROLLVIEW"
                tickIconStyle={{ tintColor: tema.colors.primary } as any}
                style={[
                    styles.dropdown, 
                    // { borderBottomColor: tema.colors.surface },
                    prioridadeError? styles.inputError : {}
                ]}
                dropDownContainerStyle={[styles.dropdownContainer,
                    { borderColor: tema.colors.primary, borderWidth: 1.5 }
                ]}
                zIndex={3000}
                zIndexInverse={1000} 
            />
            <DropDownPicker
                open={openCategoria}
                value={categoria}
                items={categorias}
                setOpen={(isOpen) => {
                    setOpenCategoria(isOpen); 
                    if (isOpen) {
                        setOpenPrioridade(false); 
                    }
                }}
                setValue={setCategoria}
                setItems={setCategorias}
                placeholder="Selecione uma categoria"
                ListEmptyComponent={() => (
                    <Text style={{ padding: 10, textAlign: 'center' }}>
                        Nenhuma categoria encontrada
                    </Text>
                )}
                listMode="SCROLLVIEW"
                tickIconStyle={{ tintColor: tema.colors.primary } as any}
                style={[
                    styles.dropdown, 
                ]}
                dropDownContainerStyle={[styles.dropdownContainer,
                    { borderColor: tema.colors.primary, borderWidth: 1.5 }
                ]}
                zIndex={2000}
                zIndexInverse={2000}
            />
            <TextInput
                label="Tempo estimado (horas)"
                value={tempoEstimado}
                keyboardType="numeric"
                onChangeText={setTempoEstimado}
                style={styles.input}
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
            <DropDownPicker
                open={openTarefa}
                value={tarefaEscolhida}
                items={tarefas}
                setOpen={(isOpen) => {
                    setOpenTarefa(isOpen); 
                    if (isOpen) {
                        setOpenCategoria(false);
                        setOpenPrioridade(false); 
                    }
                }}
                setValue={setTarefaEscolhida}
                setItems={setTarefas}
                placeholder="Tarefa relacionada"
                ListEmptyComponent={() => (
                    <Text style={{ padding: 10, textAlign: 'center' }}>
                        Nenhuma tarefa encontrada
                    </Text>
                )}
                listMode="SCROLLVIEW"
                tickIconStyle={{ tintColor: tema.colors.primary } as any}
                style={[
                    styles.dropdown, 
                ]}
                dropDownContainerStyle={[styles.dropdownContainer,
                    { borderColor: tema.colors.primary, borderWidth: 1.5 }
                ]}
                zIndex={1000}
                zIndexInverse={3000}
                searchable={true}
                searchPlaceholder="Pesquisar tarefa"
                searchNoResultsText="Nenhuma tarefa encontrada"
                searchTextInputStyle={{ color: tema.colors.primary }}
                searchContainerStyle={{ backgroundColor: tema.colors.surface }}
            />
            <Button
                mode="contained"
                style={styles.button}
                onPress={handleAdicionarTarefa}
            >
                Adicionar
            </Button>

            </ScrollView>
            </KeyboardAvoidingView>

            <DialogErrorComponent
                error={error}
                visible={errorDialogVisible}
                onDismiss={() => setErrorDialogVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollContainer: {
        flexGrow: 1,
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
    inputError: {
        borderColor: 'rgb(186, 26, 26)',
        borderWidth: 2,
        borderBottomWidth: 2,
    },
    inputFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    characterCount: {
        color: '#888',
        fontSize: 12,
        textAlign: 'right',
    },
    dropdown: {
        marginVertical: 8,
        backgroundColor: 'white',
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: 'rgb(124, 117, 126)',
        borderRadius: 3,
    },
    dropdownContainer: {
        backgroundColor: 'white',
        // bord: 0,
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