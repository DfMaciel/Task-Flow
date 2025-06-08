import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, FlatList, Alert, ScrollView } from "react-native";
import { Text, Button, IconButton, Avatar, TextInput, Dialog, Portal, ActivityIndicator, useTheme, List } from "react-native-paper";
import listarCategorias from "@/services/categorias/listarCategorias";
import { VisualizarCategoria } from "@/types/CategoriasInterface";
import { useAuth } from "../authcontext";
import { router } from "expo-router";
import { VisualizarUsuarioInterface } from "@/types/UsuarioInterface";
import buscarUsuario from "@/services/usuario/buscarUsuario";
import excluirCategoria from "@/services/categorias/excluirCategoria";
import adicionarCategorias from "@/services/categorias/adicionarCategoria";
import atualizarUsuario from "@/services/usuario/atualizarUsuario";
import { TarefaRecorrente } from "@/types/TarefaInteface";
import listarTarefasRecorrentes from "@/services/tarefasRecorrentes/listarTarefasRecorrentes";
import salvarTarefaRecorrente from "@/services/tarefasRecorrentes/salvarTarefaRecorrente";
import excluirTarefaRecorrente from "@/services/tarefasRecorrentes/excluirTarefaRecorrente";
import DropDownPicker from "react-native-dropdown-picker";

