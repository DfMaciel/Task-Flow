import { useEffect, useRef, useState } from "react";
import { View, Button, Text, StyleSheet, FlatList, Modal, TouchableOpacity, TouchableOpacityProps} from "react-native";
import type { ElementRef } from "react";
export default function StatusComponent({ 
    status, 
    isEditable, 
    onStatusChange 
}: { 
    status: string, 
    isEditable: boolean, 
    onStatusChange?: (newStatus: string) => void
}) {
    const [currentStatus, setCurrentStatus] = useState(status);
    const [modalVisible, setModalVisible] = useState(false);
    const [badgePosition, setBadgePosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const badgeRef = useRef<ElementRef<typeof TouchableOpacity>>(null);

    const statusOptions = [
        { label: "Não iniciada", value: "naoiniciada", cor: "#91e5e5" },
        { label: "Em andamento", value: "emandamento", cor: "#0032ff" },
        { label: "Concluída", value: "concluida", cor: "#76d970" },
    ];
    
    const getStatusDetails = (status: string) => {
        switch (status) {
          case "naoiniciada":
            return { cor: "#91e5e5", text: "Não inciada" };
          case "emandamento":
            return { cor: "#0032ff", text: "Em andamento" };
          case "concluida":
            return { cor: "#76d970", text: "Concluída" };
          default:
            return { cor: "gray", text: "Desconhecido" }; 
        }
    };
    
      const { cor, text } = getStatusDetails(currentStatus);
    
      const handleStatusChange = (newStatus: string) => {
        if (newStatus !== currentStatus) {
          setCurrentStatus(newStatus);
          setModalVisible(false);
          if (onStatusChange) {
            onStatusChange(newStatus);
          }
        } else {
          setModalVisible(false);
        }
      };

      useEffect(() => {
        setCurrentStatus(status);
    }, [status]);
      
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
              style={[styles.badge, { backgroundColor: cor, width: 120 }]}
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
                      width: Math.max(badgePosition.width, 120) 
                    }
                  ]}
                >
                  <FlatList
                    data={statusOptions}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.dropdownItem, { backgroundColor: item.cor }]}
                        onPress={() => handleStatusChange(item.value)}
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
      width: 110,
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
      marginLeft: 4,
      fontSize: 16,
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