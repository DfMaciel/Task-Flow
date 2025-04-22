import FilterModal from "@/components/modalFilter";
import { FiltrosOptions } from "@/types/FiltrosInterface";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, Touchable, TouchableOpacity } from "react-native";
import { Icon, IconButton, useTheme } from "react-native-paper";

export default function LayoutHome() {
    const theme = useTheme();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const router = useRouter();
    const [currentFilters, setCurrentFilters] = useState<FiltrosOptions>({
        prioridade: null,
        status: null,
        prazo: null,
        categoria: null,
    });

    console.log("Filter modal visible state:", filterModalVisible); 

    return (
        <>
            <Stack 
                screenOptions={{ 
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: theme.colors.primary, 
                    },
                    headerTintColor: '#FFF', 
                    headerShadowVisible: false,
                }}
            >  
                <Stack.Screen name="index" options={{
                    headerShown: true, 
                    title: "TaskFlow", 
                    headerRight: () => (
                        // <IconButton
                        //     icon="filter-variant"
                        //     iconColor="#FFF"
                        //     size={24}
                        //     onPress={() => {
                        //         console.log("abrindo modal de filtro")
                        //         setFilterModalVisible(true)
                        //     }}
                        // />
                        <TouchableOpacity 
                            onPress={() => {
                            console.log("abrindo modal de filtro")
                            setFilterModalVisible(true)
                        }}>
                            <Text> Teste </Text>
                        </TouchableOpacity>
                    ),
                    }}
                />
                <Stack.Screen name="adicionarTarefa" options={{headerShown: true, title: "Adicionar Tarefa", headerTitleAlign: "center"}}/>
                <Stack.Screen 
                    name="tarefa/[id]" 
                    initialParams={{ isEditing: "false" }}
                    options={{
                        title: "Detalhes da tarefa", 
                        headerTitleAlign: "center", 
                    }}
                />
            </Stack>
            
            {/* <FilterModal
                visible={filterModalVisible}
                onDismiss={() => setFilterModalVisible(false)}
                currentFilters={currentFilters}
                onApplyFilters={(filters) => {
                    setCurrentFilters(filters);
                    router.setParams({ filters: JSON.stringify(filters) });
                    setFilterModalVisible(false);
                }}
            /> */}
        </>
    );
}