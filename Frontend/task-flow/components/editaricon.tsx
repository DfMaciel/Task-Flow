import { StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";

type EditarFABProps = {
    isEditing: boolean;
    onToggleEdit: () => void;
    onSave?: () => void;
    onDelete?: () => void;
  };
  
  export default function EditarIcon({ 
    isEditing, 
    onToggleEdit, 
    onSave,
    onDelete
  }: EditarFABProps) {
    
    return (
      <View style={styles.container}>
        {isEditing ? (
          // When editing, show both cancel and save buttons
          <View style={styles.editingButtonsContainer}>
            <FAB
              style={[styles.fab, styles.deleteFab]}
              icon="delete"
              onPress={onDelete}
              color="#FFFFFF"
              customSize={48}
            />
            <FAB
              style={[styles.fab, styles.cancelFab]}
              icon="close"
              onPress={onToggleEdit}
              color="#FFFFFF"
              customSize={48}
            />
            <FAB
              style={[styles.fab, styles.saveFab]}
              icon="check"
              onPress={onSave || onToggleEdit}
              color="#FFFFFF"
              customSize={48}
            />
          </View>
        ) : (
          // When not editing, show just the edit button
          <FAB
            style={[
              styles.fab, 
            ]}
            icon="pencil"
            onPress={onToggleEdit}
            color="#FFFFFF"
            customSize={48}
          />
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 25,
      right: 16,
      zIndex: 999,
    },
    editingButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 150,
    },
    fab: {
      margin: 0,
      backgroundColor: '#6750A4',
    },
    cancelFab: {
      backgroundColor: '#9E9E9E',
    },
    saveFab: {
      backgroundColor: '#6750A4',
    },
    deleteFab: {
      backgroundColor: 'red'
    }
  });