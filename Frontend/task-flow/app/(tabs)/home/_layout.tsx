import { Stack, useRouter } from "expo-router";
import { Icon, IconButton, useTheme } from "react-native-paper";

export default function LayoutHome() {
    const theme = useTheme();

    return (
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
                headerRight(props) {
                return (
                <IconButton
                    icon="filter-variant"
                    iconColor="#FFF"
                    size={24}
                    onPress={() => console.log("Search Pressed")}
                />
                )
            }}}/>
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
    );
}