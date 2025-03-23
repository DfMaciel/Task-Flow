import { Stack } from "expo-router";

export default function LayoutAutenticacao() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="inicial" />
            <Stack.Screen name="logar" />
            <Stack.Screen name="cadastro"/>
            <Stack.Screen name="esqueciasenha"/>  
        </Stack>
    )
}