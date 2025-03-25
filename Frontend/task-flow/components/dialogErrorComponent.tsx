import { useState } from "react";
import { StyleSheet } from "react-native";
import { Portal, Dialog, Text } from "react-native-paper";

interface DialogErrorComponentProps {
    error: string;
    visible: boolean;
    onDismiss: () => void;
}

export default function DialogErrorComponent({ error, visible, onDismiss }: DialogErrorComponentProps) {

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title style={styles.title}>Erro!</Dialog.Title>
                <Dialog.Content>
                <Text variant="bodyMedium">{error}</Text>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    title: {
        color: "red",
    },
});
