import { VisualizarTarefa } from "@/types/TarefaInteface";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Menu } from "react-native-paper";
import VincularTarefaModal from "./vincularTarefaModal";

type AdicionarSubTarefaComponentProps = {
    tarefaPai: VisualizarTarefa;
    carregarTarefa: () => void;
    handleVincularSubTarefa: (subTarefa: number) => Promise<void>;
}

export default function AdicionarSubTarefaComponent(props: AdicionarSubTarefaComponentProps) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [vincularModalVisible, setVincularModalVisible] = useState(false);
    const router = useRouter();

    const openMenu = () => { setMenuVisible(true); };
    const closeMenu = () => { setMenuVisible(false); };

    const handleNavigateToCreateSubtarefa = () => {
        closeMenu();
        router.push(`/home/adicionarTarefa?id=${props.tarefaPai.id}`)
    };
    
    const handleOpenVincularModal = () => {
        closeMenu();
        setVincularModalVisible(true);
    }

    const handleMenuAction = (action: () => Promise<void> | void) => {
        closeMenu();
        action();
    };

    return (
        <>
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                    <Button
                        icon="plus"
                        mode="text"
                        onPress={openMenu}
                        compact
                        labelStyle={style.addButtonLabel}
                    >
                        Adicionar
                    </Button>
                }
            >
                <Menu.Item
                    leadingIcon="link-variant-plus"
                    onPress={handleOpenVincularModal}
                    title="Existente"
                />
                <Menu.Item
                    leadingIcon="plus-circle-outline"
                    onPress={handleNavigateToCreateSubtarefa}
                    title="Nova"
                />
            </Menu>

            <VincularTarefaModal
                    visible={vincularModalVisible}
                    onDismiss={() => setVincularModalVisible(false)}
                    onTarefaSelecionada={props.handleVincularSubTarefa}
                    tarefaPai={props.tarefaPai}
                />
        </>
    );
}

const style  = StyleSheet.create ({
    addButtonLabel: {
        fontSize: 14,
        marginHorizontal: 0,
    }
})