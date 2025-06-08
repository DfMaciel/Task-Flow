import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { Lembrete, CriarLembrete } from "@/types/LembreteInterface";
import listarLembretes from "@/services/lembretes/listarLembretes";
import criarLembrete from "@/services/lembretes/criarLembrete";
import excluirLembrete from "@/services/lembretes/excluirLembrete";
import { useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Button, Chip, Dialog, IconButton, List, Portal, TextInput, useTheme } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from "@react-native-community/datetimepicker"; 
import { VisualizarTarefa } from "@/types/TarefaInteface";
import ListarTarefas from "@/services/tarefas/listarTarefasService";
import { useRouter } from "expo-router";

const DIAS_SEMANA = [
    { label: "Dom", value: 1 }, 
    { label: "Seg", value: 2 },
    { label: "Ter", value: 3 },
    { label: "Qua", value: 4 },
    { label: "Qui", value: 5 },
    { label: "Sex", value: 6 },
    { label: "Sáb", value: 7 }, 
];

export default function TelaLembretes() {
    const [lembretes, setLembretes] = useState<Lembrete[]>([]);
    const [loadingLembretes, setLoadingLembretes] = useState(false);
    const [addLembreteDialogVisible, setAddLembreteDialogVisible] = useState(false);
    const [newLembreteTitulo, setNewLembreteTitulo] = useState("");
    const [newLembreteDataHora, setNewLembreteDataHora] = useState(new Date(new Date().getTime() + 5 * 60000)); 
    const [showLembretePicker, setShowLembretePicker] = useState(false);
    const [currentPickerMode, setCurrentPickerMode] = useState<'date' | 'time'>('date'); 
    const [tempDateHolder, setTempDateHolder] = useState<Date | null>(null);
    const [newLembreteFrequencia, setNewLembreteFrequencia] = useState<'nenhuma' | 'diaria' | 'semanal' | 'mensal'>('nenhuma');

    const [openFrequenciaPicker, setOpenFrequenciaPicker] = useState(false);
    const frequenciaItens = [
        { label: "Nenhuma (uma vez)", value: "nenhuma" },
        { label: "Diariamente", value: "diaria" },
        { label: "Semanalmente", value: "semanal" },
        // { label: "Mensalmente", value: "mensal" },
    ];

    const [diasSemanaSelecionados, setDiasSemanaSelecionados] = useState<number[]>([]);
    const [diaMesSelecionado, setDiaMesSelecionado] = useState<string>("");
    
    const [tarefas, setTarefas] = useState<VisualizarTarefa[]>([]);
    const [loadingTarefas, setLoadingTarefas] = useState(false);
    const [tarefasVencidas, setTarefasVencidas] = useState<VisualizarTarefa[]>([]);
    const [tarefasPendentes, setTarefasPendentes] = useState<VisualizarTarefa[]>([]);
    
    const theme = useTheme();
    const router = useRouter();
    
    const fetchLembretes = async () => {
        setLoadingLembretes(true);
        try {
            const fetchedLembretes = await listarLembretes();
            setLembretes(fetchedLembretes);
        } catch (error) {
            console.error("Erro ao listar lembretes:", error);
        } finally {
            setLoadingLembretes(false);
        }
    }
    
    const fetchTarefas = async () => {
        setLoadingTarefas(true);
        try {
            const response = await ListarTarefas(); 
            setTarefas(response.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
            setTarefas([]);
        } finally {
            setLoadingTarefas(false);
        }
    }
    
    useEffect(() => {
        fetchLembretes();
        fetchTarefas();
    }, []);

    useEffect(() => {
        if (tarefas.length > 0) {
            const agora = new Date();
            const pertoVencer = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
            const parsePrazoAsEndOfDay = (prazoStr: string | null | undefined): Date | null => {
                if (!prazoStr) return null;
                if (prazoStr.length === 10 && prazoStr.includes('-')) {
                    const [year, month, day] = prazoStr.split('-').map(Number);
                    return new Date(year, month - 1, day, 23, 59, 59, 999); 
                }
                return new Date(prazoStr);
            };
            
            const vencidas: VisualizarTarefa[] = [];
            const proximas: VisualizarTarefa[] = [];

            tarefas.forEach(tarefa => {
            if (tarefa.status === 'concluida') return;

            const prazoDate = parsePrazoAsEndOfDay(tarefa.prazo);
            if (!prazoDate) return;

            if (prazoDate < agora) {
                vencidas.push(tarefa);
            } else if (prazoDate >= agora && prazoDate <= pertoVencer) {
                proximas.push(tarefa);
            }
        });

        setTarefasVencidas(vencidas.sort((a, b) => new Date(a.prazo!).getTime() - new Date(b.prazo!).getTime()));
        setTarefasPendentes(proximas.sort((a, b) => new Date(a.prazo!).getTime() - new Date(b.prazo!).getTime()));
        }
    }, [tarefas]);
    
    const exibirStatus = (status: string | undefined) => {
        if (!status) return "N/A";
        switch (status.toLowerCase()) {
            case 'naoiniciada':
                return "Não iniciada";
            case 'emandamento':
                return "Em Andamento";
            case 'concluida':
                return "Concluída";
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    }

    const toggleDiaSemana = (diaValor: number) => {
        setDiasSemanaSelecionados(prev => 
            prev.includes(diaValor) ? prev.filter(d => d !== diaValor) : [...prev, diaValor]
        );
    };

    const handleAddLembrete = async () => {
    if (!newLembreteTitulo.trim()) {
      Alert.alert("Erro", "O título do lembrete é obrigatório.");
      return;
    }
    if (newLembreteDataHora <= new Date() && newLembreteFrequencia === 'nenhuma') {
        Alert.alert("Data Inválida", "Para um lembrete único, a data deve ser no futuro.");
        return;
    }
    
    let diaMesNum: number | undefined = undefined;
    
    if (newLembreteFrequencia === 'mensal') {
        const parsedDia = parseInt(diaMesSelecionado, 10);
        if (isNaN(parsedDia) || parsedDia < 1 || parsedDia > 31) {
            Alert.alert("Erro", "Dia do mês inválido. Insira um número entre 1 e 31.");
            return;
        }
        diaMesNum = parsedDia;
    }
    if (newLembreteFrequencia === 'semanal' && diasSemanaSelecionados.length === 0) {
        Alert.alert("Erro", "Selecione pelo menos um dia da semana para lembretes semanais.");
        return;
    }

    const lembrete: CriarLembrete = {
      titulo: newLembreteTitulo.trim(),
      dataHora: newLembreteDataHora.toISOString(),
      frequencia: newLembreteFrequencia,
      diasSemana: newLembreteFrequencia === 'semanal' ? diasSemanaSelecionados.sort((a,b) => a-b) : undefined,
      diaMes: diaMesNum,
    };

    const savedReminder = await criarLembrete(lembrete);
        if (savedReminder) {
            Alert.alert("Sucesso", "Lembrete específico salvo e agendado.");
            fetchLembretes();
            setAddLembreteDialogVisible(false);
            setNewLembreteTitulo("");
            setNewLembreteDataHora(new Date(new Date().getTime() + 5 * 60000));
            setNewLembreteFrequencia("nenhuma");
            setDiasSemanaSelecionados([]);
            setDiaMesSelecionado("");
        } else {
        Alert.alert("Erro", "Não foi possível salvar ou agendar o lembrete.");
        }
    };

    const handleExcluirLembrete = (lembrete: Lembrete) => {
        Alert.alert(
        "Excluir Lembrete",
        `Deseja excluir o lembrete "${lembrete.titulo}"?`,
        [
            { text: "Cancelar", style: "cancel" },
            {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
                const success = await excluirLembrete(lembrete.id);
                if (success) {
                Alert.alert("Sucesso", "Lembrete excluído.");
                fetchLembretes();
                } else {
                Alert.alert("Erro", "Não foi possível excluir o lembrete.");
                }
            },
            },
        ]
        );
    };

    const onChangeLembreteDateTime = (event: DateTimePickerEvent, selectedValue?: Date) => {
        const { type } = event;
        
        if (Platform.OS === 'android') {
            setShowLembretePicker(false);

            if (type === 'set' && selectedValue) {
                if (currentPickerMode === 'date') {
                    setTempDateHolder(selectedValue); 
                    setCurrentPickerMode('time');
                    DateTimePickerAndroid.open({
                        value: tempDateHolder || newLembreteDataHora,
                        mode: 'time',
                        onChange: onChangeLembreteDateTime, 
                        minimumDate: new Date(1900,0,1) 
                    });
                } else if (currentPickerMode === 'time') {
                    if (tempDateHolder) {
                        const finalDate = new Date(tempDateHolder);
                        finalDate.setHours(selectedValue.getHours());
                        finalDate.setMinutes(selectedValue.getMinutes());
                        finalDate.setSeconds(selectedValue.getSeconds());
                        setNewLembreteDataHora(finalDate);
                    }
                    setCurrentPickerMode('date');
                    setTempDateHolder(null);
                }
            } else if (type === 'dismissed') {
                setCurrentPickerMode('date'); 
                setTempDateHolder(null);
            }
        } else { 
            setShowLembretePicker(false);
            if (type === 'set' && selectedValue) {
                setNewLembreteDataHora(selectedValue);
            }
        }
    };

    const showDateTimePicker = () => {
        if (Platform.OS === 'android') {
            setCurrentPickerMode('date'); 
            DateTimePickerAndroid.open({
                value: newLembreteDataHora,
                mode: 'date',
                onChange: onChangeLembreteDateTime,
                minimumDate: new Date(),
            });
        } else {
            setShowLembretePicker(true);
        }
    };

    return (
        <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >

      <FlatList
        data={lembretes}
        keyExtractor={(item) => item.id}
        style={styles.recorrenteList} 
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <List.Item
            title={item.titulo}
            description={`Próximo: ${new Date(item.dataHora).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'})} (${item.frequencia})`}
            left={props => <List.Icon {...props} icon="bell-ring-outline" />}
            right={props => <IconButton {...props} icon="delete-outline" onPress={() => handleExcluirLembrete(item)} />}
            style={styles.recorrenteItem} 
            titleStyle={[styles.recorrenteTitle, { color: theme.colors.onSurface }]}
            descriptionStyle={[styles.recorrenteDetail, { color: theme.colors.onSurfaceVariant }]}
          />
        )}
        ListEmptyComponent={
          loadingLembretes ? (
            <ActivityIndicator animating={true} color={theme.colors.primary} style={{marginTop: 16}} />
          ) : (
            <Text style={{ color: "#888", textAlign: "center", marginTop: 16 }}>
              Nenhum lembrete específico cadastrado.
            </Text>
          )
        }
        refreshing={loadingLembretes}
        onRefresh={fetchLembretes}
        scrollEnabled={false} 
      />
      <Button
        icon="bell-plus-outline"
        mode="contained"
        style={styles.addButton}
        onPress={() => { 
            setNewLembreteFrequencia("nenhuma");
            setDiasSemanaSelecionados([]);
            setNewLembreteTitulo("");
            setDiaMesSelecionado("");
            setAddLembreteDialogVisible(true);
        }}
      >
        Adicionar Lembrete
      </Button>
      
      <Text style={styles.sectionTitle}>Tarefas próximas do vencimento</Text>
       <FlatList
            data={tarefasPendentes}
            keyExtractor={(item) => item.id.toString()} 
            style={styles.recorrenteList} 
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => {
                const prazoDate = item.prazo ? new Date(item.prazo.length === 10 && item.prazo.includes('-') ? item.prazo + "T00:00:00" : item.prazo) : null;
                return (
                    <List.Item
                        title={item.titulo}
                        description={`Prazo: ${prazoDate ? prazoDate.toLocaleDateString('pt-BR') : 'N/A'}\nStatus: ${exibirStatus(item.status)}\nPrioridade: ${item.prioridade || 'N/A'}`}
                        left={props => <List.Icon {...props} icon="clock-fast" color={theme.colors.onTertiaryContainer} />}
                        style={[styles.recorrenteItem, { backgroundColor: theme.colors.tertiaryContainer }]} 
                        titleStyle={[styles.recorrenteTitle, { color: theme.colors.onTertiaryContainer }]}
                        descriptionStyle={[styles.recorrenteDetail, { color: theme.colors.onTertiaryContainer }]}
                        onPress={() => router.push(`/home/tarefa/${item.id}`)}
                    />
                );
            }}
            ListEmptyComponent={
                loadingTarefas ? (
                    <ActivityIndicator animating={true} color={theme.colors.primary} style={{marginTop: 16}} />
                ) : (
                    <Text style={[styles.emptyListText, {color: theme.colors.onSurfaceVariant}]}>
                        Nenhuma tarefa próxima do vencimento.
                    </Text>
                )
            }
            refreshing={loadingTarefas}
            onRefresh={fetchTarefas} 
            scrollEnabled={false} 
        />

      <Text style={styles.sectionTitle}>Tarefas vencidas</Text>
       <FlatList
            data={tarefasVencidas}
            keyExtractor={(item) => item.id.toString()} 
            style={styles.recorrenteList} 
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => {
                const prazoDate = item.prazo ? new Date(item.prazo.length === 10 && item.prazo.includes('-') ? item.prazo + "T00:00:00" : item.prazo) : null;
                return (
                    <List.Item
                        title={item.titulo}
                        description={`Prazo: ${prazoDate ? prazoDate.toLocaleDateString('pt-BR') : 'N/A'}\nStatus: ${exibirStatus(item.status)}\nPrioridade: ${item.prioridade || 'N/A'}`}
                        left={props => <List.Icon {...props} icon="alert-circle-outline" color={theme.colors.onErrorContainer} />}
                        style={[styles.recorrenteItem, { backgroundColor: theme.colors.errorContainer }]} 
                        titleStyle={[styles.recorrenteTitle, { color: theme.colors.onErrorContainer }]}
                        descriptionStyle={[styles.recorrenteDetail, { color: theme.colors.onErrorContainer }]}
                        onPress={() => router.push(`/home/tarefa/${item.id}`)} 
                    />
                );
            }}
            ListEmptyComponent={
                loadingTarefas ? (
                    <ActivityIndicator animating={true} color={theme.colors.primary} style={{marginTop: 16}} />
                ) : (
                    <Text style={[styles.emptyListText, {color: theme.colors.onSurfaceVariant}]}>
                        Nenhuma tarefa vencida.
                    </Text>
                )
            }
            refreshing={loadingTarefas}
            onRefresh={fetchTarefas} 
            scrollEnabled={false} 
        />


      <Portal>
        <Dialog visible={addLembreteDialogVisible} onDismiss={() => {
             setAddLembreteDialogVisible(false)
             setTempDateHolder(null);
             setCurrentPickerMode('date');
        }}>
          <Dialog.Title>Novo Lembrete</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Título do Lembrete"
              value={newLembreteTitulo}
              onChangeText={setNewLembreteTitulo}
              mode="outlined"
              style={{ marginBottom: 8 }}
              autoFocus
            />
            <View style={styles.dateContainerRow}>
                <Text style={[styles.label, {marginRight: 8, alignSelf: 'center', color: theme.colors.onSurfaceVariant}]}>Data/Hora:</Text>
                <Button 
                    mode="outlined"
                    onPress={showDateTimePicker}
                    icon="calendar-clock"
                    compact
                >
                    {newLembreteDataHora.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </Button>
            </View>
            {showLembretePicker && Platform.OS !== 'android' && (
                <DateTimePicker
                    value={newLembreteDataHora}
                    mode="datetime" 
                    display="default"
                    onChange={onChangeLembreteDateTime}
                    minimumDate={new Date()} 
                />
            )}
            <DropDownPicker
                open={openFrequenciaPicker}
                value={newLembreteFrequencia}
                items={frequenciaItens}
                setOpen={setOpenFrequenciaPicker}
                setValue={(valueCallback) => {
                    const val = typeof valueCallback === 'function' ? valueCallback(newLembreteFrequencia) : valueCallback;
                    setNewLembreteFrequencia(val ?? 'nenhuma');
                    setDiasSemanaSelecionados([]);
                    setDiaMesSelecionado("");
                }}
                setItems={() => {}} 
                placeholder="Selecione a frequência"
                listMode="SCROLLVIEW"
                style={[styles.dropdown, {marginTop: 16}]}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={1000}
                zIndexInverse={3000}
            />
            {newLembreteFrequencia === 'semanal' && (
                    <View style={styles.recurrenceDetailContainer}>
                        <Text style={[styles.label, { marginBottom: 8, color: theme.colors.onSurfaceVariant }]}>Repetir nos dias:</Text>
                        <View style={styles.weekDaysContainer}>
                            {DIAS_SEMANA.map(dia => (
                                <Chip
                                    key={dia.value}
                                    selected={diasSemanaSelecionados.includes(dia.value)}
                                    onPress={() => toggleDiaSemana(dia.value)}
                                    style={styles.dayChip}
                                    textStyle={{color: diasSemanaSelecionados.includes(dia.value) ? theme.colors.onPrimary : theme.colors.onSurface}}
                                    selectedColor={theme.colors.primary}
                                >
                                    {dia.label}
                                </Chip>
                            ))}
                        </View>
                    </View>
                )}

                {newLembreteFrequencia === 'mensal' && (
                    <View style={styles.recurrenceDetailContainer}>
                        <TextInput
                            label="Dia do Mês (1-31)"
                            value={diaMesSelecionado}
                            onChangeText={text => setDiaMesSelecionado(text.replace(/[^0-9]/g, ''))}
                            mode="outlined"
                            keyboardType="number-pad"
                            maxLength={2}
                            style={{ marginTop: 8 }}
                        />
                    </View>
                )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddLembreteDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleAddLembrete} disabled={!newLembreteTitulo.trim()}>Adicionar Lembrete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        padding: 24,
    },
    recorrenteList: {
        flexGrow: 0,
        marginBottom: 16,
    },
    recorrenteItem: {
        backgroundColor: "#FBF8FF", 
        borderWidth: 1,
        borderColor: "#EADDFF",
        borderRadius: 8,
        marginBottom: 8,
    },
    recorrenteTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    recorrenteDetail: {
        fontSize: 13,
    },
    dateContainerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        paddingVertical: 8,
        marginBottom: 8,
        marginTop: 8,
    },
    label: {
        fontSize: 16,
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
    },
    addButton: { 
        marginTop: 8,
        backgroundColor: "#6750A4",
    },
    recurrenceDetailContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
    weekDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap', 
    },
    dayChip: {
        margin: 2,
    },
    sectionTitle: { 
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#6750A4",
        marginTop: 16,
    },
    emptyListText: { 
        color: "#888", 
        textAlign: "center", 
        marginTop: 16,
        marginBottom: 16,
        fontSize: 14,
    },
});