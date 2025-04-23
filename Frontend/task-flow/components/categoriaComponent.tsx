import listarCategorias from "@/services/categorias/listarCategorias";
import { VisualizarCategoria } from "@/types/CategoriasInterface";
import { ElementRef, useEffect, useRef, useState } from "react";
import { View, Button, Text, StyleSheet, FlatList, Modal, TouchableOpacity} from "react-native";

export default function CategoriaComponent({
    categoria,
    isEditable,
    onCategoriaChange
}: { 
    categoria: VisualizarCategoria, 
    isEditable: boolean,
    onCategoriaChange?: (newStatus: VisualizarCategoria) => void
 }) {

    const [currentCategoria, setCurrentCategoria] = useState<VisualizarCategoria | null>(categoria);
    const [categorias, setCategorias] = useState<VisualizarCategoria[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [badgePosition, setBadgePosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const badgeRef = useRef<ElementRef<typeof TouchableOpacity>>(null);
    
    useEffect(() => {
        setCurrentCategoria(categoria);
      }, [categoria]);
    
      useEffect(() => {
        async function fetchCategorias() {
          try {
            const resposta = await listarCategorias();
            setCategorias(resposta.data);
          } catch (error) {
            setCategorias([]);
          }
        }
        fetchCategorias();
      }, []);
        
    const handleCategoriaChange = (cat: VisualizarCategoria) => {
        if (cat !== currentCategoria) {
            setCurrentCategoria(cat);
            setModalVisible(false);
            if (onCategoriaChange) {
                onCategoriaChange(cat);
            }
         } else {
            setModalVisible(false);
            }
        };

        useEffect(() => {
            setCurrentCategoria(categoria);
        }, [categoria]);
        
        const handleBadgePress = () => {
            if (badgeRef.current) {
            badgeRef.current.measure((x, y, width, height, pageX, pageY) => {
                setBadgePosition({
                    x: pageX,
                    y: pageY + height, 
                    width: width,
                    height: height
                });
                setModalVisible(true);
            });
            };
        };  
    
      return (
        <View>
          {isEditable ? (
            <>
            <TouchableOpacity 
              ref={badgeRef}
              style={[styles.badge, { backgroundColor: "#6750A4", minWidth: 90 }]}
              onPress={handleBadgePress}
            >
            <View style={styles.badgeContent}>
                <Text style={styles.badgeText}>
                    {currentCategoria ? currentCategoria.nome : "Sem categoria"}
                </Text>
              <Text style={styles.arrowIndicator}>▼</Text>
            </View>
            </TouchableOpacity>
            
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setModalVisible(false)}
              >
                <View 
                  style={[
                    styles.dropdownContainer, 
                    { 
                      position: 'absolute',
                      top: badgePosition.y,
                      left: badgePosition.x,
                      width: Math.max(badgePosition.width, 65) 
                    }
                  ]}
                >
                    {categorias.length === 0 ? (
                        <Text style={{ color: '#888', padding: 10, textAlign: 'center' }}>Nenhuma categoria encontrada</Text>
                    ) : ( 
                        <FlatList
                            data={categorias}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => handleCategoriaChange(item)}
                            >
                                <Text style={styles.dropdownItemText}>{item.nome}</Text>
                            </TouchableOpacity>
                            )}
                            ListFooterComponent={
                                <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setCurrentCategoria(null);
                                    setModalVisible(false);
                                    if (onCategoriaChange) onCategoriaChange(null as any);
                                }}
                                >
                                <Text style={[styles.dropdownItemText, { color: "#888" }]}>
                                    Limpar seleção
                                </Text>
                                </TouchableOpacity>
                            }
                        />
                    )}
                </View>
              </TouchableOpacity>
            </Modal>
          </>
          ) : (
            <View style={[styles.badge, { backgroundColor: "#6750A4", minWidth: 90 }]}>
              <Text style={styles.badgeText}>
                {currentCategoria ? currentCategoria.nome : "Sem categoria"}
            </Text>
            </View>
          )}
        </View>
      );
    }

const styles = StyleSheet.create({
    badge: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 5,
      marginLeft: 8,

      width: 55,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    arrowIndicator: {
        color: 'white',
        fontSize: 12,
        marginLeft: 4,
    },
    badgeText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
      marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdownContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    dropdownItemText: {
        color: '#6750A4',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    }
  });