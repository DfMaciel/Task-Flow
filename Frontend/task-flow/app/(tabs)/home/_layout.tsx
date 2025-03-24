import { Stack } from "expo-router";

export default function LayoutHome() {
    return (
        <Stack screenOptions={{ headerShown: false }}>  
            <Stack.Screen name="index" />
            <Stack.Screen name="adicionarTarefa" options={{headerShown: true, title: ""}}/>
        </Stack>
    );
}