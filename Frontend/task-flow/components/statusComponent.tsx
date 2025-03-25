import { useRef, useState } from "react";
import { View, Button, Text, StyleSheet, FlatList, Modal, TouchableOpacity, TouchableOpacityProps} from "react-native";
import type { ElementRef } from "react";
export default function StatusComponent({ 
    status, 
    isEditable, 
    onStatusChange 
}: { 
    status: string, 
    isEditable: boolean, 
    onStatusChange: (newStatus: string) => void
}) {
    const [currentStatus, setCurrentStatus] = useState(status);
    const [modalVisible, setModalVisible] = useState(false);
    const [badgePosition, setBadgePosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const badgeRef = useRef<ElementRef<typeof TouchableOpacity>>(null);

    const statusOptions = [
        { label: "Não iniciada", value: "naoiniciada", cor: "lightblue" },
        { label: "Em andamento", value: "emandamento", cor: "purple" },
        { label: "Concluída", value: "concluida", cor: "green" },
    ];
    
    const getStatusDetails = (status: string) => {
        switch (status) {
          case "naoiniciada":
            return { cor: "lightblue", text: "Não inciada" };
          case "emandamento":
            return { cor: "purple", text: "Em andamento" };
          case "concluida":
            return { cor: "green", text: "Concluída" };
          default:
            return { cor: "gray", text: "Desconhecido" }; 
        }
    };
    
      const { cor, text } = getStatusDetails(currentStatus);
    
      const handleStatusChange = (newStatus: string) => {
        setCurrentStatus(newStatus);
        onStatusChange(newStatus);
      };
      
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
              style={[styles.badge, { backgroundColor: cor, width: 110 }]}
              onPress={handleBadgePress}
            >
              <Text style={styles.badgeText}>{text}</Text>
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
                      width: Math.max(badgePosition.width, 110) 
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
              <Text style={styles.badgeText}>{text}</Text>
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
      width: 80,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      color: "white",
      fontWeight: "bold",
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