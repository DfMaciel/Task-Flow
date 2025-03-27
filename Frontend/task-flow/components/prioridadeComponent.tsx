import { ElementRef, useEffect, useRef, useState } from "react";
import { View, Button, Text, StyleSheet, FlatList, Modal, TouchableOpacity} from "react-native";

export default function PrioridadeComponent({
    prioridade,
    isEditable,
    onPrioridadeChange
}: { 
    prioridade: string, 
    isEditable: boolean,
    onPrioridadeChange?: (newStatus: string) => void
 }) {

    const [currentPrioridade, setCurrentPrioridade] = useState(prioridade);
    const [modalVisible, setModalVisible] = useState(false);
    const [badgePosition, setBadgePosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const badgeRef = useRef<ElementRef<typeof TouchableOpacity>>(null);
    
    const prioridadeOptions = [
        { label: "Baixa", value: "1", cor: "#ffcd00" },
        { label: "Média", value: "2", cor: "orange" },
        { label: "Alta", value: "3", cor: "red" },
    ];

    const getPrioridadeDetails = (prioridade: string) => {
        switch (prioridade) {
            case "1":
                return { cor: "#ffcd00", text: "Baixa" };
            case "2":
                return { cor: "orange", text: "Média" };
            case "3":
                return { cor: "red", text: "Alta" };
            default:
                return { cor: "gray", text: "Desconhecido" };
        }
    };

    const { cor, text } = getPrioridadeDetails(currentPrioridade);

    const handlePrioridadeChange = (newPrioridade: string) => {
            if (newPrioridade !== currentPrioridade) {
            setCurrentPrioridade(newPrioridade);
            setModalVisible(false);
            if (onPrioridadeChange) {
                onPrioridadeChange(newPrioridade);
            }
            } else {
            setModalVisible(false);
            }
        };

        useEffect(() => {
            setCurrentPrioridade(prioridade);
        }, [prioridade]);
        
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
              style={[styles.badge, { backgroundColor: cor, width: 65 }]}
              onPress={handleBadgePress}
            >
            <View style={styles.badgeContent}>
              <Text style={styles.badgeText}>{text}</Text>
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
                  <FlatList
                    data={prioridadeOptions}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.dropdownItem, { backgroundColor: item.cor }]}
                        onPress={() => handlePrioridadeChange(item.value)}
                      >
                        <Text style={styles.dropdownItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </>
          ) : (
            <View style={[styles.badge, { backgroundColor: cor }]}>
              <Text style={[styles.badgeText, {marginLeft: 0}]}>{text}</Text>
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
      marginRight: 8,
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
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    }
  });