import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, Button, IconButton, Avatar, TextInput, Dialog, Portal, ActivityIndicator } from "react-native-paper";
import listarCategorias from "@/services/categorias/listarCategorias";
import { VisualizarCategoria } from "@/types/CategoriasInterface";
import { useAuth } from "../authcontext";
import { router } from "expo-router";
import { VisualizarUsuarioInterface } from "@/types/UsuarioInterface";
import buscarUsuario from "@/services/usuario/buscarUsuario";
import excluirCategoria from "@/services/categorias/excluirCategoria";
import adicionarCategorias from "@/services/categorias/adicionarCategoria";
import atualizarUsuario from "@/services/usuario/atualizarUsuario";

export default function TelaUsuario() {
  const { logout } = useAuth();
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
          console.log("Dados para atualizar:", updatedUserData);
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

  if (loading && !usuario) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={loading} size="large" color="#6750A4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon icon="account" size={64} style={styles.avatar} />
          <Text style={styles.userLabel}>Dados do usuário</Text>
      </View>

      <View style={styles.editSection}>
        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
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
      />
      <Button
        icon="plus"
        mode="contained"
        style={styles.addButton}
        onPress={() => setAddDialogVisible(true)}
      >
        Adicionar categoria
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
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
    borderColor: '#ddd',
    borderRadius: 8,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
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
    maxHeight: 200, 
    marginBottom: 16,
  },
  categoriaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F0FA",
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
});