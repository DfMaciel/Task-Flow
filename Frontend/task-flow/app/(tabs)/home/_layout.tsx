import { Stack } from "expo-router";
import { Icon, IconButton } from "react-native-paper";

export default function LayoutHome() {
    return (
        <Stack screenOptions={{ headerShown: true }}>  
            <Stack.Screen name="index" options={{headerShown: false}}/>
            <Stack.Screen name="adicionarTarefa" options={{headerShown: true, title: ""}}/>
            <Stack.Screen name="tarefa/[id]" options={{ 
                title: "Detalhes da tarefa", 
                headerTitleAlign: "center", 
                headerRight(props) {
                    return(
                    <IconButton
                        icon="pencil"
                        size={24}
                        onPress={() => console.log("Edit Pressed")}
                    />
                    );
                },}} 
            />
        </Stack>
    );
}