import { Modal, Portal, Button, Surface, Text, SegmentedButtons, useTheme } from 'react-native-paper';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { FiltrosOptions } from '@/types/FiltrosInterface';

interface FilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  onApplyFilters: (filters: FiltrosOptions) => void;
  currentFilters: FiltrosOptions;
}

export default function FilterModal({ visible, onDismiss, onApplyFilters, currentFilters }: FilterModalProps) {
  const theme = useTheme();
  const [filters, setFilters] = useState<FiltrosOptions>(currentFilters);

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
                onValueChange={value => setFilters({...filters, prazo: filters.prazo === value ? null : value})}
                buttons={[
                  { value: 'HOJE', label: 'Hoje' },
                  { value: 'SEMANA', label: 'Esta Semana' },
                  { value: 'MES', label: 'Este Mês' },
                ]}
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Categoria</Text>
              <SegmentedButtons
                value={filters.categoria || ''}
                onValueChange={value => setFilters({...filters, categoria: value || null})}
                buttons={[
                  { value: 'TRABALHO', label: 'Trabalho' },
                  { value: 'PESSOAL', label: 'Pessoal' },
                  { value: 'ESTUDO', label: 'Estudo' },
                ]}
              />
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
});