import { Stack } from "expo-router";
import { Button } from "react-native";

export default function LayoutHome() {
    return (
        <Stack screenOptions={{ headerShown: true }}>  
            <Stack.Screen name="index" options={{headerShown: false}}/>
            <Stack.Screen name="adicionarTarefa" options={{headerShown: true, title: ""}}/>
            <Stack.Screen name="tarefa/[id]" options={{ 
                title: "Detalhes da tarefa", 
                headerTitleAlign: "center", 
                headerRight(props) {
                    return <Button title="Editar" onPress={() => {}} />
                },}} 
            />
        </Stack>
    );
}