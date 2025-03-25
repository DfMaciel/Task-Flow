import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Portal, Dialog, Text, Button } from "react-native-paper";

interface DialogSuccessComponentProps {
    visible: boolean;
    onDismiss: () => void;
}

export default function DialogErrorComponent({ visible, onDismiss }: DialogSuccessComponentProps) {

    const router = useRouter();

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Icon icon="check-circle" />
                <Dialog.Title style={styles.title}>Tarefa adicionada!</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">A tarefa foi adicionada com sucesso.</Text>
                </Dialog.Content>
                <Dialog.Actions style={styles.actions}>
                    <Button onPress= {() => router.push('/tarefa/')}>Visualizar tarefa</Button>
                    <Button onPress={onDismiss}>Confirmar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    title: {
      fontWeight: 'bold',
    },
    actions: {
      justifyContent: 'space-between',
      paddingHorizontal: 8,
    },
  });