export default function TelaUsuario() {
  const { logout } = useAuth();
  const theme = useTheme();
  const [usuario, setUsuario] = useState<VisualizarUsuarioInterface | null>(null);
  const [categorias, setCategorias] = useState<VisualizarCategoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [newCategoria, setNewCategoria] = useState("");
  
  const [editMode, setEditMode] = useState(false);
  const [nome, setNome] = useState("");
  const [originalNome, setOriginalNome] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [editError, setEditError] = useState("");

  const [tarefasRecorrentes, setTarefasRecorrentes] = useState<TarefaRecorrente[]>([]);
  const [tarefasRecorrentesLoading, setTarefasRecorrentesLoading] = useState(false);
  const [addTarefaRecorrenteDialogVisible, setAddTarefaRecorrenteDialogVisible] = useState(false);
  
  const [newTarefaRecorrenteNome, setNewTarefaRecorrenteNome] = useState("");
  const [newTarefaRecorrenteTitulo, setNewTarefaRecorrenteTitulo] = useState("");
  const [newTarefaRecorrenteDescricao, setNewTarefaRecorrenteDescricao] = useState("");
  const [newTarefaRecorrentePrioridade, setNewTarefaRecorrentePrioridade] = useState("Baixa");
  const [newTarefaRecorrenteCategoria, setNewTarefaRecorrenteCategoria] = useState<number | null>(null);
  const [newTarefaRecorrenteTempoEstimado, setNewTarefaRecorrenteTempoEstimado] = useState<string>("");
  
  const [openPrioridade, setOpenPrioridade] = useState(false);
  const [prioridadeItens, setPrioridadeItens] = useState([
      { label: "Baixa", value: "1" },
      { label: "Média", value: "2" },
      { label: "Alta", value: "3" },
  ]);

  const [openCategoria, setOpenCategoria] = useState(false);
  const [categoriasMapeadas, setCategoriasMapeadas] = useState<{ label: string; value: number }[]>([]);

  async function fetchUsuario() {
    setLoading(true);
    try {
      const resposta = await buscarUsuario();
      setUsuario(resposta.data);
      setNome(resposta.data.nome);
      setOriginalNome(resposta.data.nome); 
      setCategorias(resposta.data.categorias);
    } catch (error) {
      setUsuario(null);
      setNome("");
      setOriginalNome("");
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsuario();
    fetchTarefasRecorrentes();
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const resposta = await listarCategorias();
      setCategorias(resposta.data);
    } catch (error) {
      setCategorias([]);
    }
    setLoading(false);
  };
  
  useMemo(() => {
    if (categorias.length > 0) {
      const mappedCategorias = categorias.map(cat => ({
        label: cat.nome,
        value: cat.id,
      }));
      setCategoriasMapeadas(mappedCategorias);
    } else {
      setCategoriasMapeadas([]);
    }
  }, [categorias]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login/logar");
  };

  const handleAddCategoria = async () => {
    const categoria = {
      nome: newCategoria,
    }
    try {
      const resposta = await adicionarCategorias(categoria);
      if (resposta.status === 201) {
        Alert.alert("Sucesso", "Categoria adicionada com sucesso.");
      } else {
        Alert.alert("Erro", "Não foi possível adicionar a categoria.");
      }
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível adicionar a categoria.", error);
    }
    setAddDialogVisible(false);
    setNewCategoria("");
    fetchCategorias();
  };

  const handleDeleteCategoria = (cat: VisualizarCategoria) => {
    Alert.alert(
      "Excluir categoria",
      `Deseja excluir a categoria "${cat.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const resultado = await excluirCategoria(cat.id);
              if (resultado.status === 200) {
                Alert.alert("Sucesso", "Categoria excluída com sucesso.");
                fetchCategorias();
              }
            } catch (error: any) {
              Alert.alert("Erro", "Não foi possível excluir a categoria.", error);
            }
          },
        },
      ]
    );
  };

  const handleEnableEdit = () => {
    setOriginalNome(nome); 
    setEditMode(true);
    setEditError("");
  };

  const handleCancelEdit = () => {
    setNome(originalNome); 
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setEditError("");
    setEditMode(false);
  };

  const handleSave = async () => {
    setEditError(""); 
    let nameChanged = nome.trim() !== originalNome.trim() && nome.trim() !== "";
    let passwordChangeAttempted = senhaAtual !== "" || novaSenha !== "" || confirmarSenha !== "";
    let passwordValid = false;
    
    if (passwordChangeAttempted) {
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
          setEditError("Preencha todos os campos de senha para alterá-la.");
          return;
        }
        if (novaSenha !== confirmarSenha) {
          setEditError("A nova senha e a confirmação não coincidem.");
          return;
        }
        // if (novaSenha.length < 6) {
        //     setEditError("A nova senha deve ter pelo menos 6 caracteres.");
        //     return;
        // }
        passwordValid = true; 
    }

     if (nameChanged && nome.trim() === "") {
        setEditError("O campo de nome não pode ser vazio.");
        return;
     }

    if (!nameChanged && !passwordChangeAttempted) {
        setEditMode(false); 
        return;
    }

    setLoading(true);
    try {
        let updatedUserData: Record<string, string> = {};
        if (nameChanged) {
            updatedUserData.nome = nome.trim();
        }
        if (passwordValid && passwordChangeAttempted) {
          updatedUserData.senhaAtual = senhaAtual;
          updatedUserData.senhaNova = novaSenha;
        }
        if (Object.keys(updatedUserData).length > 0 && usuario) {
          await atualizarUsuario(updatedUserData);

          if (nameChanged) {
              setOriginalNome(nome.trim());
          }
          if (passwordValid && passwordChangeAttempted) {
              setSenhaAtual("");
              setNovaSenha("");
              setConfirmarSenha("");
          }
          Alert.alert("Sucesso", "Dados atualizados com sucesso.");
          setEditMode(false);
        } else if (!usuario) {
            setEditError("Erro: Usuário não carregado."); 
        } else {
            setEditMode(false); 
        }
      } catch (error: any) {
        console.error("Erro ao atualizar usuário:", error);
        const errorMessage = error.response?.data?.message || error.message || "Ocorreu um erro.";
        setEditError(`Erro ao atualizar dados: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
  };

  const fetchTarefasRecorrentes = async () => {
    setTarefasRecorrentesLoading(true);
    try {
      const resposta = await listarTarefasRecorrentes(); 
      setTarefasRecorrentes(resposta);
    } catch (error) {
      console.error("Erro ao buscar tarefas recorrentes:", error);
      setTarefasRecorrentes([]);
    } finally {
      setTarefasRecorrentesLoading(false);
    }
  }

  const handleAddTarefaRecorrente = async () => {
    if (!newTarefaRecorrenteNome.trim()) {
      Alert.alert("Erro", "O nome da tarefa recorrente é obrigatório.");
      return;
    }

    const tarefaRecorrente: Omit<TarefaRecorrente, 'id'> = {
      nomeTemplate: newTarefaRecorrenteNome,
      tituloTarefa: newTarefaRecorrenteTitulo,
      descricaoTarefa: newTarefaRecorrenteDescricao,
      prioridadeTarefa: newTarefaRecorrentePrioridade,
      idCategoriaTarefa: newTarefaRecorrenteCategoria || undefined,
      tempoEstimadoTarefa: newTarefaRecorrenteTempoEstimado || undefined,
    };

    try {
      await salvarTarefaRecorrente(tarefaRecorrente);
      
      Alert.alert("Sucesso", "Tarefa recorrente adicionada com sucesso.");
      setAddTarefaRecorrenteDialogVisible(false);
      setNewTarefaRecorrenteNome("");
      setNewTarefaRecorrenteTitulo("");
      setNewTarefaRecorrenteDescricao("");
      setNewTarefaRecorrentePrioridade("Baixa");
      setNewTarefaRecorrenteCategoria(null);
      setNewTarefaRecorrenteTempoEstimado("");
      
      fetchTarefasRecorrentes();
    } catch (error) {
      console.error("Erro ao adicionar tarefa recorrente:", error);
      Alert.alert("Erro", "Não foi possível adicionar a tarefa recorrente.");
    }
  }
  
  const handleExcluirTarefaRecorrente = (tarefa: TarefaRecorrente) => {
    Alert.alert(
      "Excluir Tarefa Recorrente",
      `Deseja excluir a tarefa recorrente "${tarefa.nomeTemplate}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await excluirTarefaRecorrente(tarefa.id);
              Alert.alert("Sucesso", "Tarefa recorrente excluída com sucesso.");
              fetchTarefasRecorrentes();
            } catch (error) {
              console.error("Erro ao excluir tarefa recorrente:", error);
              Alert.alert("Erro", "Não foi possível excluir a tarefa recorrente.");
            }
          },
        },
      ]
    );
  }

  const handleUsarTarefaRecorrente = (tarefa: TarefaRecorrente) => {
    const params = new URLSearchParams();
    if (tarefa.tituloTarefa) params.append('templateTitulo', tarefa.tituloTarefa);
    if (tarefa.descricaoTarefa) params.append('templateDescricao', tarefa.descricaoTarefa);
    if (tarefa.prioridadeTarefa) params.append('templatePrioridade', tarefa.prioridadeTarefa);
    if (tarefa.idCategoriaTarefa) params.append('templateIdCategoria', tarefa.idCategoriaTarefa.toString());
    if (tarefa.tempoEstimadoTarefa) params.append('templateTempoEstimado', tarefa.tempoEstimadoTarefa);
    
    router.push(`/home/adicionarTarefa?${params.toString()}`);
  }

  if (loading && !usuario) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={loading} size="large" color="#6750A4" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView} // Use a style for flex: 1 if needed
      contentContainerStyle={styles.container} // Apply padding here
      keyboardShouldPersistTaps="handled" // Good practice for inputs in ScrollView
    >
      <View style={styles.header}>
        <Avatar.Icon icon="account" size={64} style={styles.avatar} />
          <Text style={styles.userLabel}>Dados do usuário</Text>
      </View>

      <View style={styles.editSection}>
        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          style={[styles.input, { backgroundColor: "white" }]}
          editable={editMode} 
          mode="outlined" 
        />

        {editMode && (
          <>
            <Text style={styles.passwordSectionTitle}>Alterar Senha (opcional)</Text>
            <TextInput
              label="Senha Atual"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry={!showSenhaAtual}
              style={styles.input}
              mode="outlined"
              right={
                <TextInput.Icon
                  icon={showSenhaAtual ? "eye-off" : "eye"}
                  onPress={() => setShowSenhaAtual(!showSenhaAtual)}
                />
              }
            />
            <TextInput
              label="Nova Senha"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry={!showNovaSenha}
              style={styles.input}
              mode="outlined"
              right={
                <TextInput.Icon
                  icon={showNovaSenha ? "eye-off" : "eye"}
                  onPress={() => setShowNovaSenha(!showNovaSenha)}
                />
              }
            />
            <TextInput
              label="Confirmar Nova Senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!showConfirmarSenha}
              style={styles.input}
              mode="outlined"
              right={
                <TextInput.Icon
                  icon={showConfirmarSenha ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
                />
              }
            />
          </>
        )}

        {editError ? <Text style={styles.errorText}>{editError}</Text> : null}

        <View style={styles.editButtonContainer}>
          {editMode ? (
            <>
              <Button
                mode="outlined"
                onPress={handleCancelEdit}
                style={styles.cancelButton}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                disabled={loading}
                loading={loading && 
                  (nome.trim() !== originalNome.trim() 
                    || senhaAtual !== "" || novaSenha !== "" 
                    || confirmarSenha !== ""
                  )}
              >
                Salvar
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              icon="pencil"
              onPress={handleEnableEdit}
              style={styles.enableEditButton}
            >
              Habilitar Edição
            </Button>
          )}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Categorias</Text>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        style={styles.categoriaList}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.categoriaItem}>
            <Text style={styles.categoriaText}>{item.nome}</Text>
            <IconButton
              icon="delete-outline"
              size={20}
              onPress={() => handleDeleteCategoria(item)}
              style={styles.deleteButton}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#888", textAlign: "center", marginTop: 16 }}>
            Nenhuma categoria cadastrada.
          </Text>
        }
        refreshing={loading}
        onRefresh={fetchCategorias}
        scrollEnabled={false} 
      />
      <Button
        icon="plus"
        mode="contained"
        style={styles.addButton}
        onPress={() => setAddDialogVisible(true)}
      >
        Adicionar categoria
      </Button>

      <Text style={styles.sectionTitle}>Tarefas Recorrentes</Text>
      <FlatList
        data={tarefasRecorrentes}
        keyExtractor={(item) => item.id}
        style={styles.recorrenteList}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <List.Item
            title={item.nomeTemplate}
            description={item.tituloTarefa ? `Título: ${item.tituloTarefa}` : 'Toque para usar'}
            left={props => <List.Icon {...props} icon="content-copy" />}
            right={props => <IconButton {...props} icon="delete-outline" onPress={() => handleExcluirTarefaRecorrente(item)} />}
            onPress={() => handleUsarTarefaRecorrente(item)}
            style={styles.recorrenteItem}
            titleStyle={[styles.recorrenteTitle, { color: theme.colors.onSurface }]}
            descriptionStyle={[styles.recorrenteDetail, { color: theme.colors.onSurfaceVariant }]}
          />
        )}
        ListEmptyComponent={
          tarefasRecorrentesLoading ? (
            <ActivityIndicator animating={true} color={theme.colors.primary} style={{marginTop: 16}} />
          ) : (
            <Text style={{ color: "#888", textAlign: "center", marginTop: 16 }}>
              Nenhuma tarefa recorrente cadastrada.
            </Text>
          )
        }
        refreshing={tarefasRecorrentesLoading}
        onRefresh={fetchTarefasRecorrentes}
        scrollEnabled={false} 
      />
      <Button
        icon="plus-circle-outline"
        mode="contained"
        style={styles.addButton}
        onPress={() => setAddTarefaRecorrenteDialogVisible(true)}
      >
        Adicionar Tarefa Recorrente
      </Button>

      <Button
        mode="outlined"
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        Sair
      </Button>

      <Portal>
        <Dialog visible={addDialogVisible} onDismiss={() => setAddDialogVisible(false)}>
          <Dialog.Title>Nova Categoria</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nome da categoria"
              value={newCategoria}
              onChangeText={setNewCategoria}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleAddCategoria} disabled={!newCategoria.trim()}>Adicionar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <Portal>
        <Dialog visible={addTarefaRecorrenteDialogVisible} onDismiss={() => setAddTarefaRecorrenteDialogVisible(false)}>
          <Dialog.Title>Nova Tarefa Recorrente</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nome da Tarefa Recorrente"
              value={newTarefaRecorrenteNome}
              onChangeText={setNewTarefaRecorrenteNome}
              mode="outlined"
              style={{ marginBottom: 8 }}
              autoFocus
            />
            <TextInput
              label="Título Padrão da Tarefa (Opcional)"
              value={newTarefaRecorrenteTitulo}
              onChangeText={setNewTarefaRecorrenteTitulo}
              mode="outlined"
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Descrição Padrão da Tarefa (Opcional)"
              value={newTarefaRecorrenteDescricao}
              onChangeText={setNewTarefaRecorrenteDescricao}
              mode="outlined"
              style={{ marginBottom: 8 }}
              multiline
              numberOfLines={3}
            />
            <DropDownPicker
                open={openPrioridade}
                value={newTarefaRecorrentePrioridade}
                items={prioridadeItens}
                setOpen={(isOpen) => {
                    setOpenPrioridade(isOpen);
                    if (isOpen) {
                        setOpenCategoria(false); 
                    }
                }}
                setValue={setNewTarefaRecorrentePrioridade}
                setItems={setPrioridadeItens}
                placeholder="Selecione a prioridade"
                listMode="SCROLLVIEW"
                tickIconStyle={{ tintColor: theme.colors.primary } as any}
                style={[
                    styles.dropdown, 
                ]}
                dropDownContainerStyle={[styles.dropdownContainer,
                    { borderColor: theme.colors.primary, borderWidth: 1.5 }
                ]}
                zIndex={3000}
                zIndexInverse={1000} 
            />
            <DropDownPicker
                open={openCategoria}
                value={newTarefaRecorrenteCategoria}
                items={categoriasMapeadas}
                setOpen={(isOpen) => {
                    setOpenCategoria(isOpen); 
                    if (isOpen) {
                        setOpenPrioridade(false); 
                    }
                }}
                setValue={setNewTarefaRecorrenteCategoria}
                setItems={setCategoriasMapeadas}
                placeholder="Selecione uma categoria"
                ListEmptyComponent={() => (
                    <Text style={{ padding: 10, textAlign: 'center' }}>
                        Nenhuma categoria encontrada
                    </Text>
                )}
                listMode="SCROLLVIEW"
                tickIconStyle={{ tintColor: theme.colors.primary } as any}
                style={[
                    styles.dropdown, 
                ]}
                dropDownContainerStyle={[styles.dropdownContainer,
                    { borderColor: theme.colors.primary, borderWidth: 1.5 }
                ]}
                zIndex={2000}
                zIndexInverse={2000}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddTarefaRecorrenteDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleAddTarefaRecorrente} disabled={!newTarefaRecorrenteNome.trim()}>Adicionar Tarefa Recorrente</Button>
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
  header: {
    alignItems: "center",
    marginBottom: 16, 
  },
  avatar: {
    backgroundColor: "#6750A4",
    marginBottom: 8,
  },
  userLabel: { 
    fontSize: 16, 
    color: "#555",
    fontWeight: '500',
    marginTop: 4,
  },
  editSection: {
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#a8a7a7',
    borderRadius: 8,
    backgroundColor: "#F3F0FA",
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  passwordSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6750A4',
    marginTop: 10,
    marginBottom: 10,
  },
  editButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", 
    marginTop: 16,
  },
  enableEditButton: {
    flex: 1, 
    backgroundColor: "#6750A4",
  },
  cancelButton: {
    marginRight: 8,
    borderColor: "#888",
    color: "#888",
  },
  saveButton: {
    backgroundColor: "#6750A4",
    color: "#fff",
  },
  errorText: {
      color: "#B00020",
      fontSize: 12,
      marginTop: 4,
      marginBottom: 8,
  },
  sectionTitle: { 
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#6750A4",
    marginTop: 16,
  },
  categoriaList: {
    flexGrow: 0, 
    marginBottom: 16,
  },
  categoriaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F0FA",
    borderWidth: 1,
    borderColor: "#a8a7a7",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  categoriaText: {
    fontSize: 16,
    color: "#222",
    flex: 1,
  },
  deleteButton: {
    marginLeft: 0,
  },
  addButton: { 
    marginTop: 8,
    backgroundColor: "#6750A4",
  },
  logoutButton: {
    marginTop: 24,
    borderColor: "#6750A4",
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
});