import { Modal, Portal, Button, Surface, Text, SegmentedButtons, useTheme, Menu } from 'react-native-paper';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { FiltrosOptions } from '@/types/FiltrosInterface';
import { Platform } from 'react-native';
import { VisualizarCategoria } from '@/types/CategoriasInterface';
import DateTimePicker from '@react-native-community/datetimepicker';
import listarCategorias from '@/services/categorias/listarCategorias';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  onApplyFilters: (filters: FiltrosOptions) => void;
  currentFilters: FiltrosOptions;
}

export default function FilterModal({ visible, onDismiss, onApplyFilters, currentFilters }: FilterModalProps) {
  const theme = useTheme();
  const [filters, setFilters] = useState<FiltrosOptions>(currentFilters);
  const [categorias, setCategorias] = useState<VisualizarCategoria[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoriasMenuVisible, setCategoriasMenuVisible] = useState(false);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const resposta = await listarCategorias();
        if (resposta.status === 200) {
          setCategorias(resposta.data);
        } else {
          console.error('Erro ao listar categorias:', resposta.data);
        }
      } catch (error) {
        console.error('Erro ao listar categorias:', error);
      }
    }
    fetchCategorias();
  }, []);
  
  const handlePrazoChange = (value: string) => {
    if (value === 'PERSONALIZADO') {
      setShowDatePicker(true);
    }
    setFilters({
      ...filters,
      prazo: value === filters.prazo ? null : value,
      dataPersonalizada: value === 'PERSONALIZADO' ? filters.dataPersonalizada || new Date().toISOString().split('T')[0] : null,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFilters({
        ...filters,
        prazo: 'PERSONALIZADO',
        dataPersonalizada: selectedDate.toISOString().split('T')[0],
      });
    }
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Surface style={styles.surface} elevation={2}>
          <Text style={styles.title}>Filtrar Tarefas</Text>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Prioridade</Text>
              <SegmentedButtons
                value={filters.prioridade || ''}
                onValueChange={value => setFilters({...filters, prioridade: filters.prioridade === value ? null : value})}
                buttons={[
                  { value: '3', label: 'Alta' },
                  { value: '2', label: 'Média' },
                  { value: '1', label: 'Baixa' },
                ]}
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Status</Text>
              <SegmentedButtons
                value={filters.status || ''}
                onValueChange={value => setFilters({...filters, status: filters.status === value ? null : value})}
                buttons={[
                  { value: 'naoiniciada', label: 'Não iniciada' },
                  { value: 'emandamento', label: 'Andamento' },
                  { value: 'concluida', label: 'Concluída' },
                ]}
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Prazo</Text>
              <SegmentedButtons
                value={filters.prazo || ''}
                onValueChange={handlePrazoChange}
                buttons={[
                  { value: 'HOJE', label: 'Hoje' },
                  { value: 'SEMANA', label: 'Semana' },
                  { value: 'MES', label: 'Este Mês' },
                  { value: 'PERSONALIZADO', icon: (props) => (
                    <MaterialCommunityIcons
                      name="calendar"
                      size={18}
                      color={props.color}
                      style={{ margin: 0, padding: 0 }} // Remove extra space
                    />),},
                ]}
              />
              {filters.prazo === 'PERSONALIZADO' && filters.dataPersonalizada && (
                <View style={styles.minimalDateRow}>
                  <Text style={styles.minimalDateText}>Prazo personalizado: {new Date(filters.dataPersonalizada).toLocaleDateString('pt-BR')}</Text>
                  <Button
                    onPress={() => setShowDatePicker(true)}
                    mode="text"
                    compact
                    style={styles.minimalDateButton}
                    labelStyle={styles.minimalDateButtonLabel}
                  >
                    Alterar
                  </Button>
                </View>
              )}
              {showDatePicker && (
                <DateTimePicker
                  value={filters.dataPersonalizada ? new Date(filters.dataPersonalizada) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Categoria</Text>
              <Menu
                  visible={categoriasMenuVisible}
                  onDismiss={() => setCategoriasMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setCategoriasMenuVisible(true)}
                      style={{ justifyContent: 'flex-start' }}
                      contentStyle={{ justifyContent: 'flex-start' }}
                    >
                      {filters.categoria?.nome || 'Selecione uma categoria'}
                    </Button>
                  }
                >
                  {categorias.map(cat => (
                    <Menu.Item
                      key={cat.nome}
                      onPress={() => {
                        setFilters({ ...filters, categoria: cat });
                        setCategoriasMenuVisible(false);
                      }}
                      title={cat.nome}
                    />
                  ))}
                  <Menu.Item
                    onPress={() => {
                      setFilters({ ...filters, categoria: null });
                      setCategoriasMenuVisible(false);
                    }}
                    title="Limpar seleção"
                  />
                </Menu>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button 
              mode="outlined" 
              onPress={() => {
                setFilters({ prioridade: null, status: null, prazo: null, categoria: null });
                onApplyFilters({ prioridade: null, status: null, prazo: null, categoria: null });
              }}
              style={styles.button}
            >
              Limpar Filtros
            </Button>
            <Button 
              mode="contained" 
              onPress={() => onApplyFilters(filters)}
              style={styles.button}
            >
              Aplicar
            </Button>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 400,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  minimalDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -15
  },
  minimalDateText: {
    fontSize: 14,
    color: '#444',
    marginRight: 4,
    fontWeight: "bold",
  },
  minimalDateButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    minWidth: 0,
    elevation: 0,
  },
  minimalDateButtonLabel: {
    fontSize: 14,
    color: '#6200ee',
    textTransform: 'none',
    fontWeight: '400',
    padding: 0,
  },
});