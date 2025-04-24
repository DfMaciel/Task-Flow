import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, Button, IconButton, Avatar, TextInput, Dialog, Portal } from "react-native-paper";
import listarCategorias from "@/services/categorias/listarCategorias";
import { VisualizarCategoria } from "@/types/CategoriasInterface";
import { useAuth } from "../authcontext";
import { router } from "expo-router";
import { VisualizarUsuarioInterface } from "@/types/UsuarioInterface";
import buscarUsuario from "@/services/usuario/buscarUsuario";
import excluirCategoria from "@/services/categorias/excluirCategoria";
import adicionarCategorias from "@/services/categorias/adicionarCategoria";

export default function TelaUsuario() {
  const { logout } = useAuth();
  const [usuario, setUsuario] = useState<VisualizarUsuarioInterface | null>(null);
  const [categorias, setCategorias] = useState<VisualizarCategoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [newCategoria, setNewCategoria] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [nome, setNome] = useState(usuario?.nome || "");
  const [nomeDialogVisible, setNomeDialogVisible] = useState(false);

  async function fetchUsuario() {
    setLoading(true);
    try {
      const resposta = await buscarUsuario();
      setUsuario(resposta.data);
      setNome(resposta.data.nome);
      setCategorias(resposta.data.categorias);
    } catch (error) {
      setUsuario(null);
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

  const handleEditNome = async () => {
    // TODO: Implement API call to update user name
    setNomeDialogVisible(false);
    setEditMode(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon icon="account" size={64} style={styles.avatar} />
        <View style={styles.userInfo}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.userName}>{nome}</Text>
            <IconButton icon="pencil" size={20} onPress={() => setNomeDialogVisible(true)} />
          </View>
          <Text style={styles.userLabel}>dados do usuário</Text>
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

        <Dialog visible={nomeDialogVisible} onDismiss={() => setNomeDialogVisible(false)}>
          <Dialog.Title>Editar nome</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nome"
              value={nome}
              onChangeText={setNome}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setNomeDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleEditNome} disabled={!nome.trim()}>Salvar</Button>
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
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: "#6750A4",
    marginBottom: 8,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginRight: 4,
  },
  userLabel: {
    fontSize: 14,
    color: "#888",
    marginTop: -2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#6750A4",
  },
  categoriaList: {
    flexGrow: 0,
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